function _TestGrandParent (element) {

    Module.call(this, element);
    this.loadDependencies(this, []);

    this.dostart = function () {
        const postfix = this.buildPostfix();
        // let testSpan = document.querySelector('#SomeSpanId' + postfix + "").querySelectorAll(".IDSpan");
        // for (let i = 0; i < testSpan.length; i++) {
        //     testSpan[i].innerHTML = this.instanceNum;
        // }
    }

    this.callFromEmbedded = function (id, text) {
        const postfix = this.buildPostfix();
        let testSpan = document.querySelector('#TestSpanInGrandParent' + postfix);
        testSpan.innerHTML += text + "<br>";
        this.embeddedModules[id].parentModuleWillCallThis("Hi son " + id + "! (" + this.instanceNum + ")");
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

_TestGrandParent.prototype = new Module();
_TestGrandParent.prototype.constructor = _TestGrandParent;
// var TestGrandParent = new _TestGrandParent();
