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
    else {
        if (color === "color-7") color = "color-3";
        if (color === "color-8") color = "color-6";
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

// Helper function to apply theme
function applyTheme(theme) {
    localStorage.setItem("selectedTheme", theme);
    const fullPath = window.location.pathname;
    const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);

    // if (fileName === "index.html" || fileName === "") {
        // const homeSection = document.getElementById("home");
        const header = document.querySelector("header");
        const nav = document.getElementById("navbar");
        const navUl = nav ? nav.querySelector("ul") : null;
        const navbarContainer = document.getElementById("navbar-container");
        const footer = document.querySelector("footer");
        const navLinks = document.querySelectorAll("#navbar a");

        let primaryColor = null;
        let secondaryColor = null;
        let textColor = null;
        if (theme === "light") {
            primaryColor = "#F5F5F5";
            secondaryColor = "#DCDCDC";
            textColor = "#000000";

            document.querySelector(".color-3").style.color = "#c902c9ff"; // purple
            document.querySelector(".color-6").style.color = "#008080"; // teal
            document.documentElement.style.setProperty("--skin-color-3", "#c902c9ff");
            document.documentElement.style.setProperty("--skin-color-6", "#008080");
            localStorage.setItem("selectedTheme", theme);
            setActiveStyle(localStorage.getItem('selectedColor'))

        } else {
            primaryColor = "#1E1E1E";
            secondaryColor = "#2C2C2C";
            textColor = "#ffffff";
            
            document.querySelector(".color-3").style.color = "#FFC107"; // yellow
            document.querySelector(".color-6").style.color = "#00ff33"; // green
            document.documentElement.style.setProperty("--skin-color-3", "#FFC107");
            document.documentElement.style.setProperty("--skin-color-6", "#00ff33");
            localStorage.setItem("selectedTheme", theme);
            setActiveStyle(localStorage.getItem('selectedColor'))
        }
        if (fileName === "index.html" || fileName === "") {
            const homeSection = document.getElementById("home");
            document.body.style.backgroundColor = primaryColor;
            document.body.style.color = textColor;
            homeSection.style.backgroundColor = primaryColor;
            homeSection.style.color = textColor;
        }
        // document.body.style.backgroundColor = primaryColor;
        // document.body.style.color = textColor;
        // homeSection.style.backgroundColor = primaryColor;
        // homeSection.style.color = textColor;
        header.style.backgroundColor = secondaryColor;
        header.style.color = textColor;
        nav.style.backgroundColor = secondaryColor;
        navUl.style.backgroundColor = secondaryColor;
        navbarContainer.style.backgroundColor = secondaryColor;
        footer.style.backgroundColor = secondaryColor;
        footer.style.color = textColor;
        navLinks.forEach(link => link.style.color = textColor);
    // }
        if (fileName === "about.html") {
                    // About section
            const aboutDiv = document.querySelector("#about div");
            const hobbiesDivs = document.querySelectorAll(".hobbies div");
            const funFactsDivs = document.querySelectorAll(".fun-facts div");
            // const educationDivs = document.querySelectorAll("#education div");

            if (theme === "light") {
                document.documentElement.style.setProperty("--background-primary", "#F5F5F5");
                document.documentElement.style.setProperty("--background-secondary", "#DCDCDC");
                document.documentElement.style.setProperty("--text-color", "#000000");
                document.documentElement.style.setProperty("--highlight-color-3", "#c902c9ff");
                document.documentElement.style.setProperty("--highlight-color-6", "#008080");
                
                document.querySelector(".color-3").style.color = "#c902c9ff"; // purple
                document.querySelector(".color-6").style.color = "#008080"; // teal
                document.documentElement.style.setProperty("--skin-color-3", "#c902c9ff");
                document.documentElement.style.setProperty("--skin-color-6", "#008080");
            } else {
                document.documentElement.style.setProperty("--background-primary", "#1E1E1E");
                document.documentElement.style.setProperty("--background-secondary", "#2C2C2C");
                document.documentElement.style.setProperty("--text-color", "#ffffff");
                document.documentElement.style.setProperty("--highlight-color-3", "#FFC107");
                document.documentElement.style.setProperty("--highlight-color-6", "#00ff33");

                document.querySelector(".color-3").style.color = "#FFC107"; // yellow
                document.querySelector(".color-6").style.color = "#00ff33"; // green
                document.documentElement.style.setProperty("--skin-color-3", "#FFC107");
                document.documentElement.style.setProperty("--skin-color-6", "#00ff33");
            }
            localStorage.setItem("selectedTheme", theme);
            setActiveStyle(localStorage.getItem('selectedColor'))
            // Apply the colors to each section dynamically
            if (aboutDiv) aboutDiv.style.backgroundColor = "var(--background-secondary)";
                hobbiesDivs.forEach(div => div.style.backgroundColor = "var(--background-secondary)");
                funFactsDivs.forEach(div => div.style.backgroundColor = "var(--background-secondary)");
            
            const headers = document.querySelectorAll("h2");

            if (theme === "light") {
                headers.forEach(h => {
                    h.style.color = "#555"; // light mode color
                });
            } else if (theme === "dark") {
                headers.forEach(h => {
                    h.style.color = "#aaa"; // dark mode color
                });
            }
        }
        

}

// --- Phase 1: initial page load ---
window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("selectedTheme") || "dark";
    applyTheme(savedTheme);
});

document.getElementById("navbar-container")?.addEventListener("click", (e) => {
    if (e.target.id === "light-mode-toggle") applyTheme("light");
    if (e.target.id === "dark-mode-toggle") applyTheme("dark");
});
