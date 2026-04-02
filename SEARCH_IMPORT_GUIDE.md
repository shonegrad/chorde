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
      "key": "G"
    }
  ],
  "totalCount": 1
}
```

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

### Phase 1: Safe/Legal Sources (Implemented)

#### OpenHymnal
- **Type:** Public domain hymns
- **Format:** ChordPro
- **License:** CC0 (Public Domain)
- **Status:** MVP implementation with sample songs

### Phase 2: Future Sources (Planned)

- **Hymnary.org** - Public API for hymn texts/metadata
- **ChordPro.org** - Example songs from official site
- **Public Domain Databases** - Folk, worship, traditional songs

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
import type { SearchResult, SongContent } from '../types.js';

export class MySourceAdapter extends BaseAdapter {
  id = 'mysource';
  name = 'My Source';

  async search(query: string): Promise<SearchResult[]> {
    // Implement search logic
    return [];
  }

  async fetchSong(id: string): Promise<SongContent> {
    // Implement fetch logic
    return {
      chordPro: '',
      metadata: { title: '', artist: '' }
    };
  }
}
```

Then register it in both route files:
```typescript
// packages/api/src/routes/search.ts & song.ts
import { MySourceAdapter } from '../adapters/mysource.js';

const adapters = [
  new OpenHymnalAdapter(),
  new MySourceAdapter(),  // Add here
];
```

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

## Future Enhancements

- [ ] Add Hymnary.org adapter
- [ ] Add ChordPro.org adapter
- [ ] Source enable/disable UI in frontend
- [ ] Result caching (Redis/in-memory)
- [ ] Rate limiting
- [ ] User preferences for default sources
- [ ] Advanced search filters (key, artist, tags)
- [ ] Batch import multiple songs
- [ ] Search result pagination

## Legal Considerations

This implementation focuses on **public domain** and **legally accessible** sources:

- ✅ OpenHymnal - CC0 licensed
- ✅ Hymnary.org - Has public API
- ✅ ChordPro.org - Educational examples
- ⚠️ Ultimate Guitar - Check ToS before implementing
- ⚠️ Chordie - Check ToS before implementing

Always review the Terms of Service before scraping or accessing third-party APIs.
