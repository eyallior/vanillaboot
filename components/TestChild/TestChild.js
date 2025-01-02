function _TestChild (element, parent) {

    VanillaBootComponent.call(this, element, parent);
    this.loadDependencies(this, [
        "/components/TestChild/sampleDependency.css",
        ["/components/TestChild/sampleDependency.js", function () {
            // This will be called after the dependency is loaded.
        }],
        "/components/TestChild/sampleDependency2.js"
    ]);

    // console.log("TestChild " + element.dataset.id + " of " + parent.element.dataset.id);

    this.dostart = function ()
    {
        callSampleDependency(this.element);
    }

    this.parentComponentWillCallThis = function (text) {
        let testSpan = this.element.querySelector('#TestSpan');
        testSpan.innerHTML += text;
    }

    let testSpan = this.element.querySelectorAll(".IDSpan");
    for (let i = 0; i < testSpan.length; i++) {
        testSpan[i].innerHTML = this.element.dataset.id;
    }
    this.parent.callFromChild(this, "Hi " + this.parent.element.dataset.id + "! I'm " + this.element.dataset.id);

    this.getName = function () {return "TestChild"}

    this.callMylself = function ()
    {
        let testSpan = this.element.querySelector('#TestSpan');
        testSpan.innerHTML += "<br>I called myself.";
    }

    this.callP2C1 = function ()
    {
        vanillaBootComponents.findComponent(["P2", "C1"]).element.querySelector('#TestSpan').innerHTML += "<br>Called from " + this.element.dataset.id;
    }
    
}
_TestChild.prototype = new VanillaBootComponent();
_TestChild.prototype.constructor = _TestChild;