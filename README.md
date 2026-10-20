# 🎸 Chorde

**Chorde** is a modern, responsive songbook application designed for musicians. It allows you to manage your song library using the industry-standard **ChordPro** format, transpose keys on the fly, and keep your repertoire organized.

## ✨ Features

- **ChordPro Support**: Parse and render songs with chord embedding.
- **Writing Desk**: Write and transcribe your own songs with autosave, undo and redo, earlier
  versions, a chord palette that offers the chords of your key first, a metronome, and a key that
  is worked out from what you wrote. Your songs are kept separate from the built-in ones.
- **Chords Over Lyrics**: Each chord sits directly above the word it belongs to, the way printed
  chord sheets are laid out.
- **Search-Based Import**: Search and import songs from public domain sources (OpenHymnal, etc.).
  The closest match comes first, the same song is never listed twice, and the writer and key are
  shown with each result. Hidden in production builds until a search API host is configured - see
  [DEPLOYMENT.md](./DEPLOYMENT.md).
- **Interactive Chord Library**:
  - Browse chords and view multiple finger positions (variations).
  - **Strumming Audio Preview**: Listen to realistic guitar strum playback with position-based timing.
- **Dynamic Transposition**: Instantly change the key of any song, with the new key shown by name
  and chords spelled to match the new key signature.
- **Capo Support**: Shows the key the song actually sounds in for the selected capo.
- **Smart Song Viewer**:
  - Auto-scroll paced by tempo, with an optional count-in and click track.
  - Multiple display modes: Chords, Nashville Numbers, Tabs, and Notation.
  - Loop sections for practice.
  - Performance mode (fullscreen) for playing from a music stand.
  - Remembers your text size, display mode and per-song transposition.
- **Collapsible Navigation**: Browse by Keys, Artists, and Genres with item count badges.
- **Favourites**: Star the songs you play most and find them again in one click.
- **Organise Your Library**: Add tags, sort by title, artist, key or date, and search inside the
  lyrics as well as the titles.
- **Bulk Actions**: Select several songs at once to tag them, add them to a setlist, or delete them.
- **Backup & Restore**: Export your whole library to a file and restore it on another device.
- **Local Storage**: Your library is saved locally in your browser and works offline. Changes in
  another tab are picked up straight away.
- **Light and Dark**: Follows the system setting by default, or pick one in Settings.
- **Public Domain Only**: Every song that ships with the app is public domain, and a test makes
  sure it stays that way.
- **Keyboard Friendly**: Arrow keys transpose, `+` and `-` change the text size, space starts the
  auto-scroll, and `?` shows the full list.
- **Works on a Phone**: A bottom navigation bar keeps every screen within reach, and the song
  viewer takes the whole screen for playing.
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

- [Handover](./HANDOVER.md) - **Start here** - the state of the project, the rules it lives by, and what to do next
- [Roadmap](./ROADMAP.md) - what has been done and what is planned
- [Agent Instructions](./AGENTS.md) - the commands, the key files and the conventions
- [Search Import Guide](./SEARCH_IMPORT_GUIDE.md) - how to use and extend the search-based import
- [Song Import Guide](./SONG_IMPORT_GUIDE.md)
- [Library Status](./SONG_LIBRARY_STATUS.md)
- [Development Guide](./DEVELOPMENT.md)
- [Deployment](./DEPLOYMENT.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🔍 New: Search-Based Import

Users can now search for songs from public domain sources and import them directly:

1. Click "Import" in the app
2. Switch to "Search Online" tab
3. Search for songs (e.g., "Amazing Grace")
4. Preview and import with one click

Currently supported sources:

- **OpenHymnal** - Public domain hymns in ChordPro format
- **Hymnary.org** - Public domain hymn texts
- **ChordPro.org** - Example songs

The closest match comes first, the same song is only listed once, and the writer and key are shown
with each result.

See [SEARCH_IMPORT_GUIDE.md](./SEARCH_IMPORT_GUIDE.md) for details on adding new sources.

> Online search needs the API, which is not hosted yet, so the tab is hidden in the deployed app.
> It works in development with `npm run dev:all`.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to get started.

## 📄 License

This project is licensed under the MIT License.
