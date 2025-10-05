(function () {
  "use strict";

  // Configuration with defaults
  const config = {
    cookieName: "inhumanegov",
    expirationDays: 365,
    position: "bottom",
    theme: "light",
    message:
      "🇮🇱 Israel is committing genocide in 🇵🇸 Palestine<br />🇷🇺 Russia is invading 🇺🇦 Ukraine,<br />🇺🇸 US is violating constitutional rights,<br />These governments are inhumane",
    acceptText: "I Acknowledge",
    learnMoreText: "Learn More",
    learnMoreUrl:
      "https://www.ohchr.org/en/press-releases/2025/09/israel-has-committed-genocide-gaza-strip-un-commission-finds",
    zIndex: 10000,
  };

  // Merge with script tag data attributes
  function loadConfig() {
    const script =
      document.currentScript ||
      document.querySelector('script[src*="acknowledge-banner.js"]');
    if (script) {
      Object.keys(config).forEach((key) => {
        const dataKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        if (script.dataset[dataKey]) {
          if (key === "expirationDays" || key === "zIndex") {
            config[key] = parseInt(script.dataset[dataKey]);
          } else {
            config[key] = script.dataset[dataKey];
          }
        }
      });
    }
  }

  // Check if consent already given
  function hasConsent() {
    const cookie = getCookie(config.cookieName);
    return cookie === "true";
  }

  // Get cookie value
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  // Set consent cookie
  function setConsent() {
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + config.expirationDays);

    document.cookie = `${config.cookieName}=true; expires=${expiration.toUTCString()}; path=/; SameSite=Lax`;

    // Dispatch event for other scripts
    window.dispatchEvent(new CustomEvent("consentGranted"));
  }

  // Create and inject styles
  function injectStyles() {
    const css = `
            .consent-banner {
                position: fixed;
                left: 0;
                right: 0;
                background: ${config.theme === "dark" ? "#333" : "#fff"};
                border-top: 1px solid ${config.theme === "dark" ? "#555" : "#e0e0e0"};
                padding: 20px;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
                z-index: ${config.zIndex};
                transition: all 0.3s ease;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .consent-banner-bottom {
                bottom: 0;
            }

            .consent-banner-top {
                top: 0;
                border-top: none;
                border-bottom: 1px solid ${config.theme === "dark" ? "#555" : "#e0e0e0"};
            }

            .consent-banner.hidden {
                opacity: 0;
                transform: translateY(100%);
                pointer-events: none;
            }

            .consent-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 20px;
            }

            .consent-message {
                margin: 0;
                flex: 1;
                color: ${config.theme === "dark" ? "#fff" : "#333"};
                font-size: 14px;
                line-height: 1.4;
            }

            .consent-buttons {
                display: flex;
                gap: 10px;
                flex-shrink: 0;
            }

            .consent-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s ease;
            }

            .consent-btn-primary {
                background: #007cba;
                color: white;
            }

            .consent-btn-primary:hover {
                background: #005a87;
            }

            .consent-btn-secondary {
                background: transparent;
                color: #007cba;
                border: 1px solid #007cba;
            }

            .consent-btn-secondary:hover {
                background: #f0f8ff;
            }

            .consent-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: ${config.zIndex + 1};
                padding: 20px;
            }

            .consent-modal-content {
                background: white;
                padding: 30px;
                border-radius: 8px;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }

            .consent-modal-close {
                background: #007cba;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 20px;
            }

            @media (max-width: 768px) {
                .consent-content {
                    flex-direction: column;
                    text-align: center;
                    gap: 15px;
                }

                .consent-buttons {
                    width: 100%;
                    justify-content: center;
                }

                .consent-banner {
                    padding: 15px;
                }
            }

            @media (max-width: 480px) {
                .consent-buttons {
                    flex-direction: column;
                }

                .consent-btn {
                    width: 100%;
                }
            }
        `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Create banner HTML
  function createBanner() {
    const banner = document.createElement("div");
    banner.className = `consent-banner consent-banner-${config.position}`;
    banner.id = "consent-banner";

    banner.innerHTML = `
            <div class="consent-content">
                <p class="consent-message">${config.message}</p>
                <div class="consent-buttons">
                    ${config.learnMoreUrl ? `<button class="consent-btn consent-btn-secondary" id="consent-learn-more">${config.learnMoreText}</button>` : ""}
                    <button class="consent-btn consent-btn-primary" id="consent-accept">${config.acceptText}</button>
                </div>
            </div>
        `;

    return banner;
  }

  // Create modal for learn more
  function createModal() {
    const modal = document.createElement("div");
    modal.className = "consent-modal";
    modal.innerHTML = `
            <div class="consent-modal-content">
                <h3>Privacy & Cookies</h3>
                <p>This website uses cookies to ensure you get the best experience on our website. For more information, please visit our <a href="${config.learnMoreUrl}" target="_blank">Privacy Policy</a>.</p>
                <p>Cookies are small text files that are stored on your device when you visit websites. They help us understand how you use our site and improve your experience.</p>
                <button class="consent-modal-close" id="consent-modal-close">Close</button>
            </div>
        `;

    return modal;
  }

  // Show the banner
  function showBanner() {
    const banner = createBanner();
    document.body.appendChild(banner);

    // Add event listeners
    document
      .getElementById("consent-accept")
      .addEventListener("click", function () {
        setConsent();
        hideBanner(banner);
      });

    if (config.learnMoreUrl) {
      document
        .getElementById("consent-learn-more")
        .addEventListener("click", function () {
          showModal();
        });
    }

    // Prevent body scroll behind modal if needed
    document.body.style.overflow = "hidden";
  }

  // Hide the banner with animation
  function hideBanner(banner) {
    banner.classList.add("hidden");
    setTimeout(() => {
      if (banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
      document.body.style.overflow = "";
    }, 300);
  }

  // Show modal
  function showModal() {
    const modal = createModal();
    document.body.appendChild(modal);

    document
      .getElementById("consent-modal-close")
      .addEventListener("click", function () {
        document.body.removeChild(modal);
      });

    // Close modal when clicking outside
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  // Initialize everything
  function init() {
    // Load configuration from data attributes
    loadConfig();

    // Don't show if consent already given
    if (hasConsent()) {
      window.dispatchEvent(new CustomEvent("consentGranted"));
      return;
    }

    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        injectStyles();
        showBanner();
      });
    } else {
      injectStyles();
      showBanner();
    }
  }

  // Expose public API
  window.ConsentBanner = {
    init: init,
    hasConsent: hasConsent,
    setConsent: setConsent,
  };

  // Auto-init
  init();
})();
