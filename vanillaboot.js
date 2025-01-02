function VanillaBootComponents (rootEl)
{
    this.rootElement = document.getElementById(rootEl);

    var loadedComponents = {}; // Marks loaded components
    var loadedTemplates = {}; // Saves loaded templates (as-is)
    var elementsToComponents = new Map();
    
    this.findContainer = function (el)
    {
        if (elementsToComponents.has(el)) return elementsToComponents.get(el);
        return this.findContainer(el.parentElement);
    }

    this.findComponent = function (idArray)
    {
        function recurseFindComponent (_idArray, el)
        {
            let firstId = _idArray.shift();
            el = el.querySelector(("[data-id='" + firstId + "']"));
            if (_idArray.length > 0) return recurseFindComponent(_idArray, el);
            else return elementsToComponents.get(el);
        }
        return recurseFindComponent(idArray, document);
    }

    this.showComponent = async function (component, title, targetEl)
    {
        // TODO: Consult veto and close previous
        
        loadedComponents = await loadComponent(component, []);

        this.rootElement.innerHTML = loadedTemplates[component];

        var newComponent = new window["_" + component](this.rootElement, null); // initiate the root component
        newComponent.start();

        elementsToComponents.set(this.rootElement, newComponent);
        
        function attachComponents (componentsElements, parent)
        {
            for (let i = 0; i < componentsElements.length; i++) {
                if (componentsElements[i].dataset.initiated) continue;
                componentsElements[i].innerHTML = loadedTemplates[componentsElements[i].dataset.name];
                let component = new window["_" + componentsElements[i].dataset.name](componentsElements[i], parent); // initiate component
                component.start();
                componentsElements[i].dataset.initiated = true;
                elementsToComponents.set(componentsElements[i], component);
                attachComponents(componentsElements[i].getElementsByClassName("VanillaBootComponent"), component);
            }
        }
        attachComponents(this.rootElement.getElementsByClassName("VanillaBootComponent"), newComponent);

        
    }

    async function loadComponent (component, loadedComponents)
    {
        return (function(){
        // TODO: Use closure to protect
        const p = new Promise(async (resolve, reject) => {

            const scriptPromise = new Promise((resolve, reject) => {
                loadComponentScript(component).then((values)=>{resolve(values)});
            });
            
            const templatePromise = new Promise((resolve, reject) => {
                loadComponentTemplate(component).then((values)=>{resolve(values)});
            });
            Promise.all([scriptPromise, templatePromise]).then((values)=>{
                // Load embeded components
                if (values[1].length > 0)
                {
                    const promises = [];
                    for (let i = 0; i < values[1].length; i++) {
                        (function(){
                            promises.push(new Promise((resolve, reject) => {
                                if (loadedComponents) loadedComponents.push(component);
                                loadComponent(values[1][i], loadedComponents? loadedComponents : [component]).then(() => {resolve()});
                            }));
                        })();
                        
                    }
                    Promise.all(promises).then((values)=>{
                        resolve(loadedComponents);
                    });
                }
                else 
                {
                    loadedComponents.push(component);
                    resolve(loadedComponents);
                }
            });
            
        });
        return p;
    })();
    }

    function loadComponentScript (component)
    {
        // TODO: Use closure to protect
        const p = new Promise((resolve, reject) => {
            if (loadedComponents[component]) 
            {
                resolve(0);
                return;
            }
            var script = document.createElement('script');
            script.src = "components/" + component + "/" + component + ".js";
            script.onload = function () {
                loadedComponents[component] = true;
                resolve(0);
            }
            document.head.appendChild(script);
        });
        return p;
    }

    function loadComponentTemplate (component)
    {
        // TODO: Use closure to protect
        const p = new Promise((resolve, reject) => {
            
            if (loadedTemplates[component])
            {
                // We've already loaded this component's template and all it's embedded leafs
                resolve([]);
                return;
            }

            fetch ("components/" + component + "/" + component + ".html").then(
                function (response) { return response.text(); }).then(
                    function (html) {

                var parser = new DOMParser();

                // Parse the text
                var doc = parser.parseFromString(html, "text/html");
                const embeddedComponents = doc.getElementsByClassName("VanillaBootComponent");
                let embeddedComponentsNames = [];
                for (let i = 0; i < embeddedComponents.length; i++) {
                    var embeddedComponentName = embeddedComponents[i].dataset.name;
                    if (!loadedTemplates[embeddedComponentName] && embeddedComponentsNames.indexOf(embeddedComponentName) == -1)
                        embeddedComponentsNames.push(embeddedComponentName);
                }
                var templateHTML = doc.body.innerHTML;
                loadedTemplates[component] = templateHTML;
                
                resolve(embeddedComponentsNames);
            });
        });
        return p;
    }

}

const loadedDependencies = [];
var currentlyLoadingDependencies = {};
var waitingToInit = {};

