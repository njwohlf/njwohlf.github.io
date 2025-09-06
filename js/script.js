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
    const homeSection = document.getElementById("home");
    const header = document.querySelector("header");
    const nav = document.getElementById("navbar");
    const navUl = nav ? nav.querySelector("ul") : null;
    const navbarContainer = document.getElementById("navbar-container");
    const footer = document.querySelector("footer");
    const navLinks = document.querySelectorAll("#navbar a");

    if (theme === "light") {
        document.body.style.backgroundColor = "#F5F5F5";
        document.body.style.color = "#000000";

        if (homeSection) {
            homeSection.style.backgroundColor = "#F5F5F5";
            homeSection.style.color = "#000000";
        }
        if (header) header.style.backgroundColor = "#DCDCDC";
        if (header) header.style.color = "#000000";
        if (nav) nav.style.backgroundColor = "#DCDCDC";
        if (navUl) navUl.style.backgroundColor = "#DCDCDC";
        if (navbarContainer) navbarContainer.style.backgroundColor = "#DCDCDC";
        if (footer) {
            footer.style.backgroundColor = "#DCDCDC";
            footer.style.color = "#000000";
        }
        navLinks.forEach(link => link.style.color = "#000000");

        document.querySelector(".color-3").style.color = "#c902c9ff"; // purple
        document.querySelector(".color-6").style.color = "#008080"; // teal
        document.documentElement.style.setProperty("--skin-color-3", "#c902c9ff");
        document.documentElement.style.setProperty("--skin-color-6", "#008080");
        localStorage.setItem("selectedTheme", theme);
        setActiveStyle(localStorage.getItem('selectedColor'))


    } else { // dark
        document.body.style.backgroundColor = "#1E1E1E";
        document.body.style.color = "#ffffff";

        if (homeSection) {
            homeSection.style.backgroundColor = "#1E1E1E";
            homeSection.style.color = "#ffffff";
        }
        if (header) header.style.backgroundColor = "#2C2C2C";
        if (header) header.style.color = "#ffffff";
        if (nav) nav.style.backgroundColor = "#2C2C2C";
        if (navUl) navUl.style.backgroundColor = "#2C2C2C";
        if (navbarContainer) navbarContainer.style.backgroundColor = "#2C2C2C";
        if (footer) {
            footer.style.backgroundColor = "#2C2C2C";
            footer.style.color = "#ffffff";
        }
        navLinks.forEach(link => link.style.color = "#ffffff");

        document.querySelector(".color-3").style.color = "#FFC107"; // yellow
        document.querySelector(".color-6").style.color = "#00ff33"; // green
        document.documentElement.style.setProperty("--skin-color-3", "#FFC107");
        document.documentElement.style.setProperty("--skin-color-6", "#00ff33");
        localStorage.setItem("selectedTheme", theme);
        setActiveStyle(localStorage.getItem('selectedColor'))
        
    }
    
    // Save last selected theme
    // localStorage.setItem("selectedTheme", theme);
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
