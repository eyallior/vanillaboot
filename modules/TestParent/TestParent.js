function _TestParent (element) {

    Module.call(this, element);
    this.loadDependencies(this, []);

    this.dostart = function () {
        const postfix = this.buildPostfix();
        if (!document.querySelector('#SomeParentSpanId' + postfix + ""))
        {
            console.error("Error - no " + '#SomeParentSpanId' + postfix);
            return;
        }
        let testSpan = document.querySelector('#SomeParentSpanId' + postfix + "").querySelectorAll(".IDSpan");
        for (let i = 0; i < testSpan.length; i++) {
            testSpan[i].innerHTML = this.instanceNum;
        }
    }

    this.callFromEmbedded = function (id, text) {
        const postfix = this.buildPostfix();
        let testSpan = document.querySelector('#TestSpanInParent' + postfix);
        testSpan.innerHTML += text + "<br>";
        this.embeddedModules[id].parentModuleWillCallThis("Hi son " + id + "! (" + this.instanceNum + ")");
        // var endTime = performance.now();
        // alert(endTime - window.startTime);
        
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

_TestParent.prototype = new Module();
_TestParent.prototype.constructor = _TestParent;
// var TestParent = new _TestParent();
