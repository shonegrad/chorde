# Search-Based Import Feature

This document describes the new search-based song import functionality added to Chorde.

## Overview

Users can now search for songs from external sources and import them directly into their library, in addition to the existing paste/drop functionality.

## Architecture

The project has been converted to a **monorepo** structure with two packages:

```
chorde/
├── packages/
│   ├── web/          # React frontend (existing app)
│   └── api/          # Hono API service (new)
└── package.json      # Workspace configuration
```

### Frontend (`packages/web`)

**New Components:**

- `SongImporter.tsx` - Updated with tabbed interface (Paste/Drop | Search Online)
- `import/PasteTab.tsx` - Extracted paste/drop functionality
- `import/SearchTab.tsx` - New search interface
- `import/SearchResults.tsx` - Search results display with expand/preview
- `services/searchApi.ts` - API client for backend communication

### Backend (`packages/api`)

**Tech Stack:**

- **Hono** - Fast, lightweight web framework
- **TypeScript** - Type-safe API development
- **@hono/node-server** - Node.js adapter

**Structure:**

```
packages/api/src/
├── index.ts              # Server entry point
├── types.ts              # Shared type definitions
├── routes/
│   ├── search.ts         # GET /api/search
│   └── song.ts           # GET /api/song/:source/:id
└── adapters/
    ├── base.ts           # Abstract adapter class
    └── openhymnal.ts     # OpenHymnal implementation
```

## API Endpoints

### `GET /api/sources`

Returns available song sources.

**Response:**

```json
[
  {
    "id": "openhymnal",
    "name": "OpenHymnal",
    "enabled": true
  }
]
```

### `GET /api/search?q=<query>&sources=<source1,source2>`

Searches for songs across specified sources.

**Parameters:**

- `q` (required) - Search query
- `sources` (optional) - Comma-separated list of source IDs

**Response:**

```json
{
  "results": [
    {
      "id": "AmazingGrace",
      "source": "openhymnal",
      "title": "Amazing Grace",
      "artist": "John Newton",
      "key": "G",
      "hasChords": true,
      "license": "public-domain"
    }
  ],
  "totalCount": 1,
  "failedSources": []
}
```

Every result carries the `license` of the source it came from, so the app can tell whether an import
needs a rights confirmation. `failedSources` lists any source that could not be searched, rather
than letting a broken source look like "no results".

### `GET /api/song/:source/:id`

Fetches full song content.

**Response:**

```json
{
  "chordPro": "{title: Amazing Grace}\n{artist: John Newton}...",
  "metadata": {
    "title": "Amazing Grace",
    "artist": "John Newton",
    "key": "G"
  }
}
```

## Song Sources

### Implemented

| Source           | Type                     | Licence       | Notes                                                                              |
| ---------------- | ------------------------ | ------------- | ---------------------------------------------------------------------------------- |
| **OpenHymnal**   | Public domain hymns      | Public domain | ChordPro, converted from OpenSong. The writer and key are read from the hymn file. |
| **Hymnary.org**  | Public domain hymn texts | Public domain | Lyrics only, no chords.                                                            |
| **ChordPro.org** | Example songs            | Unknown       | The licence is not clear, so the app asks for confirmation before importing.       |

### Possible later

- **Public domain databases** - Folk, worship and traditional songs, fetched and cached.

OnSong files are read on your own computer, not through the API. The reader is in
`packages/shared/src/onsong.ts`, and it is shared with the OpenHymnal adapter, so there is one set
of rules.

The Session was removed: it returns HTML rather than the JSON the adapter expected, it had no
chords, and its notation could not be converted. An adapter that does not work should not be
advertised in `/api/sources`.

## Usage

### Development

1. **Start API Server:**

   ```bash
   npm run dev:api
   ```

   API runs on http://localhost:3001

2. **Start Frontend:**

   ```bash
   npm run dev
   ```

   App runs on http://localhost:5173

