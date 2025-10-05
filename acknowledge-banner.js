(function () {
  "use strict";

  // Configuration with defaults
  const config = {
    cookieName: "inhumanegov",
    expirationDays: 365,
    message:
      "🇮🇱 Israel is committing genocide in 🇵🇸 Palestine<br />🇷🇺 Russia is invading 🇺🇦 Ukraine,<br />🇺🇸 US is violating constitutional rights,<br />These governments are inhumane",
    acceptText: "I Acknowledge",
    learnMoreUrl:
      "https://www.ohchr.org/en/press-releases/2025/09/israel-has-committed-genocide-gaza-strip-un-commission-finds",
    zIndex: 10000,
  };

  // Merge with script tag data attributes
  function loadConfig() {
    const script =
      document.currentScript ||
      document.querySelector('script[src*="acknowledge-modal.js"]');
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
      .consent-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: ${config.zIndex};
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .consent-modal-content {
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 8px;
        padding: 30px;
        max-width: 500px;
        width: 100%;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        color: #fff;
        position: relative;
      }

      .consent-message {
        margin: 0 0 25px 0;
        font-size: 16px;
        line-height: 1.6;
        text-align: center;
      }

      .consent-buttons {
        display: flex;
        gap: 12px;
        justify-content: center;
      }

      .consent-btn {
        padding: 12px 24px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        min-width: 120px;
      }

      .consent-btn-primary {
        background: #2563eb;
        color: white;
      }

      .consent-btn-primary:hover {
        background: #1d4ed8;
        transform: translateY(-1px);
      }

      .consent-btn-secondary {
        background: #374151;
        color: #fff;
        border: 1px solid #4b5563;
      }

      .consent-btn-secondary:hover {
        background: #4b5563;
        transform: translateY(-1px);
      }

      .consent-learn-more-link {
        color: #60a5fa;
        text-decoration: none;
        font-weight: 500;
      }

      .consent-learn-more-link:hover {
        text-decoration: underline;
      }

      @media (max-width: 768px) {
        .consent-modal-content {
          padding: 20px;
        }

        .consent-buttons {
          flex-direction: column;
        }

        .consent-btn {
          width: 100%;
        }
      }

      @media (max-width: 480px) {
        .consent-modal-backdrop {
          padding: 10px;
        }

        .consent-message {
          font-size: 14px;
        }
      }
    `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Create modal HTML
  function createModal() {
    const modal = document.createElement("div");
    modal.className = "consent-modal-backdrop";
    modal.id = "consent-modal";

    modal.innerHTML = `
      <div class="consent-modal-content">
        <h2>Before using this website, please read the Acknowledge these inhumane governments:</h2>
        <p class="consent-message">${config.message}</p>
        <div class="consent-buttons">
          ${
            config.learnMoreUrl
              ? `<a href="${config.learnMoreUrl}" target="_blank" class="consent-btn consent-btn-secondary consent-learn-more-link">
              Learn More
            </a>`
              : ""
          }
          <button class="consent-btn consent-btn-primary" id="consent-accept">
            ${config.acceptText}
          </button>
        </div>
      </div>
    `;

    return modal;
  }

  // Show the modal
  function showModal() {
    const modal = createModal();
    document.body.appendChild(modal);

    // Add event listeners
    document
      .getElementById("consent-accept")
      .addEventListener("click", function () {
        setConsent();
        hideModal(modal);
      });

    // Close modal when clicking on backdrop
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        hideModal(modal);
      }
    });

    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }

  // Hide the modal
  function hideModal(modal) {
    modal.style.opacity = "0";
    modal.style.transition = "opacity 0.3s ease";

    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
      document.body.style.overflow = "";
    }, 300);
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
        showModal();
      });
    } else {
      injectStyles();
      showModal();
    }
  }

  // Expose public API
  window.ConsentModal = {
    init: init,
    hasConsent: hasConsent,
    setConsent: setConsent,
  };

  // Auto-init
  init();
})();
