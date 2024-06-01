(async function (window, document) {
  /**
   * Fetch configuration for the chat widget.
   * @param {string} projectId - The project ID.
   * @returns {Promise<Object>} Config object for the chat widget.
   */
  async function getConfig(projectId) {
    const defaultConfig = {
      launcherText: "Chat with us 👋🏼",
      launcherBackgroundColor: "#4f46e5",
      launcherTextColor: "#ffffff",
    };

    try {
      const response = await fetch("https://app.easygpt.builders/api/widget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }), // Include the project ID in the request body
      });

      if (!response.ok) {
        return defaultConfig;
      }

      const config = await response.json();

      return { ...defaultConfig, ...config }; // Merge with defaults
    } catch (error) {
      console.error("Error fetching configurations: ", error);
      return defaultConfig; // Return default configurations if there is an error
    }
  }

  // Add CSS styles directly in the script to style the iframe and launcher button
  function addStyles(config) {
    const styles = `
          <style>
                #chat-frame {
                  display: none; /* Start hidden */
                  position: fixed;
                  width: 420px;
                  height: 75vh;
                  bottom: 20px;
                  right: 20px;
                  border-radius: 0.8rem;
                  border: none;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                  z-index: 9999999999;
                  margin-bottom:60px;
              }

              @media (max-width: 768px) {
                #chat-frame {
                  width: 100vw; /* Full width on smaller devices */
                  height: 100vh; /* Full height on smaller devices */
                  bottom: 0;
                  right: 0;
                  border-radius: 0;
                  margin-bottom: 0;
                }
              }
              
              #launcher-button {
                  cursor: pointer;
                  border:none;
                  background-color: ${config.launcherBackgroundColor}; /* Configured Background */
                  color: ${config.launcherTextColor}; /* Configured text color */
                  border-radius: 20px;
                  position: fixed;
                  bottom: 15px;
                  right: 25px;
                  padding: 0 20px;
                  height: 60px;
                  font-size: 15px;
                  text-align: center;
                  line-height: 60px; /* Vertically center text in the button */
                  z-index: 10000;
                  opacity: 0;
                  transition: all 800ms cubic-bezier(0.33, 0.00, 0.00, 1.00);
                  transition-property: opacity, transform;
                  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06), 0 2px 32px rgba(0, 0, 0, 0.16);
              }
              #launcher-button:hover {
                  transform: scale(1.1);
              }
              #launcher-button:active {
                  transform: scale(0.9);
              }
              #launcher-button.loaded {
                  opacity: 1; /* Show the button when loaded */
              }
          </style>
      `;
    document.head.insertAdjacentHTML("beforeend", styles);
  }

  /**
   * @param {string} scriptName
   */
  function getParams(scriptName) {
    const scripts = document.getElementsByTagName("script");
    for (const script of scripts) {
      if (script.src.includes(scriptName)) {
        const params = new URL(script.src).searchParams;
        return {
          projectId: params.get("id"),
          theme: params.get("theme") ?? "light",
        };
      }
    }
    return {};
  }

  /**
   * @param {string | any[]} name
   */
  function getCookie(name) {
    let cookieArray = document.cookie.split(";");
    for (let cookie of cookieArray) {
      while (cookie.startsWith(" ")) {
        cookie = cookie.substring(1);
      }
      if (cookie.startsWith(String(name) + "=")) {
        return cookie.substring(name.length + 1, cookie.length);
      }
    }
    return "";
  }

  /**
   * @param {string} name
   * @param {string} value
   * @param {number} days
   */
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  function createUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  if (getCookie("ez-gpt-session") === "") {
    const sessionId = createUUID();
    console.log({ sessionId });
    setCookie("ez-gpt-session", sessionId, 7);
  }

  // Read parameters
  const { projectId } = getParams("w.js");

  const config = await getConfig(projectId);

  // Initialize styles
  addStyles(config);

  // Create and style iframe
  const iframe = document.createElement("iframe");
  iframe.id = "chat-frame";
  iframe.style.display = "none";
  iframe.src = `https://app.easygpt.builders/w/${projectId}?sessionId=${getCookie("ez-gpt-session")}`;
  document.body.appendChild(iframe);

  // Handle messages from iframe
  window.addEventListener("message", (event) => {
    if (event.data === "closeChat") {
      iframe.style.display = "none";
      button.textContent = config.launcherText;
    }
  });

  // Create launcher button
  const button = document.createElement("button");
  button.id = "launcher-button";
  button.textContent = config.launcherText;
  document.body.appendChild(button);

  button.addEventListener("click", () => {
    const isOpen = iframe.style.display !== "none";
    iframe.style.display = isOpen ? "none" : "block";
    button.textContent = isOpen ? config.launcherText : "Close Chat";
  });

  // Show button fully once loaded
  setTimeout(() => {
    button.classList.add("loaded");
  }, 100);
})(window, document);
