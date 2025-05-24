# Unsplash Vue Gallery 🌄

[![Vercel Deployment](https://img.shields.io/badge/Live%20Demo-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://unsplash-vue-gallery-rwqt.vercel.app/)

A responsive image gallery powered by Vue 3 and Unsplash API. Features infinite scroll, theme switching, and local favorites.  
**Live Demo:** [Explore Now](https://unsplash-vue-gallery-rwqt.vercel.app/)

![Gallery Preview](./my-gallery/src/assets/my-gallery.png)

## ✨ Core Features

- **🌗 Smart Theme System** — Auto-saves preference (light/dark)
- **💖 Persistent Likes** — LocalStorage favorites management
- **📸 Instant Search** — Real-time Unsplash API integration
- **♾️ Seamless Pagination** — Infinite scroll with error handling
- **📱 Adaptive Grid** — Responsive column layout (1-4 cols)
- **🔍 Search Filters** — Toggle between all/liked images

## 🚀 Quick Deployment

### 1-Click Hosting

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Funsplash-vue-gallery)

### Local Setup

```

git clone https://github.com/LIGECT/unsplash-vue-gallery.git
cd unsplash-vue-gallery
npm install
npm run dev

```

## 🏗 Project Structure

```

UNSPLASH-VUE-GALLERY/
├── src/
│ ├── api/ # Unsplash API client
│ ├── components/ # Vue components
│ ├── composables/ # Reactive logic modules
│ │ ├── useTheme.js # Theme state manager
│ │ ├── useColumnCount.js # Dynamic grid columns
│ │ └── useImageSearch.js # Search/pagination handler
│ └── main.js # Vue initialization
├── public/ # Static assets
└── vite.config.js # Build configuration

```

## 📌 Requirements

- Node.js v18+
- Modern browser (Chrome/Edge/Firefox)
- Internet connection
