function _TestComponent (screenNum, instanceNum, embedNum) {
    Module.call(this, screenNum, instanceNum, embedNum);
    this.loadDependencies(this, []);

    this.dostart = function () {
        const postfix = this.buildPostfix();
        let testSpan = document.querySelector('#TestComponent' + postfix + "").querySelectorAll(".IDSpan");
        for (let i = 0; i < testSpan.length; i++) {
            testSpan[i].innerHTML = this.id;
        }
        
        this.parentModule.callFromEmbedded(this.id, "Hi dad! I'm component " + this.id);
    }

    this.getName = function () {return "TestComponent"}

    this.parentModuleWillCallThis = function (text) {
        const postfix = this.buildPostfix();
        let testSpan = document.querySelector('#TestSpan' + postfix); //this.parentModule
        testSpan.innerHTML += text;
    }
}
_TestComponent.prototype = new Module();
_TestComponent.prototype.constructor = _TestComponent;