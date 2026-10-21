# 🎸 Chorde

**Chorde** is a modern, responsive songbook application designed for musicians. It allows you to manage your song library using the industry-standard **ChordPro** format, transpose keys on the fly, and keep your repertoire organized.

## ✨ Features

- **ChordPro Support**: Parse and render songs with chord embedding.
- **More Ways In**: Import ChordPro, OnSong and the old `.crd` format — from pasted text, from
  files, from a folder you drop, or from a ZIP archive. A file that holds several songs is imported
  as several songs. All of it happens on your device, with nothing sent anywhere.
- **Writing Desk**: Write and transcribe your own songs with autosave, undo and redo, earlier
  versions, a chord palette that offers the chords of your key first, a metronome, and a key that
  is worked out from what you wrote. The song is read back as you write it, and undo takes back a
  word rather than a letter. Your songs are kept separate from the built-in ones.
- **Chords Over Lyrics**: Each chord sits directly above the word it belongs to, the way printed
  chord sheets are laid out. A chord written in the middle of a word keeps its place, and two
  chords over the same word are both shown.
- **Search-Based Import**: Search and import songs from public domain sources (OpenHymnal, etc.).
  The closest match comes first, the same song is never listed twice, and the writer and key are
  shown with each result. Hidden in production builds until a search API host is configured - see
  [DEPLOYMENT.md](./DEPLOYMENT.md).
- **Interactive Chord Library**:
  - Browse chords and view multiple finger positions (variations).
  - **Strumming Audio Preview**: Listen to realistic guitar strum playback with position-based timing.
  - **Your Own Shapes**: Draw the shape you play a chord with, and the app draws that shape for
    that chord from then on. Your shapes are kept on your device.
- **Dynamic Transposition**: Instantly change the key of any song, with the new key shown by name
  and chords spelled to match the new key signature.
- **Capo Support**: Shows the key the song actually sounds in for the selected capo.
- **Smart Song Viewer**:
  - Auto-scroll paced by tempo, with an optional count-in and click track.
  - Multiple display modes: Chords, Nashville Numbers, Tabs, and Notation.
  - Loop sections for practice.
  - Performance mode (fullscreen) for playing from a music stand.
  - Remembers your text size, display mode and per-song transposition.
- **Performance View**: A setlist plays through on a full screen, with the size of the words, a
  tempo you can tap in, the sections to jump to, and the next song to come. The screen stays awake
  while the set is running.
- **Printing**: Print the song as it is on the screen, or the changes of the song, with the shapes
  of the chords it uses drawn at the foot of the page. A setlist can be printed with the songs in
  it, one to a page.
- **Collapsible Navigation**: Browse by Keys, Artists, and Genres with item count badges. The
  sidebar stays in view on a big screen, so every place in the app is one click away.
- **A Page for Every Key**: The chords of the key, the songs that are in it, and the songs that
  could be played in it because every chord they use is a chord of the key.
- **Real Notation**: Chords are written out on a stave and in tablature, with the key signature
  of the song and the notes spelled the way a musician writes them.
- **Plays Like a Guitar**: The chords of a song can be played in the reader and on stage, with the
  volume, the tone and whether there is sound at all set in the settings.
- **Favourites**: Star the songs you play most and find them again in one click.
- **Share a Song**: Send somebody else a link to a song. The link carries the song with it, so
  they can add it to their own library. Nothing is sent anywhere until they do.
- **MIDI Export**: Write the chords of a song to a MIDI file, one chord to a bar, so you can play
  along with it in another program.
- **Play History**: The app remembers what was played and when, so you can sort by "Recently
  played" or "Most played". Mark the songs you have learned, and the library will tell you which
  ones are still new. The chords you reach for most are offered first when you write.
- **Organise Your Library**: Add tags, sort by title, artist, key, length, tempo or capo, group the
  songs by artist, key or tag, and search inside the lyrics as well as the titles.
- **Bulk Actions**: Select several songs at once to tag them, transpose them, add them to a
  setlist, or delete them.
- **Missing Details**: Find the songs that do not say what key they are in, or how long they take.
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
- **Setlists Know How Long They Take**: A setlist adds up the lengths of its songs and says how
  long it runs. It can also be written down to a file and read back on another device, and a song
  that is not in your library is kept in the set by its title, so the set still reads properly.
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
