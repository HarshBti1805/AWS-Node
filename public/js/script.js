// Add smooth scrolling and enhanced interactions
document.addEventListener("DOMContentLoaded", function () {
  // Add loading animation to search button
  const searchForm = document.querySelector(".search-form");
  const searchBtn = document.querySelector(".search-btn");

  if (searchForm) {
    searchForm.addEventListener("submit", function () {
      // Add loading state
      const originalText = searchBtn.innerHTML;
      searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      searchBtn.disabled = true;

      // Re-enable after a short delay (in case of errors)
      setTimeout(() => {
        searchBtn.innerHTML = originalText;
        searchBtn.disabled = false;
      }, 3000);
    });
  }

  // Add hover effects to weather details
  const detailItems = document.querySelectorAll(".detail-item");
  detailItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px) scale(1.02)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Add click to copy functionality for temperature
  const tempValue = document.querySelector(".temp-value");
  if (tempValue) {
    tempValue.style.cursor = "pointer";
    tempValue.title = "Click to copy temperature";

    tempValue.addEventListener("click", function () {
      const textToCopy = this.textContent + "°C";
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Show a temporary tooltip
        const tooltip = document.createElement("div");
        tooltip.textContent = "Copied!";
        tooltip.style.cssText = `
                    position: absolute;
                    background: #333;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    font-size: 12px;
                    pointer-events: none;
                    z-index: 1000;
                    opacity: 0;
                    transition: opacity 0.3s;
                `;

        document.body.appendChild(tooltip);

        const rect = this.getBoundingClientRect();
        tooltip.style.left =
          rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
        tooltip.style.top = rect.top - 30 + "px";

        tooltip.style.opacity = "1";

        setTimeout(() => {
          tooltip.style.opacity = "0";
          setTimeout(() => {
            document.body.removeChild(tooltip);
          }, 300);
        }, 1000);
      });
    });
  }

  // Add smooth scroll to top when clicking on header
  const header = document.querySelector(".header");
  if (header) {
    header.style.cursor = "pointer";
    header.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Add keyboard navigation for search
  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        searchForm.submit();
      }
    });
  }

  // Add weather icon animation
  const weatherIcon = document.querySelector(".weather-icon img");
  if (weatherIcon) {
    weatherIcon.addEventListener("load", function () {
      this.style.animation = "pulse 2s infinite";
    });
  }

  // Add CSS animation for weather icon
  const style = document.createElement("style");
  style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .weather-icon img {
            transition: transform 0.3s ease;
        }
        
        .weather-icon img:hover {
            transform: scale(1.1);
        }
    `;
  document.head.appendChild(style);

  // Add current time display
  function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();

    // Create or update time display
    let timeDisplay = document.querySelector(".time-display");
    if (!timeDisplay) {
      timeDisplay = document.createElement("div");
      timeDisplay.className = "time-display";
      timeDisplay.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.9);
                padding: 10px 15px;
                border-radius: 25px;
                font-size: 14px;
                font-weight: 500;
                color: #333;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                z-index: 1000;
                backdrop-filter: blur(10px);
            `;
      document.body.appendChild(timeDisplay);
    }

    timeDisplay.textContent = timeString;
  }

  // Update time every second
  updateTime();
  setInterval(updateTime, 1000);
});
