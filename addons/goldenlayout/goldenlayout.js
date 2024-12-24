function checkUseTabs () {
    window.userSetup = JSON.parse(localStorage.getItem("userSetup"));
    if (!window.userSetup) {
        window.userSetup = {general:{useTabs: false, reopenLastScreens: true}};
        localStorage.setItem("userSetup", JSON.stringify(window.userSetup));
    }
    let mainlayoutNoTabs = document.getElementById("mainlayoutNoTabs");
    let mainlayout = document.getElementById("mainlayout");
    if (window.userSetup.general.useTabs) {
        mainlayoutNoTabs.style.display = "none";
        mainlayout.style.display = "block";
    } else {
        mainlayoutNoTabs.style.display = "block";
        mainlayout.style.display = "none";
    }
}


        
checkUseTabs();

var rootItemConfig = {
    type: 'component',
    componentName: 'rootPanel',
    header: { show: true, frozen: true },
    reorderEnabled: false,
    title: "מסך חדש",
    componentState: { text: '<div id="rootPanel_1" style="height: 100%; width: 100%; overflow: auto;"></div>', layout: null }
};

var itemConfig = {
content: [{
    type: 'row',
    isClosable: false,
    content: [
    //   {
    //     type:'component',
    //     componentName: 'example',
    //     componentState: { text: 'component1' },
    //     // isClosable: false,
    //     // reorderEnabled: false,
    //     //   header: { show: false, frozen: true },
    //     //   id: "foo"
    //   },
    //   {
    //     type:'component',
    //     componentName: 'example',
    //     componentState: { text: 'component2' }
    //   },
    //   {
    //     type:'component',
    //     componentName: 'example',
    //     componentState: { text: 'component3' }
    //   }
    ]
}]
};
var myLayouts = {}, rootLayout;
// var activeScreen = 0;
// function setActiveScreen (num) {
//     activeScreen = num;
// }

function addRootScreen () {
    var newItemConfig = JSON.parse(JSON.stringify(itemConfig));
    var myLayout = new GoldenLayout( newItemConfig );
    var newRootItemConfig = JSON.parse(JSON.stringify(rootItemConfig));
    newRootItemConfig.componentState.layout = myLayout; // todo: new layout
    
    var screenNum = -1;
    
    // check the highest existing screen num and this will be + 1 of it
    for (let i = 0; i < rootLayout.root.contentItems[ 0 ].contentItems.length; i++) {
        if (screenNum < rootLayout.root.contentItems[ 0 ].contentItems[i].config.componentState.screenNum) {
            screenNum = rootLayout.root.contentItems[ 0 ].contentItems[i].config.componentState.screenNum;
        }
    }
    screenNum++;

    myLayouts[screenNum] = myLayout;
    myLayout.screenNum = screenNum;

    newRootItemConfig.componentState.text = newRootItemConfig.componentState.text.replace("_1", "_" + screenNum);
    newRootItemConfig.componentState.screenNum = screenNum;
    rootLayout.root.contentItems[ 0 ].addChild(newRootItemConfig);
    myLayout.container = "#rootPanel_" + screenNum;
    // activeScreen = screenNum;
    
    myLayout.registerComponent( 'modules', function( container, state ){
        container.getElement().html( state.text);
        container.on('resize',function() {
            if (openedModules[screenNum][state.moduleName]) {
                for (let i = 0; i < openedModules[screenNum][state.moduleName].length; i++) {
                    if (openedModules[screenNum][state.moduleName][i].instanceNum == state.instanceNum) {
                        openedModules[screenNum][state.moduleName][i].resized();
                        break;
                    }
                }
            }
        });
    });

    myLayout.on( 'tabCreated', function( tab ){
        var closingPanel = function(){
                var canClosePanel = false;
                for (let i = 0; i < openedModules[tab.contentItem.config.componentState.screenNum][tab.contentItem.config.componentState.moduleName].length; i++) {
                    if (openedModules[tab.contentItem.config.componentState.screenNum][tab.contentItem.config.componentState.moduleName][i].instanceNum == tab.contentItem.config.componentState.instanceNum) {
                        canClosePanel = openedModules[tab.contentItem.config.componentState.screenNum][tab.contentItem.config.componentState.moduleName][i].closing();
                        break;
                    }
                }
                if (canClosePanel) {
                    // remove from openedModules
                    var instances = openedModules[screenNum][tab.contentItem.config.componentState.moduleName];
                    for (var j = 0; j < instances.length; j++) {
                        if (instances[j].instanceNum == tab.contentItem.config.componentState.instanceNum) {
                            let moduleDiv = document.querySelector("#module" + instances[j].buildPostfix() + "div");
                            if (moduleDiv) moduleDiv.parentElement.remove(moduleDiv);
                            instances.splice(j,1);
                            break;
                        }
                    }
                    tab.contentItem.remove();
                }
            }
        tab.closeElement
            .off( 'click' ) //unbind the current click handler
            .click(closingPanel);
        tab.header.closeButton.element.off('click').click(closingPanel);
        
        $($(tab.header.controlsContainer[0]).children()[1]).css("visibility", "hidden");
        $($(tab.header.controlsContainer[0]).children()[2]).css("visibility", "hidden");
        $($(tab.header.controlsContainer[0]).children()[3]).css("visibility", "hidden");

    });

    myLayout.init();

    setTimeout(() => {
        try {
            myLayout.updateSize();
        } catch (e) {
            console.error(e);
        }
    }, 20);

}

