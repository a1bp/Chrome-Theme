# 🎮 GamesTab - Premium Chrome New Tab

A high-performance, gaming-inspired New Tab override for Chrome, built with **TypeScript** and **Vite**. Features a sleek glassmorphism UI, real-time AI assistance via Groq, and deep customization options.


## ✨ Features

- **🚀 Futuristic UI**: A premium glassmorphism dashboard with neon accents and fluid animations.
- **🕒 Dynamic Clock & Date**: High-visibility "Orbitron" font clock with localized date.
- **🤖 ANIK AI Core**: Integrated Groq AI assistant for high-speed conversational responses directly in your tab.
- **🛠️ Interface Config**: 
  - Switch between custom Image and Video backgrounds.
  - Adjustable Blur and Dim levels for maximum focus.
  - Dynamic Accent Color picker with presets.
- **🔗 Quick Links**: Drag-and-drop bookmark manager with automatic favicon fetching.
- **🧩 Toolbar Popup**: Quickly enable/disable the theme or jump to settings from the Chrome toolbar.
- **🔍 Smart Search**: Integrated Google search with an image-search (Google Lens) shortcut.

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System)
- **Logic**: TypeScript (Strict Mode)
- **Build Tool**: Vite 8.x
- **APIs**: Chrome Extensions API (V3), Groq AI API, IndexedDB

## 📦 Installation (Developer Mode)

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/a1bp/Chrome-Theme.git
   cd Chrome-Theme
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Build the Project**:
   ```bash
   npm run build
   ```

4. **Load into Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** (top right toggle).
   - Click **Load unpacked**.
   - Select the **`dist`** folder from this project directory.
*Note: Chrome APIs (bookmarks, storage) are only active when the project is loaded as an extension from the `dist` folder.*

## ⚙️ Configuration

1. Open a new tab.
2. Click the **Gear icon** in the bottom right to open the **Interface Config**.
3. To use AI features, paste your **Groq API Key** in the settings panel (Get one at [console.groq.com](https://console.groq.com/keys)).

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to enhance the gaming experience.

---

**Developed with ❤️ by [Anik](https://github.com/a1bp)**
