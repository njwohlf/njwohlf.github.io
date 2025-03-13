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

  // theme switching
  const styleSwitcherToggle = document.querySelector(".style-switcher-toggler");
  const styleSwitcher = document.querySelector(".style-switcher");
  
  // toggle style switcher
  styleSwitcherToggle.addEventListener("click", () => {
      styleSwitcher.classList.toggle("open");
  });
  
  // hide style switcher on scroll
  window.addEventListener("scroll", () => {
      styleSwitcher.classList.remove("open");
  });
  
  // theme colors 
  const alternateStyles = document.querySelectorAll(".alternate-style");
  
  function setActiveStyle(color) {
      alternateStyles.forEach((style) => {
          style.setAttribute("disabled", color !== style.getAttribute("title"));
      });
      updateStarColor(color);
  }
  
  function updateStarColor(color) {
      document.querySelectorAll(".star").forEach((star) => {
          star.style.color = color;
      });
  }
  
  // init theme
  document.body.classList.add("dark");
  setActiveStyle('color-5');
});


// toggle style switcher
const styleSwitcherToggle = document.querySelector(".style-switcher-toggler");
styleSwitcherToggle.addEventListener("click", () => {
    document.querySelector(".style-switcher").classList.toggle("open");
});

// hide style switcher on scroll
window.addEventListener("scroll", () => {
    if(document.querySelector(".style-switcher").classList.contains("open")) {
        document.querySelector(".style-switcher").classList.remove("open");
    }
});

/**
 * sets the active color theme
 * @param {string} color - the color theme name (matches the CSS file title attribute)
 */
function setActiveStyle(color) {
    const alternateStyles = document.querySelectorAll(".alternate-style");
    alternateStyles.forEach((style) => {
        if(color === style.getAttribute("title")) {
            style.removeAttribute("disabled");
        }
        else {
            style.setAttribute("disabled", "true");
        }
    });
    
    // save preference
    localStorage.setItem('selectedColor', color);
}

// load saved preference on load
window.addEventListener("load", () => {
    const savedColor = localStorage.getItem('selectedColor');
    if (savedColor) {
        setActiveStyle(savedColor);
    } else {
        // default
        const defaultStyle = document.querySelector(".alternate-style");
        if (defaultStyle) {
            setActiveStyle(defaultStyle.getAttribute("title"));
        }
    }

});