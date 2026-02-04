# Aphelion - Messenger Bot

<img src="https://i.postimg.cc/mDQfyLd4/200w-(1).gif" alt="banner">
<h1 align="center"><img src="./dashboard/images/logo-non-bg.png" width="22px">

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Platform](https://img.shields.io/badge/Platform-Render-blue)
![Library](https://img.shields.io/badge/Library-FCA--NeoKex-orange)

> "An Automatic chatbot."
>
> A high-performance Facebook Messenger bot powered by **NeoKex (Multi-FCA Added Fork)**. Built for stability on Render with a custom **Shadow Garden** aesthetic.

---

## 👑 Owner

**Starboy Aphelion**

---

## ⚡ Features

* **Render Optimized:** Auto-login and keep-alive support for free tiers.
* **Anti-Ban Logic:** Windows User-Agent spoofing to reduce `1357004` blocks.
* **Shadow Garden Theme:** Custom ASCII-art startup banner.
* **Command System:** Modular command handling (GoatBot V2–style structure).
* **Multi-FCA Support:** NeoKex fork enhanced with additional FCA compatibility.
* **Auto-Restart:** Recovers automatically from temporary Facebook disconnects.

---

## 🚀 Installation & Setup

### **1. Prerequisites**

* A Facebook account (secondary/bot account recommended).
* A GitHub account.
* A [Render.com](https://render.com) account (Free Tier supported).

---

### **2. Deploy to Render**

1. Fork this repository to your GitHub account.
2. Create a new **Web Service** on Render.
3. Connect your GitHub repository.
4. Use the following settings:

   * **Runtime:** Node
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
5. In **Environment Settings**, ensure Node.js version is **18 or higher** (via `package.json` engines).

---

## 🍪 Cookie Login Setup (`account.txt`)

This bot uses Facebook cookies for passwordless login to avoid security checkpoints.

### **Steps**

1. Install the **Cookie-Editor** browser extension.
2. Log in to Facebook using your bot account.
3. Open Cookie-Editor → **Export** → **Export as JSON**.
4. Create a file named `account.txt` in the project root.
5. Paste the exported JSON into `account.txt` and save.
6. Commit/upload the file to your private repository.

> ⚠️ **Security Tip:** Never share your cookies publicly.

---

## 🛠️ Troubleshooting

### **Error: 1357004 / Not Logged In**

**Cause:** Facebook flagged the Render IP or session.

**Fix:**

1. Log out of the bot account on all devices.
2. Clear browser cookies and cache.
3. Log in again (Incognito recommended).
4. Export fresh cookies.
5. Replace `account.txt` and redeploy on Render.

---

### **Error: `undici` or `fetch` not found**

**Cause:** Node.js version is too old.

**Fix:** Ensure `package.json` includes:

```json
"engines": {
  "node": ">=18.0.0"
}
```

Then go to Render → **Manual Deploy** → **Clear Build Cache & Deploy**.

---

## 🧬 Credits

* **Base Bot Core:** GoatBot V2 — NTKhang
* **FCA Library:** NeoKex (extended fork with additional FCA support)
* **Fork & Enhancements:** Starboy Aphelion
* **Theme & Concept:** CID Kageno — Shadow Garden

---

⭐ If you like this project, don’t forget to give it a star on GitHub.
