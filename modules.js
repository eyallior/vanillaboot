function VBModules (roomEl)
{

    var openedModules = {}; // contains ([activeScreen][moduleName]) module instances
    var loadedModules = {}; // key = module name, value = true

    window.userSetup = JSON.parse(localStorage.getItem("userSetup"));
    if (!window.userSetup) {
        window.userSetup = {general:{useTabs: false, reopenLastScreens: true}};
        localStorage.setItem("userSetup", JSON.stringify(window.userSetup));
    }

    function getActiveScreen () {
        if (typeof rootLayout === "undefined") return -1;
        for (let i = 0; i < rootLayout.root.contentItems[ 0 ].contentItems.length; i++) {
            if (rootLayout.root.contentItems[ 0 ].contentItems[i].tab.isActive) {
                return rootLayout.root.contentItems[ 0 ].contentItems[i].config.componentState.screenNum;
            }
        }
        return -1;
    }
    function removeOpenedModules (screenNum, moduleInstancesToRemove) {
        for (let i = 0; i < moduleInstancesToRemove.length; i++) {
                if (openedModules[screenNum][moduleInstancesToRemove[i].module].length == 1) {
                    delete openedModules[screenNum][moduleInstancesToRemove[i].module];
                } else {
                    let instances = openedModules[screenNum][moduleInstancesToRemove[i].module];
                    for (let j = 0; j < instances.length; j++) {
                        if (instances[j].instanceNum == moduleInstancesToRemove[i].instanceNum) {
                            instances.splice(j,1);
                            break;
                        }
                    }
                }
            }
    }

    /***
     * This is the startin point of loading client side modules.
     * It loads the main template and javascript file of a module, and calls it's start()
     * The module than (through module.js) loads it's own dependencies.
     * This methods knows to not download scripts twice.
     * TODO: teach it to not download templates twice (see 2nd fetch in this function)
     * */
    this.showModule = function (module, title, e) {

        // checkUseTabs();
        
        if (window.userSetup.general.reopenLastScreens != false) {
            window.userSetup.general.reopenLastScreens = [[module, title]]; // TODO: this supports only useTabs=false atm
            localStorage.setItem("userSetup", JSON.stringify(window.userSetup));
        }

        // window.startTime = performance.now();
        var activeScreen = getActiveScreen();
        
        if (!e || !e.ctrlKey) {
            // If CTRL is not pressed, close all opened panels (and confirm if unsaved data)
            let moduleInstancesToRemove = [];
            function removeContentItem (component, i, j, instances) {
                var componentState = component.componentState;
                if (componentState == undefined) {
                    componentState = component.content[0].componentState;
                }
                if (
                    componentState.moduleName == p &&
                    componentState.instanceNum == instances[i].instanceNum
                ) {
                    myLayouts[activeScreen].root.contentItems[ 0 ].contentItems[j].remove();
                    return true;
                }
                return false;
            }
            for (p in openedModules[activeScreen]) {
                let instances = openedModules[activeScreen][p];
                for (let i = 0; i < instances.length; i++) {
                    var canClosePanel = instances[i].closing();
                    if (canClosePanel) {
                        moduleInstancesToRemove.push({module: p, instanceNum: instances[i].instanceNum});
                        // Find the contentItem (panel/tab/window however you call it) and remove it
                        for (let j = 0; j < myLayouts[activeScreen].root.contentItems[ 0 ].contentItems.length; j++) {
                            var component = myLayouts[activeScreen].root.contentItems[ 0 ].contentItems[j].config.content[0];
                            if (!component.componentState && component.content.length > 0) {
                                for (let k = 0; k < component.content.length; k++) {
                                    var shouldBreak = removeContentItem(component.content[k], i, j, instances);
                                    if (shouldBreak) break;
                                }
                            } else {
                                var shouldBreak = removeContentItem(component, i, j, instances);
                                    if (shouldBreak) break;
                            }
                        }
                    }
                }
            }
            
            // Remove from openedModules
            removeOpenedModules(activeScreen, moduleInstancesToRemove);
            
        }

        // Mark active menu screen item
        if (e && e.path && e.path.length > 1)
        {
            e.path[2].querySelectorAll("a").forEach(a => {a.classList.remove("menuItemActive");})
            e.path[0].classList.add("menuItemActive");
        }

        var moduleInstanceId;
        var instanceNum = 0;
        var firstLoad = false;
        let templateLoadComplete = false;
        if (!loadedModules[module]) {
            moduleInstanceId = activeScreen + "_" + module + "_0";
            if (!openedModules[activeScreen]) {
                openedModules[activeScreen] = {};
            }
            firstLoad = true;
            var script = document.createElement('script');
            script.src = "modules/" + module + "/" + module + ".js";
            script.onload = function () {
                // next time the already loaded script is needed, start will be called bellow in the end of this method
                var newModule = new window["_" + module](activeScreen, instanceNum);
                
                // Delayed call when html has loaded
                let initWhenReady = setInterval (()=>{
                    if (templateLoadComplete) {
                        clearInterval(initWhenReady);
                        newModule.start();
                    }
                    }, 50);
                
                loadedModules[module] = true;
                openedModules[activeScreen][module] = [newModule];
                
            }
            document.head.appendChild(script); 
            
            

        } else {
            if (!openedModules[activeScreen]) {
                openedModules[activeScreen] = {};
            }
            if (!openedModules[activeScreen][module]) {
                instanceNum = 0;
                openedModules[activeScreen][module] = [];
            } else {
                instanceNum = 1;
                for (let i = 0; i < openedModules[activeScreen][module].length; i++) {
                    if (instanceNum <= openedModules[activeScreen][module][i].instanceNum)
                    instanceNum = openedModules[activeScreen][module][i].instanceNum + 1;
                }
            }
            moduleInstanceId = activeScreen + "_" + module + "_" + instanceNum;
            openedModules[activeScreen][module].push(new window["_" + module](activeScreen, instanceNum));
        }
        console.log("Creating panel on screen " + activeScreen + " type " + module + " instance " + instanceNum);
        var newItemConfig = {
            type: 'component',
            componentName: 'modules',
            title: title,
            componentState: { text: '<div id="module_' + moduleInstanceId + 'div" style="height: 100%; width: 100%; overflow: auto;"></div>', instanceNum: instanceNum, moduleName: module, screenNum: activeScreen }
        };
        if (window.userSetup.general.useTabs)
        {
            myLayouts[activeScreen].root.contentItems[ 0 ].addChild( newItemConfig );
        } else {
            let newDiv = document.createElement("div");
            newDiv.setAttribute("id", "module_" + moduleInstanceId + "div");
            newDiv.setAttribute("style", "height: 100%; width: 100%; overflow: auto;");
            document.getElementById(roomEl).innerHTML = "";
            document.getElementById(roomEl).appendChild(newDiv);
        }
        

        function loadEmbeddedModule (id, embeddableModuleSrc, props) {
            let path = embeddableModuleSrc;
            let file = embeddableModuleSrc.indexOf("/") > -1? embeddableModuleSrc.substring(embeddableModuleSrc.lastIndexOf("/") + 1) : embeddableModuleSrc;
            fetch ("modules/" + path + "/" + file + ".html").then(function (response) { return response.text(); }).then(function (html) {
                var parser = new DOMParser();

                // Parse the text
                var doc = parser.parseFromString(html, "text/html");
                
                var templateHTML = doc.body.innerHTML;
                // all elements in module get suffix _screenNum_moduleName_instanceNum
                let idPostfix = embeddableModuleSrc.replaceAll("/", "_"); // Because / is not valid html selector
                templateHTML = templateHTML.replace(/ id="([a-zA-Z0-9_\-]+)"/g, ' id="$1_' + id + "_" + idPostfix + '"');
                templateHTML = templateHTML.replace(/for="([a-zA-Z0-9_\-]+)"/g, 'for="$1_' + id + "_" + idPostfix + '"');

                document.querySelector("#EmbeddedModule_" + id + "div").innerHTML = templateHTML;

                function startEmbeddedModule () {
                    var newModule = new window["_" + file](activeScreen, instanceNum, id);
                    let parentModule = openedModules[activeScreen][module][openedModules[activeScreen][module].length - 1];
                    if (props.eid) {
                        newModule.id = props.eid;
                        parentModule.registerEmbeddedModules(props.eid, newModule);
                    }
                    
                    newModule.registerParentModule(parentModule);
                    
                    newModule.start();
                }
                
                if (!loadedModules[embeddableModuleSrc]) {
                    var script = document.createElement('script');
                    script.src = "modules/" + path + "/" + file + ".js";
                    script.onload = function () {
                        loadedModules[embeddableModuleSrc] = true;
                        startEmbeddedModule();
                    }
                    document.head.appendChild(script); 
                } else {
                    startEmbeddedModule();
                }

            });
        }

        // TODO: cache the templates
        fetch ("modules/" + module + "/" + module + ".html").then(function (response) {
            return response.text();
        }).then(function (html) {
            var parser = new DOMParser();

            // Parse the text
            var doc = parser.parseFromString(html, "text/html");
            
            var templateHTML = doc.body.innerHTML;

            // all elements in module get suffix _screenNum_moduleName_instanceNum
            templateHTML = templateHTML.replace(/ id="([a-zA-Z0-9_\-]+)"/g, ' id="$1_' + moduleInstanceId + '"');
            templateHTML = templateHTML.replace(/for="([a-zA-Z0-9_\-]+)"/g, 'for="$1_' + moduleInstanceId + '"');

            // references to the module replaced with getter of relevant instance of module

            templateHTML = templateHTML.replaceAll(module + ".", 
                "getModule('" + activeScreen + "', '" + instanceNum + "', '" + module + "').");
            templateHTML = templateHTML.replaceAll("#THEME#", "-dark");

            let embeddedModules = [...templateHTML.matchAll(/{:.*:}/g)];

            for (let i = 0; i < embeddedModules.length; i++) {
                let embeddedModulestr = embeddedModules[i][0].slice(2, embeddedModules[i][0].length - 4).trim();
                let newId = moduleInstanceId + "_" + i;
                templateHTML = templateHTML.replace(embeddedModules[i][0], "<div id='EmbeddedModule_" + newId + "div'></div>");
                embeddedModulesrc = embeddedModulestr.split(" ")[0];
                embededProps = [...embeddedModulestr.matchAll(/([a-zA-Z0-9]+)="([^"]*)"/g)];
                embededPropsObj = {};
                for (let j = 0; j < embededProps.length; j++) {
                    embededPropsObj[embededProps[j][1]] = embededProps[j][2];
                }
                loadEmbeddedModule(newId, embeddedModulesrc, embededPropsObj);
            }

            document.querySelector("#module_" + moduleInstanceId + "div").innerHTML = templateHTML;

            if (!firstLoad) {
                // Module might not yet be loaded - it will be started via script.onload above
                for (let i = 0; i < openedModules[activeScreen][module].length; i++) {
                    if (openedModules[activeScreen][module][i].instanceNum == instanceNum) {
                        openedModules[activeScreen][module][i].start();
                    }
                }
            } else {
                templateLoadComplete = true;
            }
        });
    }

    this.getModule = function (screenNum, instanceNum, module) {
        for (let i = 0; i < openedModules[screenNum][module].length; i++) {
            if (openedModules[screenNum][module][i].instanceNum == instanceNum) {
                return openedModules[screenNum][module][i];
            }
        }
        return null;
    }

}

// var VBModules = new VBModules();
