// popup.js (deep fix)
const panel = document.getElementById("panelText");
const statusEl = document.getElementById("status");

function setStatus(msg) {
  statusEl.textContent = msg;
  statusEl.style.opacity = "1";
  setTimeout(() => (statusEl.style.opacity = "0.75"), 1200);
}

// Load previous buffer into textarea
chrome.storage.sync.get(["panelText"], ({ panelText }) => {
  panel.value = panelText || "";
});

// Save on input (so buffer persists)
panel.addEventListener("input", () => {
  chrome.storage.sync.set({ panelText: panel.value });
});

// Copy & Set Buffer
document.getElementById("copySetBtn").addEventListener("click", async () => {
  const text = panel.value || "";
  chrome.storage.sync.set({ panelText: text });
  try {
    await navigator.clipboard.writeText(text);
    setStatus("✅ Copied and buffer set");
  } catch (e) {
    setStatus("⚠️ Copied to buffer (clipboard permission denied)");
  }
});

// Paste into page now (ensure content.js is present first)
document.getElementById("pasteNowBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.id) {
    chrome.scripting.executeScript(
      { target: { tabId: tab.id }, files: ["content.js"] },
      () => {
        chrome.tabs.sendMessage(tab.id, { type: "pasteFromPanel" });
        setStatus("⬇️ Sent paste command to page");
      }
    );
  } else {
    setStatus("⚠️ No active tab");
  }
});

// Auto-clear buffer when popup closes
window.addEventListener("unload", () => {
  panel.value = "";
  chrome.storage.sync.set({ panelText: "" });
});
