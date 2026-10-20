import { describe, it, expect } from 'vitest';
import { rankResults, dedupeResults, scoreResult, normalise } from '../lib/ranking';

const result = (title: string, artist = 'Someone', hasChords = true) => ({
  id: title,
  source: 'test',
  title,
  artist,
  hasChords,
});

describe('normalise', () => {
  it('lower cases and strips punctuation', () => {
    expect(normalise('Amazing Grace!')).toBe('amazing grace');
    expect(normalise('  He  Lifted Me ')).toBe('he lifted me');
  });
});

describe('scoreResult', () => {
  it('gives the highest score to an exact title', () => {
    const exact = scoreResult(result('Amazing Grace'), 'Amazing Grace');
    const partial = scoreResult(result('Amazing Grace (Graveson)'), 'Amazing Grace');
    const unrelated = scoreResult(result('What a Friend We Have'), 'Amazing Grace');

    expect(exact).toBeGreaterThan(partial);
    expect(partial).toBeGreaterThan(unrelated);
  });

  it('ignores case and punctuation', () => {
    expect(scoreResult(result('Amazing Grace'), 'amazing grace!')).toBe(
      scoreResult(result('Amazing Grace'), 'Amazing Grace')
    );
  });

  it('matches a title that starts with the query', () => {
    expect(scoreResult(result('Amazing Grace How Sweet'), 'amazing')).toBeGreaterThan(
      scoreResult(result('Oh How Amazing'), 'amazing')
    );
  });

  it('matches on the artist as well', () => {
    expect(scoreResult(result('Hymn', 'John Newton'), 'John Newton')).toBeGreaterThan(0);
  });

  it('scores a song with every word of the query', () => {
    const both = scoreResult(result('Amazing Grace'), 'amazing grace');
    const one = scoreResult(result('Amazing Lights'), 'amazing grace');
    expect(both).toBeGreaterThan(one);
  });
});

describe('rankResults', () => {
  it('puts the closest match first', () => {
    const results = [
      result('Amazing Love (You are my King)'),
      result('Hallelujah (Your Love is Amazing)'),
      result('Amazing Grace'),
      result('This Is Amazing Grace'),
    ];

    const ranked = rankResults(results, 'Amazing Grace');

    expect(ranked[0].title).toBe('Amazing Grace');
    expect(ranked[1].title).toBe('This Is Amazing Grace');
  });

  it('prefers a version with chords when the titles match equally well', () => {
    const results = [result('A Hymn', 'A', false), result('A Hymn', 'B', true)];
    const ranked = rankResults(results, 'A Hymn');

    expect(ranked[0].hasChords).toBe(true);
  });

  it('does not change the list when there is nothing to rank', () => {
    const results = [result('One'), result('Two')];
    expect(rankResults(results, '')).toHaveLength(2);
  });
});

describe('dedupeResults', () => {
  it('keeps only the first of a repeated title', () => {
    const results = [
      result('Amazing Grace', 'John Newton'),
      result('Amazing Grace', 'Unknown'),
      result('Amazing Grace (Graveson version)'),
    ];

    const deduped = dedupeResults(results);

    expect(deduped).toHaveLength(2);
    expect(deduped[0].artist).toBe('John Newton');
    expect(deduped[1].title).toBe('Amazing Grace (Graveson version)');
  });

  it('treats titles that differ only in punctuation as the same song', () => {
    const deduped = dedupeResults([result('Amazing Grace'), result('Amazing  Grace!')]);
    expect(deduped).toHaveLength(1);
  });

  it('keeps different songs apart', () => {
    const deduped = dedupeResults([result('Amazing Grace'), result('Amazing Love')]);
    expect(deduped).toHaveLength(2);
  });
});
