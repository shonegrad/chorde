import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { SongFilter } from '../types';

/**
 * The filter on the library, read from the URL.
 *
 * The query string is the single source of truth, so the browser's back and
 * forward buttons work as expected, and the sidebar and the library can never
 * disagree about what is being looked at.
 */
export const useLibraryFilter = (): [SongFilter | null, (filter: SongFilter | null) => void] => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const tag = searchParams.get('tag');
  const artist = searchParams.get('artist');
  const key = searchParams.get('key');
  const favourite = searchParams.get('favourite');
  const mine = searchParams.get('mine');

  const activeFilter = useMemo<SongFilter | null>(() => {
    if (tag) return { type: 'tag', value: tag };
    if (artist) return { type: 'artist', value: artist };
    if (key) return { type: 'key', value: key };
    if (favourite) return { type: 'favourite', value: favourite };
    if (mine) return { type: 'mine', value: mine };
    return null;
  }, [tag, artist, key, favourite, mine]);

  const setFilter = useCallback(
    (filter: SongFilter | null) => {
      if (filter) {
        navigate(`/?${filter.type}=${encodeURIComponent(filter.value)}`, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    },
    [navigate]
  );

  return [activeFilter, setFilter];
};
