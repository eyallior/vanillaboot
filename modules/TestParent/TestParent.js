function _TestParent (element, parent) {

    VanillaBootModule.call(this, element, parent);
    this.loadDependencies(this, []);

    // console.log("TestParent " + element.dataset.id);

    this.dostart = function ()
    {
        // alert(this.getName());
    }

    let testSpan = this.element.querySelectorAll(".IDSpan");
    for (let i = 0; i < testSpan.length; i++) {
        testSpan[i].innerHTML = this.element.dataset.id;
    }

    this.callFromChild = function (child, text) {
        let testSpan = this.element.querySelector('#TestSpanInParent');
        testSpan.innerHTML += text + "<br>";
        child.parentModuleWillCallThis("Hi son " + child.element.dataset.id + "! (" + this.element.dataset.id + ")");
    }

    this.getName = function () {return "TestParent"}
    this.resized = function () {
            
    }


    
    this.closing = function () {
        console.log("Closing veto (override) for screen " + this.screenNum + " panel TestParent (" + this.instanceNum + ")");
        // return confirm ("Close screen " + this.screenNum + " TestParent (" + this.instanceNum + ")?");
        return this.__proto__.closing();
    }


      
  
}

_TestParent.prototype = new VanillaBootModule();
_TestParent.prototype.constructor = _TestParent;
// var TestParent = new _TestParent();
