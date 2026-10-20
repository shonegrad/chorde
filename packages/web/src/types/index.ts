export type {
  Song,
  SongSection,
  ParsedLine,
  DisplayMode,
  ViewMode,
  ParsedSong,
  SongFilter,
  Source,
  SearchResult,
  SongContent,
  SourceAdapter,
  SongAttribution,
} from '@chorde/shared/src/index';

import type { LicenseType } from '@chorde/shared/src/index';

export type { LicenseType };

/** Where an imported song came from, used for attribution and licence detection. */
export interface ImportSource {
  name: string;
  url?: string;
  license?: LicenseType;
}
