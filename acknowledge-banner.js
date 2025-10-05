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
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: ${config.zIndex};
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        animation: fadeIn 0.4s ease-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .consent-modal-content {
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%);
        border: 1px solid #333;
        border-radius: 12px;
        padding: 0;
        max-width: 520px;
        width: 100%;
        box-shadow:
          0 20px 40px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(255, 255, 255, 0.03);
        color: #fff;
        position: relative;
        overflow: hidden;
        animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      .consent-modal-content::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, #444, transparent);
      }

      .consent-header {
        background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
        padding: 30px 30px 20px 30px;
        border-bottom: 1px solid #333;
        position: relative;
      }

      .consent-header::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #666, transparent);
      }

      .consent-title {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        text-align: center;
        color: #f5f5f5;
        letter-spacing: -0.5px;
        line-height: 1.3;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }

      .consent-body {
        padding: 30px;
        background: rgba(10, 10, 10, 0.5);
      }

      .consent-message {
        margin: 0 0 30px 0;
        font-size: 16px;
        line-height: 1.7;
        text-align: center;
        color: #d4d4d4;
        font-weight: 400;
      }

      .consent-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        align-items: center;
      }

      .consent-btn {
        padding: 14px 28px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 15px;
        font-weight: 500;
        transition: all 0.2s ease;
        min-width: 140px;
        position: relative;
      }

      .consent-btn-primary {
        background: linear-gradient(135deg, #404040 0%, #262626 100%);
        color: #fff;
        border: 1px solid #555;
      }

      .consent-btn-primary:hover {
        background: linear-gradient(135deg, #4a4a4a 0%, #333 100%);
        transform: translateY(-1px);
        border-color: #666;
      }

      .consent-btn-secondary {
        background: linear-gradient(135deg, #262626 0%, #1a1a1a 100%);
        color: #d4d4d4;
        border: 1px solid #444;
      }

      .consent-btn-secondary:hover {
        background: linear-gradient(135deg, #333 0%, #262626 100%);
        transform: translateY(-1px);
        border-color: #555;
      }

      .consent-learn-more-link {
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .consent-footer {
        padding: 20px 30px;
        background: rgba(10, 10, 10, 0.7);
        border-top: 1px solid #333;
        text-align: center;
      }

      .consent-footer-text {
        margin: 0;
        font-size: 13px;
        color: #888;
        font-weight: 400;
      }

      @media (max-width: 768px) {
        .consent-modal-content {
          max-width: 90vw;
        }

        .consent-header {
          padding: 25px 20px 15px 20px;
        }

        .consent-body {
          padding: 25px 20px;
        }

        .consent-title {
          font-size: 22px;
        }

        .consent-buttons {
          flex-direction: column;
        }

        .consent-btn {
          width: 100%;
          min-width: auto;
        }

        .consent-footer {
          padding: 15px 20px;
        }
      }

      @media (max-width: 480px) {
        .consent-modal-backdrop {
          padding: 10px;
        }

        .consent-title {
          font-size: 20px;
        }

        .consent-message {
          font-size: 15px;
        }

        .consent-btn {
          padding: 12px 20px;
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
        <div class="consent-header">
          <h2 class="consent-title">Please Acknowledge These Inhumane Governments</h2>
        </div>
        <div class="consent-body">
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
        <div class="consent-footer">
          <p class="consent-footer-text">Your acknowledgment helps raise awareness about human rights violations</p>
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
    modal.style.transform = "scale(0.95)";
    modal.style.transition = "all 0.3s ease";

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