$(function () {
    
// var pstyle = 'border: 0px solid #555; padding: 0px;';
// pstyle = "";
// $('#mainlayout').w2layout({
//     name: 'mainlayout',
//     panels: [
//         { type: 'top', size: 50, style: pstyle, content: 'top', resizable: true },
//         { type: 'left', size: 200, style: pstyle, content: 'left', resizable: true },
//         { type: 'main', style: pstyle, content: '', resizable: true }
//     ],
//     onResizing: function (event) {
//         setTimeout(() => {
//             myLayout.updateSize();
//         }, 100);
    
//     }
// });
// w2ui['mainlayout'].el('main').id = "mainDiv";
// w2ui['mainlayout'].el('left').id = "leftDiv";
// w2ui['mainlayout'].el('left').className = "leftDiv";
// w2ui['mainlayout'].el('top').id = "topDiv";

function reportWindowSize() {
$("#mainlayout").css("height", window.innerHeight + "px");
$("#mainlayout").css("width", (window.innerWidth - (menuCollapsed? menuCollapsedWidth : menuExpandedWidth)) + "px");
$("#mainlayoutNoTabs").css("height", window.innerHeight + "px");
$("#mainlayoutNoTabs").css("width", (window.innerWidth - (menuCollapsed? menuCollapsedWidth : menuExpandedWidth)) + "px");

// for (p in openedModules) {
//     var instances = openedModules[p];
//     for (var i = 0; i < instances.length; i++) {
//         loadedModules[p].resized(activeScreen, instances[i]);
//     }
// }
// heightOutput.textContent = window.innerHeight;
// widthOutput.textContent = window.innerWidth;
}
window.onresize = reportWindowSize;
$("#mainlayout").css("height", window.innerHeight + "px");
$("#mainlayout").css("width", (window.innerWidth - (menuCollapsed? menuCollapsedWidth : menuExpandedWidth)) + "px");
$("#mainlayoutNoTabs").css("height", window.innerHeight + "px");
$("#mainlayoutNoTabs").css("width", (window.innerWidth - (menuCollapsed? menuCollapsedWidth : menuExpandedWidth)) + "px");

$(window).resize(function () {
for (const key in myLayouts) {
    // if (Object.hasOwnProperty.call(myLayouts, key)) {
        // const layout = myLayouts[key];
        myLayouts[key].updateSize($(window).width() - (menuCollapsed? menuCollapsedWidth : menuExpandedWidth), $(window).height() - 20);
        rootLayout.updateSize($(window).width() - (menuCollapsed? menuCollapsedWidth : menuExpandedWidth), $(window).height() - 0);
    // }
}

});

// // w2ui.layout.on('resize', function(event) {myLayout.updateSize();});


var rootConfig = {
content: [{
type: 'stack',
content: [
//   {
//     type:'component',
//     componentName: 'rootPanel',
//     componentState: { text: 'component1' },
//     isClosable: false,
//     reorderEnabled: true,
//     //   header: { show: false, frozen: true },
//     //   id: "foo"
//   },
//   {
//     type:'component',
//     componentName: 'rootPanel',
//     componentState: { text: 'component2' },
//     isClosable: false,
//     reorderEnabled: true,
//   }
]
}]
};


rootLayout = new GoldenLayout( rootConfig );
rootLayout.container = "#mainlayout";

rootLayout.registerComponent( 'rootPanel', function( container, state ){
container.getElement().html( state.text);
});


rootLayout.on( 'tabCreated', function( tab ){
var closingPanel = function(){
    if (rootLayout.root.contentItems[ 0 ].contentItems.length > 1) {
        let screenNum = tab.contentItem.config.componentState.screenNum;
        let moduleInstancesToRemove = [];
        for (const module in openedModules[screenNum]) {
            let moduleInstancesOnScreen = openedModules[screenNum][module];

            for (let i = 0; i < moduleInstancesOnScreen.length; i++) {
                var canClosePanel = false;
                for (let j = 0; j < openedModules[screenNum][module].length; j++) {
                    if (openedModules[screenNum][module][j].instanceNum == moduleInstancesOnScreen[i].instanceNum) {
                        canClosePanel = openedModules[screenNum][module][j].closing();
                        break;
                    }
                }
                if (!canClosePanel) {
                    return;
                } else {
                    moduleInstancesToRemove.push({module: module, instanceNum: moduleInstancesOnScreen[i].instanceNum});
                }
            }
            
        }
        removeOpenedModules(screenNum, moduleInstancesToRemove);
        tab.contentItem.remove();
    } else {
        alert("לא ניתן לסגור מסך יחיד");
    }
}

// tab.element.off('click').click(function () {setActiveScreen(tab.contentItem.config.componentState.screenNum)});
tab.closeElement
.off( 'click' ) //unbind the current click handler
.click(closingPanel);
$($(tab.header.controlsContainer[0]).children()[1]).css("visibility", "hidden");
$($(tab.header.controlsContainer[0]).children()[2]).css("visibility", "hidden");
$($(tab.header.controlsContainer[0]).children()[3]).css("visibility", "hidden");


});


rootLayout.init();



addRootScreen();

const plusScreenDiv = document.createElement("div");
const plusScreenButton = document.createElement("button");
plusScreenButton.innerHTML = " + ";
plusScreenButton.onclick = addRootScreen;
plusScreenButton.style = "font-size: 10px; margin-top: 2.5px; background-color: #f9df95; border: 1px solid #977412; margin-left: 1px; padding: 1px 5px;";
plusScreenDiv.appendChild(plusScreenButton);
document.querySelector('.lm_header').appendChild(plusScreenDiv);
document.querySelector('.lm_tabs').style.display = "contents";

});
