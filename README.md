# 🎸 Chorde

**Chorde** is a modern, responsive songbook application designed for musicians. It allows you to manage your song library using the industry-standard **ChordPro** format, transpose keys on the fly, and keep your repertoire organized.

## ✨ Features

- **ChordPro Support**: Parse and render songs with chord embedding.
- **Search-Based Import**: Search and import songs from public domain sources (OpenHymnal, etc.).
- **Interactive Chord Library**:
  - Browse chords and view multiple finger positions (variations).
  - **Strumming Audio Preview**: Listen to realistic guitar strum playback with position-based timing.
- **Dynamic Transposition**: Instantly change the key of any song.
- **Smart Song Viewer**:
  - Auto-scroll with adjustable speed.
  - Multiple display modes: Chords, Tabs, and Notation.
  - Loop sections for practice.
- **Collapsible Navigation**: Browse by Keys, Artists, and Genres with item count badges.
- **Local Storage**: Your library is saved locally in your browser.
- **Nashville Number System**: View songs in numbers for universal playability.
- **Performance**: Lazy loading for large song libraries.
- **Responsive Design**: Works great on desktop and tablets.

## 🏗️ Project Structure

This is a **monorepo** with three packages:

```
chorde/
├── packages/
│   ├── web/          # React frontend application
│   ├── api/          # Hono API service for song search
│   └── shared/       # Shared TypeScript types
└── package.json      # Workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/chorde.git
    cd chorde
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Start the development servers:

    ```bash
    # Start both frontend and API
    npm run dev:all

    # Or start separately:
    npm run dev      # Frontend only (http://localhost:5173)
    npm run dev:api  # API only (http://localhost:3001)
    ```

4.  Open your browser at `http://localhost:5173`

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Library**: Material UI (MUI) v7
- **Styling**: MUI's `sx` prop + modular CSS

### Backend

- **Framework**: Hono
- **Runtime**: Node.js with @hono/node-server
- **Language**: TypeScript

## 📖 Documentation

- [Search Import Guide](./SEARCH_IMPORT_GUIDE.md) - **NEW** - How to use and extend the search-based import feature
- [Song Import Guide](./SONG_IMPORT_GUIDE.md)
- [Library Status](./SONG_LIBRARY_STATUS.md)
- [Development Guide](./DEVELOPMENT.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🔍 New: Search-Based Import

Users can now search for songs from public domain sources and import them directly:

1. Click "Import" in the app
2. Switch to "Search Online" tab
3. Search for songs (e.g., "Amazing Grace")
4. Preview and import with one click

Currently supported sources:

- **OpenHymnal** - Public domain hymns in ChordPro format

See [SEARCH_IMPORT_GUIDE.md](./SEARCH_IMPORT_GUIDE.md) for details on adding new sources.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to get started.

## 📄 License

This project is licensed under the MIT License.
