fetch("demodata/getMenu.js", {
    method: 'GET', headers: {
      'Content-Type': 'application/json'}})
      .then(res => res.json())
      .then(
        (result) => {
          var menuitems = result.menuitems;
          if (menuitems) {

              menuitems.push({title: "Disconnect", action: "link", val: "/logout"});

              var res = prepareMenu(menuitems);
              document.querySelector("#menuDivDynamic").innerHTML = res;
              drawMenu();

              // open module XXXXX on startup - for development ease
              // TransfersService Demo1Service TestEmptyService ServerAdminService
              
              let userSetup = JSON.parse(localStorage.getItem("userSetup"));
              if (userSetup && userSetup.general.reopenLastScreens != false && userSetup.general.reopenLastScreens != undefined && userSetup.general.reopenLastScreens.length > 0) {
                  // TODO: this supports only useTabs=false mode atm
                  setTimeout("showModule('" + userSetup.general.reopenLastScreens[0][0] + "', '" + userSetup.general.reopenLastScreens[0][1] + "', {})", 1000);
              }
          }
        },
        (error) => {
          console.log("error: " + error);
        }
      ); // -fetch

  function prepareMenu (menuitems) {
      var res = "";
      for (var i = 0; i < menuitems.length; i++) {
          if (menuitems[i].submenu) {
              res += "<button class='dropdown-btn' onclick='return false;'>" + menuitems[i].title + 
                  "<i class='fa fa-caret-down'></i></button><div class='dropdown-container'>" + prepareMenu(menuitems[i].submenu) + "</div>";
          } else {
              var action = "";
              if (menuitems[i].action == "link") {
                  action = "href='" + menuitems[i].val + "'";
              } else if (menuitems[i].action == "module") {
                  action = "href='#' onclick='showModule(\"" + menuitems[i].val + "\", \"" + menuitems[i].title.replaceAll("\"", "\\\"") + "\", event); return false;'";
              }
              res += "<a " + action + ">" + menuitems[i].title + "</a>";
          }
      }
      return res;
  }

  var menuExpandedWidth = 160;
  var menuCollapsedWidth = 60;
  document.querySelector("#menuDiv").style.width = menuExpandedWidth + "px";
  document.querySelector("#mainlayout").style.right = menuExpandedWidth + "px";
  var menuCollapsed = false;
  function toggleMenu () {
      if (!menuCollapsed) {
          menuCollapsed = true;
          document.querySelector("#menuDiv").style.width = menuCollapsedWidth + "px";
          document.querySelector("#mainlayout").style.right = menuCollapsedWidth + "px";
          document.querySelector("#toggleMenuArrow").src = "images/left.png";
          document.querySelector("#toggleMenuArrow").style.width = "30px";
          document.querySelector("#toggleMenuArrow").parentNode.style.right = "16px";
          document.querySelector("#menuDivDynamic").style.display = "none";
          document.querySelector("#toggleMenuBackIcon").style.display = "block";
          document.querySelector("#menu-logo").style.display = "none";
      } else {
          menuCollapsed = false;
          document.querySelector("#menuDiv").style.width = menuExpandedWidth + "px";
          document.querySelector("#mainlayout").style.right = menuExpandedWidth + "px";
          document.querySelector("#toggleMenuArrow").src = "images/right.png";
          document.querySelector("#toggleMenuArrow").style.width = "40px";
          document.querySelector("#toggleMenuArrow").parentNode.style.right = "45%";
          document.querySelector("#menuDivDynamic").style.display = "block";
          document.querySelector("#toggleMenuBackIcon").style.display = "none";
          document.querySelector("#menu-logo").style.display = "block";
      }
      window.dispatchEvent(new Event('resize'));
  }