3. **Run Both:**
   ```bash
   npm run dev:all
   ```

### Using the Search Feature

1. Click "Import" in the app
2. Switch to "Search Online" tab
3. Type a song name (e.g., "Amazing Grace")
4. Click Search
5. Click the expand icon to preview the full ChordPro content
6. Click "Import" to add to your library

## Environment Variables

**Frontend (`packages/web/.env`):**

```
VITE_API_URL=http://localhost:3001
```

**Backend:**

```
PORT=3001  # Optional, defaults to 3001
```

## Adding New Sources

To add a new song source, create an adapter:

```typescript
// packages/api/src/adapters/mysource.ts
import { BaseAdapter } from './base.js';
import type { LicenseType, SearchResult, SongContent } from '@chorde/shared';

export class MySourceAdapter extends BaseAdapter {
  id = 'mysource';
  name = 'My Source';

  // The licence the source publishes under. It decides whether the app asks
  // the user to confirm before importing.
  license: LicenseType = 'public-domain';

  async search(query: string): Promise<SearchResult[]> {
    // Implement search logic
    return [];
  }

  async fetchSong(id: string): Promise<SongContent> {
    // Implement fetch logic
    return {
      chordPro: '',
      metadata: { title: '', artist: '' },
    };
  }

  // Optional. If the writer or the key can only be read from the song file
  // itself, this fills them in for the first few results.
  async enrichResults(results: SearchResult[]): Promise<SearchResult[]> {
    return results;
  }
}
```

The types come from `@chorde/shared`, which is the same package the web app uses, so there is only
one definition of them.

Then register it in both route files:

```typescript
// packages/api/src/routes/search.ts & song.ts
import { MySourceAdapter } from '../adapters/mysource.js';

const adapters = [
  new OpenHymnalAdapter(),
  new MySourceAdapter(), // Add here
];
```

Two things to get right:

- **The licence.** If the source is not public domain, set `license` to `'unknown'` and the app
  will ask the user to confirm before importing.
- **The result order.** The results are ranked by how well they match the search, and the same song
  is only listed once, so the source does not have to sort anything.

## Deployment

### Self-Hosted

**API:**

```bash
cd packages/api
npm run build
PORT=3001 node dist/index.js
```

**Frontend:**

```bash
cd packages/web
VITE_API_URL=https://your-api-domain.com npm run build
# Serve the dist/ folder
```

### Docker (Future)

A `Dockerfile` and `docker-compose.yml` will be provided for easy deployment.

## Testing

**Test API:**

```bash
# Health check
curl http://localhost:3001/health

# Search
curl "http://localhost:3001/api/search?q=amazing"

# Fetch song
curl "http://localhost:3001/api/song/openhymnal/AmazingGrace"
```

## Done

- [x] Hymnary.org adapter
- [x] ChordPro.org adapter
- [x] Source picker in the search screen
- [x] In-memory caching of the source index
- [x] Rate limiting
- [x] Batch import from a folder
- [x] Ranking, so the closest match comes first
- [x] De-duplication, so the same song is listed once
- [x] The writer and key, read from the song file
- [x] A notice when a source could not be searched

## Still to do

- [ ] The API is not hosted yet, so online search is hidden in production
- [ ] User preferences for default sources
- [ ] Advanced search filters (key, artist, tags)
- [ ] Search result pagination

## Legal Considerations

This implementation focuses on **public domain** and **legally accessible** sources:

- ✅ OpenHymnal - CC0 licensed
- ✅ Hymnary.org - Has public API
- ✅ ChordPro.org - Educational examples
- ⚠️ Ultimate Guitar - Check ToS before implementing
- ⚠️ Chordie - Check ToS before implementing

Always review the Terms of Service before scraping or accessing third-party APIs.

Only public domain material is shipped with the app itself. The sources above are all public
domain or clearly marked as unknown, and the app asks for confirmation before importing anything it
cannot vouch for.
