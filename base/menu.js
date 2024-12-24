//* Loop through all dropdown buttons to toggle between hiding and showing its dropdown content - This allows the user to have multiple dropdowns without any conflict */
function drawMenu () {
    var dropdown = document.getElementsByClassName("dropdown-btn");
    for (let i = 0; i < dropdown.length; i++) {
        dropdown[i].addEventListener("click", function() {

            // First - hide all visible submenus
            var dropdownContainers = document.getElementsByClassName("dropdown-container");
            for (let j = 0; j < dropdownContainers.length; j++) {
                if (dropdownContainers[j].previousElementSibling != this && dropdownContainers[j].style.display == "block") {
                    dropdownContainers[j].previousElementSibling.classList.toggle("active");
                    dropdownContainers[j].style.display = "none";
                }
            }

            this.classList.toggle("active");
            var dropdownContent = this.nextElementSibling;
            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
            } else {
                dropdownContent.style.display = "block";
            }
        });
    }
}