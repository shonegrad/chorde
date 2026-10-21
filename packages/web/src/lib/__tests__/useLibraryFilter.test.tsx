import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useLibraryFilter } from '../useLibraryFilter';
import type { ReactNode } from 'react';

const wrapper =
  (route: string) =>
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
  );

describe('the filter on the library', () => {
  it('is nothing when there is no filter', () => {
    const { result } = renderHook(() => useLibraryFilter(), { wrapper: wrapper('/') });

    expect(result.current[0]).toBeNull();
  });

  it('reads a tag from the URL', () => {
    const { result } = renderHook(() => useLibraryFilter(), {
      wrapper: wrapper('/?tag=folk'),
    });

    expect(result.current[0]).toEqual({ type: 'tag', value: 'folk' });
  });

  it('reads every kind of filter from the URL', () => {
    const cases: [string, string, string][] = [
      ['/?artist=Someone', 'artist', 'Someone'],
      ['/?key=G', 'key', 'G'],
      ['/?favourite=true', 'favourite', 'true'],
      ['/?mine=true', 'mine', 'true'],
      ['/?known=true', 'known', 'true'],
      ['/?played=true', 'played', 'true'],
      ['/?popular=true', 'popular', 'true'],
    ];

    cases.forEach(([route, type, value]) => {
      const { result } = renderHook(() => useLibraryFilter(), { wrapper: wrapper(route) });
      expect(result.current[0]).toEqual({ type, value });
    });
  });

  it('puts a filter in the URL', () => {
    const { result } = renderHook(() => useLibraryFilter(), { wrapper: wrapper('/') });

    act(() => {
      result.current[1]({ type: 'tag', value: 'folk' });
    });

    expect(result.current[0]).toEqual({ type: 'tag', value: 'folk' });
  });

  it('takes the filter away again', () => {
    const { result } = renderHook(() => useLibraryFilter(), {
      wrapper: wrapper('/?tag=folk'),
    });

    act(() => {
      result.current[1](null);
    });

    expect(result.current[0]).toBeNull();
  });
});
