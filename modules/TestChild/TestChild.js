function _TestChild (element, parent) {

    VanillaBootModule.call(this, element, parent);
    this.loadDependencies(this, [
        "/modules/TestChild/sampleDependency.css",
        ["/modules/TestChild/sampleDependency.js", function () {
            if ( typeof changeOpacity != "undefined") changeOpacity(element, "red"); // TODO: This is called before dependency is loaded - fix!
        }]
    ]);

    // console.log("TestChild " + element.dataset.id + " of " + parent.element.dataset.id);

    this.dostart = function ()
    {
        if ( typeof changeOpacity != "undefined") 
            {
                changeOpacity(this.element, "ddeeppink");
                // alert(this.element.dataset.id + " blue");
            }
            else 
            {
                // alert(this.element.dataset.id);
            }
        // alert(this.getName());
    }

    this.parentModuleWillCallThis = function (text) {
        let testSpan = this.element.querySelector('#TestSpan');
        testSpan.innerHTML += text;
    }

    let testSpan = this.element.querySelectorAll(".IDSpan");
    for (let i = 0; i < testSpan.length; i++) {
        testSpan[i].innerHTML = this.element.dataset.id;
    }
    this.parent.callFromChild(this, "Hi dad! I'm child " + this.element.dataset.id);

    this.getName = function () {return "TestChild"}

    
}
_TestChild.prototype = new VanillaBootModule();
_TestChild.prototype.constructor = _TestChild;