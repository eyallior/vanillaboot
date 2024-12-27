function _TestChild (element) {

    Module.call(this, element);
    this.loadDependencies(this, []);

    this.dostart = function () {
        const postfix = this.buildPostfix();
        let testSpan = document.querySelector('#TestChild' + postfix + "").querySelectorAll(".IDSpan");
        for (let i = 0; i < testSpan.length; i++) {
            testSpan[i].innerHTML = this.id;
        }
        this.parentModule.callFromEmbedded(this.id, "Hi dad! I'm child " + this.id);
    }

    this.getName = function () {return "TestChild"}

    this.parentModuleWillCallThis = function (text) {
        const postfix = this.buildPostfix();
        let testSpan = document.querySelector('#TestSpan' + postfix); //this.parentModule
        testSpan.innerHTML += text;
    }
}
_TestChild.prototype = new Module();
_TestChild.prototype.constructor = _TestChild;