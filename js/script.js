// /**
//  * sets the active color theme
//  * @param {string} color - the color theme name (matches the CSS file title attribute)
//  */
// function setActiveStyle(color) {
//     const alternateStyles = document.querySelectorAll(".alternate-style");
//     if (!alternateStyles.length) return; // Guard clause if no styles exist
    
//     alternateStyles.forEach((style) => {
//         if (color === style.getAttribute("title")) {
//             style.removeAttribute("disabled");
//         } else {
//             style.setAttribute("disabled", "true");
//         }
//     });
    
//     // Update star colors if they exist
//     document.querySelectorAll(".star").forEach((star) => {
//         if (star) {
//             star.style.color = color;
//         }
//     });
    
//     // save preference
//     localStorage.setItem('selectedColor', color);
// }

// document.addEventListener('DOMContentLoaded', function () {
//     // modal functions
//     function openModal(modalId) {
//         document.getElementById(modalId).style.display = 'block';
//     }
    
//     function closeModal(modalId) {
//         document.getElementById(modalId).style.display = 'none';
//     }
    
//     // project link click handlers
//     document.querySelectorAll('.project-link').forEach(function(button) {
//         button.addEventListener('click', function() {
//             var modalId = this.getAttribute('onclick').split("'")[1];
//             openModal(modalId);
//         });
//     });
    
//     // close button handlers
//     document.querySelectorAll('.close').forEach(function(button) {
//         button.addEventListener('click', function() {
//             closeModal(this.closest('.modal').id);
//         });
//     });
    
//     // close when clicking outside modal
//     window.addEventListener('click', function(event) {
//         document.querySelectorAll('.modal').forEach(function(modal) {
//             if (event.target === modal) {
//                 closeModal(modal.id);
//             }
//         });
//     });

//     // theme switching
//     const styleSwitcherToggle = document.querySelector(".style-switcher-toggler");
//     const styleSwitcher = document.querySelector(".style-switcher");
    
//     // Check if style switcher elements exist before adding event listeners
//     if (styleSwitcherToggle && styleSwitcher) {
//         // toggle style switcher
//         styleSwitcherToggle.addEventListener("click", () => {
//             styleSwitcher.classList.toggle("open");
//         });
        
//         // hide style switcher on scroll
//         window.addEventListener("scroll", () => {
//             if (styleSwitcher.classList.contains("open")) {
//                 styleSwitcher.classList.remove("open");
//             }
//         });
//     }
    
//     // load saved preference or set default to color-5
//     const savedColor = localStorage.getItem('selectedColor');
//     if (savedColor) {
//         setActiveStyle(savedColor);
//     } else {
//         // set default to color-5 if no saved preference
//         setActiveStyle('color-3');
//     }
    
    
//     // init theme (if dark class should be added)
//     document.body.classList.add("dark");
// });

/**
 * sets the active color theme
 * @param {string} color - the color theme name (matches the CSS file title attribute)
 */
function setActiveStyle(color) {
    
    const isLightMode = localStorage.getItem("selectedTheme") === "light"; // true if light mode

    // If light mode, override color 3/6 to 7/8
    if (isLightMode) {
        if (color === "color-3") color = "color-7";
        if (color === "color-6") color = "color-8";
    }
    const alternateStyles = document.querySelectorAll(".alternate-style");
    if (!alternateStyles.length) return; // Guard clause if no styles exist
    
    alternateStyles.forEach((style) => {
        if (color === style.getAttribute("title")) {
            style.removeAttribute("disabled");
        } else {
            style.setAttribute("disabled", "true");
        }
    });
    
    // Update star colors if they exist
    document.querySelectorAll(".star").forEach((star) => {
        star.style.color = color;
    });
    
    // save preference
    localStorage.setItem('selectedColor', color);
}



