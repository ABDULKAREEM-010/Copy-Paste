# ✨ Copy&Paste — Bypass Paste Restrictions

CopyPaste+ is a lightweight Chrome extension that lets you paste **exact text/code** into fields even on websites that block paste actions. No reformatting — your tabs, spaces, and newlines are preserved.

## 🚀 Features
- 📋 Paste or type into a panel; **exact formatting** is kept.
- ⌨️ Global shortcut **Alt+Shift+V** to paste into the focused field.
- 🖱️ Right‑click → **Paste from CopyPaste+** in editable fields.
- 🔒 Privacy‑first: no data leaves your browser.
- ⚡ Super lightweight & fast.

## 📦 Install (manual, free)
1. Download the ZIP from Releases and extract it.
2. Open `chrome://extensions/` → enable **Developer mode**.
3. Click **Load unpacked** → select the extracted folder.

## 🌐 Chrome Web Store (once published)
[Install from Chrome Web Store](https://chrome.google.com/webstore/detail/copypaste-plus) — *link becomes active after review.*

## 🧠 How it works
- A popup panel stores your exact text in extension storage.
- A content script intercepts site blockers and injects your stored text into inputs/textareas/contenteditable when you trigger paste.
- Fires an `input` event so frameworks (React/Vue/etc.) detect the change.

## 🔒 Privacy
CopyPaste+ does **not** collect or transmit any personal data. All processing happens locally in your browser.

## 👤 Author
Built with ❤️ by [Abdul Kareem](https://www.linkedin.com/in/mohamedabdul-kareem)

## 📝 License
MIT © 2025 Abdul Kareem