function VanillaBootComponent (element, parent) {
    
    this.element = element;
    this.parent = parent;
    
    this.loaded = false;
    this.embeddedComponents = {};
    this.parentComponent = null;

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
        return "Component";
    }
    
    function isAlreadyLoaded (resource) {
        const resourceName = Array.isArray(resource)? resource[0] : resource;
        if (loadedDependencies.indexOf(resourceName) > -1) {
            return "loaded";
        }
        if (currentlyLoadingDependencies[resourceName]) {
            return "loading";
        }
        return "no";
    }
    
    function setAlreadyLoaded (resource) {
        const resourceName = Array.isArray(resource)? resource[0] : resource;
        loadedDependencies.push(resourceName);
    }

    this.loadDependencies = function (component, scriptsSources, loadDependenciesThat) {
        
        // TODO: Closure protect scriptsSources
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
                            loadDependenciesThat(component, scriptsSources, loadDependenciesThat);
                        } else {
                            // console.log((parent && parent.element && parent.element.dataset.id? parent.element.dataset.id + " : ": "")  + element.dataset.id + " proceed");
                            component.notifyLoaded();
                        }
                    }

                    if (!Array.isArray(scriptsSources[0]) && scriptsSources[0].endsWith(".css")) {
                        
                        if (isAlreadyLoaded(scriptsSources[0]) == "loaded") {
                            proceed();
                            return;
                        }
                        else if (isAlreadyLoaded(scriptsSources[0]) == "loading")
                        {
                            if (!waitingToInit[scriptsSources[0]]) waitingToInit[scriptsSources[0]] = [proceed];
                            else waitingToInit[scriptsSources[0]].push(proceed);
                            return;
                        }
                        const resourceName = Array.isArray(scriptsSources[0])? scriptsSources[0][0] : scriptsSources[0];
                        currentlyLoadingDependencies[resourceName] = 1;
                        var link = document.createElement('link');
                        link.rel = "stylesheet";
                        link.href = scriptsSources[0];
                        link.onload = function () {
                            const resourceName = Array.isArray(scriptsSources[0])? scriptsSources[0][0] : scriptsSources[0];
                            setAlreadyLoaded(scriptsSources[0]);
                            proceed();
                            for(var key in waitingToInit){
                                if(waitingToInit.hasOwnProperty(key)){
                                    for (let i = 0; i < waitingToInit[key].length; i++) {
                                        waitingToInit[key][i]();
                                    }
                                }
                            }
                            waitingToInit[resourceName] = [];
                            currentlyLoadingDependencies[resourceName] = [];
                        }
                        document.head.appendChild(link);
                        return;
                    }

                    if (isAlreadyLoaded(scriptsSources[0]) == "loaded") {
                        if (Array.isArray(scriptsSources[0])) {
                            // postLoad
                            // scriptsSources[0][1](); // Commented out - we only call postload once (assuming it's more related to the dependency than the instance using it)
                        }
                        proceed();
                        return;
                    }
                    else if (isAlreadyLoaded(scriptsSources[0]) == "loading")
                    {
                        if (!waitingToInit[scriptsSources[0]]) waitingToInit[scriptsSources[0]] = [proceed];
                        else waitingToInit[scriptsSources[0]].push(proceed);
                        return;
                    }
                    const resourceName = Array.isArray(scriptsSources[0])? scriptsSources[0][0] : scriptsSources[0];
                    currentlyLoadingDependencies[resourceName] = 1;
                        
                    var script = document.createElement('script');
                    if (Array.isArray(scriptsSources[0])) {
                        script.postLoad = scriptsSources[0][1];
                    }
                    script.onload = function () {
                        setAlreadyLoaded(scriptsSources[0]);
                        if (this.postLoad) {
                            this.postLoad();
                        }
                        proceed();
                        for(var key in waitingToInit){
                            if(waitingToInit.hasOwnProperty(key)){
                                for (let i = 0; i < waitingToInit[key].length; i++) {
                                    waitingToInit[key][i]();
                                }
                            }
                        }
                        const resourceName = Array.isArray(scriptsSources[0])? scriptsSources[0][0] : scriptsSources[0];
                        waitingToInit[resourceName] = [];
                        currentlyLoadingDependencies[resourceName] = [];
                    }
                    
                    if (Array.isArray(scriptsSources[0])) {
                        script.src = scriptsSources[0][0];
                    } else {
                        script.src = scriptsSources[0];
                    }
                    // script.type = "component";
                    document.head.appendChild(script);
                // }
            // });
            // promises.push(promise);
        // }
        // Promise.all(promises).then(()=>{
        //     component.notifyLoaded();
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
        let componentDiv = document.querySelector('#component' + postfix + "div");
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
        componentDiv.appendChild(loadingDiv);
    }

    // this.registerEmbeddedComponents = function (id, component) {
    //     this.embeddedComponents[id] = component;
    // }
    // this.registerParentComponent = function (component) {
    //     this.parentComponent = component;
    // }
    
}