document.addEventListener('DOMContentLoaded', function () {
    // modal functions
    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }
    
    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
    
    // project link click handlers
    document.querySelectorAll('.project-link').forEach(function(button) {
        button.addEventListener('click', function() {
            var modalId = this.getAttribute('onclick').split("'")[1];
            openModal(modalId);
        });
    });
    
    // close button handlers
    document.querySelectorAll('.close').forEach(function(button) {
        button.addEventListener('click', function() {
            closeModal(this.closest('.modal').id);
        });
    });
    
    // close when clicking outside modal
    window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(function(modal) {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // theme switching (style switcher dropdown)
    const styleSwitcherToggle = document.querySelector(".style-switcher-toggler");
    const styleSwitcher = document.querySelector(".style-switcher");
    
    if (styleSwitcherToggle && styleSwitcher) {
        styleSwitcherToggle.addEventListener("click", () => {
            styleSwitcher.classList.toggle("open");
        });
        
        window.addEventListener("scroll", () => {
            if (styleSwitcher.classList.contains("open")) {
                styleSwitcher.classList.remove("open");
            }
        });
    }
    
    // load saved color preference or set default
    const savedColor = localStorage.getItem('selectedColor');
    if (savedColor) {
        setActiveStyle(savedColor);
    } else {
        setActiveStyle('color-3'); // default
    }
  
}); 

function setTheme(theme) {
    const themes = document.querySelectorAll(".alternate-theme");
    themes.forEach(link => {
        if (link.getAttribute("title") === theme) {
            link.removeAttribute("disabled");
        } else {
            link.setAttribute("disabled", "true");
        }
    });

    // Highlight active button
    const lightBtn = document.getElementById("light-mode-toggle");
    const darkBtn = document.getElementById("dark-mode-toggle");
    if (theme === "light") {
        lightBtn.classList.add("active");
        darkBtn.classList.remove("active");
    } else {
        darkBtn.classList.add("active");
        lightBtn.classList.remove("active");
    }

    localStorage.setItem("selectedTheme", theme);
}

document.addEventListener("DOMContentLoaded", function() {
    // Observe the navbar container for changes
    const navbarContainer = document.getElementById("navbar-container");
    if (!navbarContainer) return;

    const observer = new MutationObserver(() => {
        const lightBtn = document.getElementById("light-mode-toggle");
        const darkBtn = document.getElementById("dark-mode-toggle");


        if (lightBtn && darkBtn) {

            const savedTheme = localStorage.getItem("selectedTheme");
            if (savedTheme === "light") {
                lightBtn.click();
            } else {
                darkBtn.click();
            }

            lightBtn.addEventListener("click", () => {
                // Change body
                document.body.style.backgroundColor = "#F5F5F5";
                document.body.style.color = "#000000";

                const homeSection = document.getElementById("home");
                const header = document.querySelector("header");
                const nav = document.getElementById("navbar");
                const navUl = nav ? nav.querySelector("ul") : null;
                const navbarContainer = document.getElementById("navbar-container");
                const footer = document.querySelector("footer");
                const navLinks = document.querySelectorAll("#navbar a");

                homeSection.style.backgroundColor = "#F5F5F5";
                homeSection.style.color = "#000000";
                header.style.backgroundColor = "#DCDCDC"; // slightly darker white
                header.style.color = "#000000"; // dark text
                nav.style.backgroundColor = "#DCDCDC"; // match header
                navUl.style.backgroundColor = "#DCDCDC"; // match header
                navbarContainer.style.backgroundColor = "#DCDCDC";
                footer.style.backgroundColor = "#DCDCDC";
                footer.style.color = "#000000";
                navLinks.forEach(link => {
                    link.style.color = "#000000"; // for light mode
                });

                document.querySelector(".color-3").style.color = "#800080"; // purple
                document.querySelector(".color-6").style.color = "#008080"; // teal
                document.documentElement.style.setProperty("--skin-color-3", "#800080"); // purple
                document.documentElement.style.setProperty("--skin-color-6", "#008080"); // teal
                localStorage.setItem("selectedTheme", "light");
                // let currentColor = localStorage.getItem("selectedColor");
                // setActiveStyle(currentColor);

            });

            darkBtn.addEventListener("click", () => {
                // Change body
                document.body.style.backgroundColor = "#1E1E1E";
                document.body.style.color = "#ffffff";

                // Change #home section
                const homeSection = document.getElementById("home");
                const header = document.querySelector("header");
                const nav = document.getElementById("navbar");
                const navUl = nav ? nav.querySelector("ul") : null;
                const navbarContainer = document.getElementById("navbar-container");
                const footer = document.querySelector("footer");
                
                homeSection.style.backgroundColor = "#1E1E1E";
                homeSection.style.color = "#ffffff";
                header.style.backgroundColor = "#2C2C2C"; // slightly darker white
                header.style.color = "#ffffff"; // dark text
                nav.style.backgroundColor = "#2C2C2C"; // match header
                navUl.style.backgroundColor = "#2C2C2C"; // match header
                navbarContainer.style.backgroundColor = "#2C2C2C";
                footer.style.backgroundColor = "#2C2C2C";
                footer.style.color = "#ffffff";
                const navLinks = document.querySelectorAll("#navbar a");
                navLinks.forEach(link => {
                    link.style.color = "#ffffff"; // for light mode
                });

                document.querySelector(".color-3").style.color = "#FFC107"; // yellow
                document.querySelector(".color-6").style.color = "#00ff33"; // green
                document.documentElement.style.setProperty("--skin-color-3", "#FFC107"); // yellow
                document.documentElement.style.setProperty("--skin-color-6", "#00ff33"); // green
                localStorage.setItem("selectedTheme", "dark");

                // let currentColor = localStorage.getItem("selectedColor");
                // setActiveStyle(currentColor);
            });

    // Stop observing once buttons are found
    observer.disconnect();
}

    });

    observer.observe(navbarContainer, { childList: true, subtree: true });
});



// document.addEventListener("DOMContentLoaded", function() {
//     const savedTheme = localStorage.getItem("selectedTheme");
    
//     if (savedTheme === "light") {
//         // simulate light mode button click
//         document.getElementById("light-mode-toggle").click();
//     } else {
//         // default to dark
//         document.getElementById("dark-mode-toggle").click();
//     }
// });