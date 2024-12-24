/*
Base class for all client-side modules. Loads dependencies then calls dostart()
For module loading see also main.ejs
*/
const _alreadyLoaded = [];
function Module (screenNum, instanceNum, parentPostfix) {
    
    this.instanceNum = instanceNum;
    this.screenNum = screenNum;
    this.parentPostfix = parentPostfix;

    this.loaded = false;
    this.embeddedModules = {};
    this.parentModule = null;

    this.ready = function () {if (this.startWanted) {this.dostart();}};
    this.notifyLoaded = function () {
        this.loaded = true;
        this.ready();
    }
    this.startWanted = false;
    this.start = function () {
        if (this.loaded) {
            this.dostart();
        } else {
            this.startWanted = true;
        }
    }
    this.getName = function () {
        return "Module";
    }
    
    function alreadyLoaded (resource) {
        const resourceName = Array.isArray(resource)? resource[0] : resource;
        if (_alreadyLoaded.indexOf(resourceName) > -1) {
            return true;
        };
        _alreadyLoaded.push(resourceName);
        return false;
    }
    this.loadDependencies = function (module, scriptsSources, loadDependenciesThat) {
        if (undefined == loadDependenciesThat) {
            // Not a recursion, so let's add common dependencies
            scriptsSources.push("lib/css-loader/css-loader.css");

            // Number formating support
            scriptsSources.push(["lib/autonumeric/autoNumeric.min.js", function () {
                const autoNumericOptions = {
                    decimalPlaces: 15,
                    allowDecimalPadding: false,
                    // decimalCharacter: ",",
                    // digitGroupSeparator: "",
                    //emptyInputBehavior: "zero",
                    watchExternalChanges: true,
                    unformatOnSubmit: true
                  };
                  setTimeout(function (){AutoNumeric.multiple("input.number",null, autoNumericOptions); }, 130);
            }]);
        }
        // var promises = [];
        // for (i = 0; i < scriptsSources.length; i++) {
            // const promise = new Promise((resolve, reject) => {
                // if (Array.isArray(scriptsSources[i])) {
                //     import(scriptsSources[i][1]).then((obj) => {
                //         resolve();
                //     }).catch((err) => {console.log(err); resolve();})
                    
                // } else {
                    
                    if (!loadDependenciesThat) {
                        loadDependenciesThat = this.loadDependencies;
                    }

                    function proceed () {
                        if (scriptsSources.length > 1) {
                            scriptsSources.shift();
                            loadDependenciesThat(module, scriptsSources, loadDependenciesThat);
                        } else {
                            module.notifyLoaded();
                        }
                    }

                    if (!Array.isArray(scriptsSources[0]) && scriptsSources[0].endsWith(".css")) {
                        
                        if (alreadyLoaded(scriptsSources[0])) {
                            proceed();
                            return;
                        };
                        var link = document.createElement('link');
                        link.rel = "stylesheet";
                        link.href = scriptsSources[0];
                        link.onload = function () {
                            proceed();
                        }
                        document.head.appendChild(link);
                        return;
                    }

                    if (alreadyLoaded(scriptsSources[0])) {
                        if (Array.isArray(scriptsSources[0])) {
                            // postLoad
                            scriptsSources[0][1]();
                        }
                        proceed();
                        return;
                    };

                    var script = document.createElement('script');
                    if (Array.isArray(scriptsSources[0])) {
                        script.postLoad = scriptsSources[0][1];
                    }
                    script.onload = function () {
                        if (this.postLoad) {
                            this.postLoad();
                        }
                        proceed();
                    }
                    if (Array.isArray(scriptsSources[0])) {
                        script.src = scriptsSources[0][0];
                    } else {
                        script.src = scriptsSources[0];
                    }
                    // script.type = "module";
                    document.head.appendChild(script);
                // }
            // });
            // promises.push(promise);
        // }
        // Promise.all(promises).then(()=>{
        //     module.notifyLoaded();
        // })
    },
    this.resized = function () {
        console.log("resized " + this.getName() + " screen " + this.screenNum + " instance " + this.instanceNum);
    },
    this.getInstanceNum = function (el) {
        return parseInt(el.id.substring(el.id.lastIndexOf("_") + 1));
    },
    this.getScreenNum = function (el) {
        const regex = /_([0-9]+)_/;
        return parseInt(el.id.match(regex)[1]);
    },
    this.buildPostfix = function () {
        if (this.parentPostfix) return "_" + this.parentPostfix + '_' + this.getName();
        return "_" + this.screenNum + "_" + this.getName() + "_" + this.instanceNum;
    },
    this.getRootPanel = function () {
        return document.getElementById("module" + this.buildPostfix() + "div");
    },
    this.closing = function () {
        console.log("Closing veto for screen " + this.screenNum + " panel " + this.getName() + " (" + this.instanceNum + ")");
        return true;
    }
    this.loading = function (show, txt) {
        let postfix = this.buildPostfix();
        let moduleDiv = document.querySelector('#module' + postfix + "div");
        if (false == show) {
            let loadingDiv = document.querySelector("#loadingDiv" + postfix);
            if (loadingDiv) {
                loadingDiv.parentElement.removeChild(loadingDiv);
            }
            return;
        }
        let loadingDiv = document.createElement("div");
        loadingDiv.id = "loadingDiv" + postfix;
        loadingDiv.setAttribute('class', 'loader loader-default is-active');
        loadingDiv.setAttribute('style', 'position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;');
        if (txt) loadingDiv.setAttribute('data-text', txt);
        moduleDiv.appendChild(loadingDiv);
    }

    this.registerEmbeddedModules = function (id, module) {
        this.embeddedModules[id] = module;
    }
    this.registerParentModule = function (module) {
        this.parentModule = module;
    }
}