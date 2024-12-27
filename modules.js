function VanillaBootModules (rootEl)
{
    this.rootElement = document.getElementById(rootEl);

    var loadedModules = {}; // Marks loaded modules
    var loadedTemplates = {}; // Saves loaded templates (as-is)
    // var flattenedTemplates = {}; // 

    this.showModule = async function (module, title, targetEl)
    {
        // TODO: Consult veto and close previous
        
        var loadedModules = await loadModule(module, []);

        this.rootElement.innerHTML = loadedTemplates[module];

        var newModule = new window["_" + module](this.rootElement, null); // initiate the root module
        
        function attachModules (modulesElements, parent)
        {
            for (let i = 0; i < modulesElements.length; i++) {
                if (modulesElements[i].dataset.initiated) continue;
                modulesElements[i].innerHTML = loadedTemplates[modulesElements[i].dataset.name];
                let module = new window["_" + modulesElements[i].dataset.name](modulesElements[i], parent); // initiate module
                modulesElements[i].dataset.initiated = true;
                attachModules(modulesElements[i].getElementsByClassName("VanillaBootModule"), module);
            }
        }
        attachModules(this.rootElement.getElementsByClassName("VanillaBootModule"), newModule);

        
    }

    async function loadModule (module, loadedModules)
    {
        return (function(){
        // TODO: Use closure to protect
        const p = new Promise(async (resolve, reject) => {

            const scriptPromise = new Promise((resolve, reject) => {
                loadModuleScript(module).then((values)=>{resolve(values)});
            });
            
            const templatePromise = new Promise((resolve, reject) => {
                loadModuleTemplate(module).then((values)=>{resolve(values)});
            });
            Promise.all([scriptPromise, templatePromise]).then((values)=>{
                // Load embeded modules
                if (values[1].length > 0)
                {
                    const promises = [];
                    for (let i = 0; i < values[1].length; i++) {
                        (function(){
                            promises.push(new Promise((resolve, reject) => {
                                if (loadedModules) loadedModules.push(module);
                                loadModule(values[1][i], loadedModules? loadedModules : [module]).then(() => {resolve()});
                            }));
                        })();
                        
                    }
                    Promise.all(promises).then((values)=>{
                        resolve(loadedModules);
                    });
                }
                else 
                {
                    loadedModules.push(module);
                    resolve(loadedModules);
                }
            });
            
        });
        return p;
    })();
    }

    function loadModuleScript (module)
    {
        // TODO: Use closure to protect
        const p = new Promise((resolve, reject) => {
            if (loadedModules[module]) 
            {
                resolve(0);
                return;
            }
            var script = document.createElement('script');
            script.src = "modules/" + module + "/" + module + ".js";
            script.onload = function () {
                loadedModules[module] = true;
                resolve(0);
            }
            document.head.appendChild(script);
        });
        return p;
    }

    function loadModuleTemplate (module)
    {
        // TODO: Use closure to protect
        const p = new Promise((resolve, reject) => {
            
            if (loadedTemplates[module])
            {
                // We've already loaded this module's template and all it's embedded leafs
                resolve([]);
                return;
            }

            fetch ("modules/" + module + "/" + module + ".html").then(
                function (response) { return response.text(); }).then(
                    function (html) {

                var parser = new DOMParser();

                // Parse the text
                var doc = parser.parseFromString(html, "text/html");
                const embeddedModules = doc.getElementsByClassName("VanillaBootModule");
                let embeddedModulesNames = [];
                for (let i = 0; i < embeddedModules.length; i++) {
                    var embeddedModuleName = embeddedModules[i].dataset.name;
                    if (!loadedTemplates[embeddedModuleName] && embeddedModulesNames.indexOf(embeddedModuleName) == -1)
                        embeddedModulesNames.push(embeddedModuleName);
                }
                var templateHTML = doc.body.innerHTML;
                loadedTemplates[module] = templateHTML;
                
                resolve(embeddedModulesNames);
            });
        });
        return p;
    }

}

function VanillaBootModule (element, parent) {
    
    this.element = element;
    this.parent = parent;
    
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
        
        if (scriptsSources.length == 0)
        {
            proceed();
            return;
        }

        if (undefined == loadDependenciesThat) {
            // Not a recursion, so let's add common dependencies
            // scriptsSources.push("lib/css-loader/css-loader.css");

            // Number formating support
            /*
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
            */
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
