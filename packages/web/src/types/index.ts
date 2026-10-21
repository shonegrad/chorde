export type {
  Song,
  SongSection,
  SongAnnotation,
  AnnotationKind,
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
  Setlist,
  SetlistSong,
} from '@chorde/shared';

import type { LicenseType } from '@chorde/shared';

export type { LicenseType };

/** Where an imported song came from, used for attribution and licence detection. */
export interface ImportSource {
  name: string;
  url?: string;
  license?: LicenseType;
}
