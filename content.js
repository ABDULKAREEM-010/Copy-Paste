// content.js (deep fix)
(() => {
  // Prevent duplicate initialization
  if (window.__COPYPASTE_PLUS_LOADED) return;
  window.__COPYPASTE_PLUS_LOADED = true;

  // Allow user copy/cut but block site handlers that prevent selection/context menu
  // We DON'T block copy/cut events - those should work normally for the user
  const blockTypes = ["contextmenu","selectstart","dragstart"];
  const stopper = (e) => { e.stopPropagation(); };
  blockTypes.forEach((t) => {
    window.addEventListener(t, stopper, true);
    document.addEventListener(t, stopper, true);
  });

  // Clear inline handlers if present
  document.addEventListener("DOMContentLoaded", () => {
    try {
      document.onpaste = document.oncopy = document.oncut = document.oncontextmenu = null;
      if (document.body) {
        document.body.onselectstart = null;
        document.body.style.userSelect = "text";
        document.body.style.webkitUserSelect = "text";
      }
    } catch {}
  });

  // Listen for paste command from background/popup
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === "pasteFromPanel") {
      pastePanelTextIntoFocused();
    }
  });

  // Our shortcut only; never hijack Ctrl+V
  document.addEventListener("keydown", (e) => {
    if (e.altKey && e.shiftKey && e.key.toLowerCase() === "v") {
      e.preventDefault();
      pastePanelTextIntoFocused();
    }
  }, false);

  async function pastePanelTextIntoFocused() {
    try {
      const active = document.activeElement;
      if (!active) return;
      const { panelText = "" } = await chrome.storage.sync.get("panelText");
      const text = panelText || "";
      if (!text) return;

      // Enable input if site disabled it
      try { active.removeAttribute("readonly"); active.removeAttribute("disabled"); } catch {}

      const tag = (active.tagName || "").toLowerCase();

      if (tag === "input" || tag === "textarea") {
        // Replace entire value with our buffer (prevents previous+current concat)
        active.value = text;
        try { active.selectionStart = active.selectionEnd = text.length; } catch {}
        active.dispatchEvent(new Event("input", { bubbles: true }));
        return;
      }

      if (active.isContentEditable) {
        // Replace content with plain text using modern APIs (no execCommand)
        // Keep exact tabs/newlines by inserting a text node.
        // Clear and insert:
        while (active.firstChild) active.removeChild(active.firstChild);
        active.appendChild(document.createTextNode(text));
        return;
      }

      // Fallback: find an editable target (broader selector)
      const editable = document.querySelector('textarea, input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), [contenteditable="true"]');
      if (editable) {
        editable.focus();
        if (editable.tagName && ["input","textarea"].includes(editable.tagName.toLowerCase())) {
          editable.value = text;
          editable.dispatchEvent(new Event("input", { bubbles: true }));
        } else if (editable.isContentEditable) {
          while (editable.firstChild) editable.removeChild(editable.firstChild);
          editable.appendChild(document.createTextNode(text));
        }
      }
    } catch (err) {
      console.warn("Paste from panel failed:", err);
    }
  }
})();
