function _TestGrandParent (element, parent) {

    VanillaBootModule.call(this, element, parent);
    this.loadDependencies(this, []);

    console.log("TestGrandParent " + element.dataset.id);

    this.dostart = function ()
    {
        // alert(this.getName());
    }

    this.callFromChild = function (id, text) {
        let testSpan = this.element.querySelector('#TestSpanInGrandParent_' + id);
        testSpan.innerHTML += text + "<br>";
        // this.embeddedModules[id].parentModuleWillCallThis("Hi son " + id + "! (" + this.instanceNum + ")");
        // var endTime = performance.now();
        // alert(endTime - window.startTime);
        
    }

    this.getName = function () {return "TestGrandParent"}
    this.resized = function () {
            
    }


    
    this.closing = function () {
        console.log("Closing veto (override) for screen " + this.screenNum + " panel TestGrandParent (" + this.instanceNum + ")");
        // return confirm ("Close screen " + this.screenNum + " TestGrandParent (" + this.instanceNum + ")?");
        return this.__proto__.closing();
    }


      
  
}

_TestGrandParent.prototype = new VanillaBootModule();
_TestGrandParent.prototype.constructor = _TestGrandParent;
// var TestGrandParent = new _TestGrandParent();
