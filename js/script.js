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
  if (!themes.length) return;

  themes.forEach((link) => {
    if (theme === link.getAttribute("title")) {
      link.removeAttribute("disabled");
    } else {
      link.setAttribute("disabled", "true");
    }
  });

  // Highlight the active button
  const lightBtn = document.getElementById("light-mode-toggle");
  const darkBtn = document.getElementById("dark-mode-toggle");

  if (lightBtn && darkBtn) {
    if (theme === "light") {
      lightBtn.classList.add("active");
      darkBtn.classList.remove("active");
    } else {
      darkBtn.classList.add("active");
      lightBtn.classList.remove("active");
    }
  }

  // Save preference
  localStorage.setItem("selectedTheme", theme);
}

document.addEventListener("DOMContentLoaded", function () {
  const lightBtn = document.getElementById("light-mode-toggle");
  const darkBtn = document.getElementById("dark-mode-toggle");

  if (lightBtn && darkBtn) {
    lightBtn.addEventListener("click", () => setTheme("light"));
    darkBtn.addEventListener("click", () => setTheme("dark"));
  }

  // Load saved theme or default
  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme("dark"); // default
  }
});