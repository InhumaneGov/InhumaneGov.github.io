(function () {
  "use strict";

  // Configuration with defaults
  const config = {
    cookieName: "inhumanegov",
    expirationDays: 365,
    message:
      "🇮🇱 Israel committed genocide in 🇵🇸 Palestine<br />🇷🇺 Russia invaded 🇺🇦 Ukraine<br />🇺🇸 US violated constitutional rights<br />These governments are inhumane",
    acceptText: "I Acknowledge",
    learnMoreUrl: "https://inhumanegov.com/news",
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
        backdrop-filter: blur(8px);
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
        background: #0a0a0a;
        border: 1px solid #333;
        border-radius: 16px;
        max-width: 540px;
        width: 100%;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        overflow: hidden;
      }


      .consent-header {
        background: #111;
        padding: 2rem 2rem 1.5rem 2rem;
        border-bottom: 1px solid #333;
        position: relative;
      }

      .consent-header::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 120px;
        height: 3px;
        background: linear-gradient(90deg, transparent, #666, transparent);
      }

      .consent-title {
        margin: 0;
        font-size: 2rem;
        font-weight: 700;
        text-align: center;
        color: #f5f5f5;
        letter-spacing: -0.5px;
        line-height: 1.3;
      }

      .consent-body {
        padding: 2rem;
        background: #0a0a0a;
      }

      .consent-message {
        margin: 0 0 2rem 0;
        font-size: 1.125rem;
        line-height: 1.7;
        text-align: center;
        color: #d4d4d4;
        font-weight: 400;
      }

      .consent-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        align-items: center;
      }

      .consent-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.75rem;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 600;
        transition: all 0.3s ease;
        min-width: 140px;
        border: 1px solid;
      }

      .consent-btn-primary {
        background: #1a1a1a;
        color: #fff;
        border-color: #444;
      }

      .consent-btn-primary:hover {
        background: #2a2a2a;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      }

      .consent-btn-secondary {
        background: transparent;
        color: #d4d4d4;
        border-color: #444;
      }

      .consent-btn-secondary:hover {
        background: #1a1a1a;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      }

      .consent-learn-more-link {
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .consent-footer {
        padding: 1.5rem 2rem;
        background: #111;
        border-top: 1px solid #333;
        text-align: center;
      }

      .consent-footer-text {
        margin: 0;
        font-size: 0.875rem;
        color: #888;
        font-weight: 400;
        line-height: 1.5;
      }

      .consent-footer-link {
        color: #d4d4d4;
        text-decoration: none;
      }

      .consent-footer-link:hover {
        color: #fff;
        text-decoration: underline;
      }

      @media (max-width: 768px) {
        .consent-modal-content {
          max-width: 90vw;
          transform: none;
        }

        .consent-modal-content:hover {
          transform: none;
        }

        .consent-header {
          padding: 1.5rem 1.5rem 1rem 1.5rem;
        }

        .consent-body {
          padding: 1.5rem;
        }

        .consent-title {
          font-size: 1.75rem;
        }

        .consent-message {
          font-size: 1rem;
        }

        .consent-buttons {
          flex-direction: column;
        }

        .consent-btn {
          width: 100%;
          min-width: auto;
        }

        .consent-footer {
          padding: 1rem 1.5rem;
        }
      }

      @media (max-width: 480px) {
        .consent-modal-backdrop {
          padding: 10px;
        }

        .consent-title {
          font-size: 1.5rem;
        }

        .consent-message {
          font-size: 0.95rem;
        }

        .consent-btn {
          padding: 0.75rem 1rem;
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
          <h2 class="consent-title">Please Acknowledge<br /><span style="color: #a3a3a3; font-size: 0.9em;">These Inhumane Governments</span></h2>
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
          <p class="consent-footer-text">
            Your acknowledgment helps raise awareness about human rights violations<br />
            Add this to your site with a simple script from
            <a href="https://inhumanegov.com" target="_blank" class="consent-footer-link">inhumanegov.com</a>
          </p>
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
