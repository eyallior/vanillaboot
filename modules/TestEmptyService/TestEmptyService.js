function _TestEmptyService (screenNum, instanceNum) {

    Module.call(this, screenNum, instanceNum);
    this.loadDependencies(this, []);

    this.dostart = function () {
        // let that = this;
        // setTimeout(() => {
        //     that.embeddedModules["tc1"].parentModuleWillCallThis("Hi son!");
        // }, 1000);
        const postfix = this.buildPostfix();
        let testSpan = document.querySelector('#TestEmptyServiceMainSpan' + postfix + "").querySelectorAll(".IDSpan");
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

    this.getName = function () {return "TestEmptyService"}
    this.resized = function () {
            
    }


    
    this.closing = function () {
        console.log("Closing veto (override) for screen " + this.screenNum + " panel TestEmptyService (" + this.instanceNum + ")");
        // return confirm ("Close screen " + this.screenNum + " TestEmptyService (" + this.instanceNum + ")?");
        return this.__proto__.closing();
    }


      
  
}

_TestEmptyService.prototype = new Module();
_TestEmptyService.prototype.constructor = _TestEmptyService;
// var TestEmptyService = new _TestEmptyService();
