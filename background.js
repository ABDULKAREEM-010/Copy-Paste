// background.js (deep fix, MV3 service worker)
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["panelText"], (cfg) => {
    if (cfg.panelText === undefined) chrome.storage.sync.set({ panelText: "" });
  });
  // Context menu for editable fields
  try {
    chrome.contextMenus.create({
      id: "pasteFromPanel",
      title: "Paste from CopyPaste+",
      contexts: ["editable"]
    });
  } catch {}
});

chrome.contextMenus?.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "pasteFromPanel" && tab && tab.id) {
    chrome.scripting.executeScript(
      { target: { tabId: tab.id }, files: ["content.js"] },
      () => chrome.tabs.sendMessage(tab.id, { type: "pasteFromPanel" })
    );
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "paste_from_panel") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      chrome.scripting.executeScript(
        { target: { tabId: tab.id }, files: ["content.js"] },
        () => chrome.tabs.sendMessage(tab.id, { type: "pasteFromPanel" })
      );
    }
  }
});
