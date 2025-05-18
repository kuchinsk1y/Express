# Express Server with JWT, Cookies, and Favicon Support

## 🔧 Installation

```bash
npm install
node server.js
```

## 📌 Routes

- `/` — Main page (PUG)
- `/ejs` — Page using EJS template
- `/set-theme/:theme` — Set theme (stored in cookie)
- `/register` — Register user (POST JSON `{username, password}`)
- `/login` — Login user (POST JSON `{username, password}`)
- `/profile` — Protected route, requires JWT