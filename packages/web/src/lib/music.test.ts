import {
  transposeChord,
  transposeKey,
  keyPrefersFlats,
  transposeChordProContent,
} from '../lib/music';
import { chordToNashville } from '../lib/nashville';
import { generateScale } from '../lib/scales';
import { parseChordPro } from '../lib/chordPro';

describe('Music Library Functions', () => {
  describe('transposeChord', () => {
    it('should transpose major chord up by 2 semitones', () => {
      const result = transposeChord('C', 2);
      expect(result).toBe('D');
    });

    it('should transpose major chord down by 2 semitones', () => {
      const result = transposeChord('C', -2);
      expect(result).toBe('A#');
    });

    it('should transpose minor chord', () => {
      const result = transposeChord('Am', 3);
      expect(result).toBe('Cm');
    });

    it('should transpose chord with slash bass', () => {
      const result = transposeChord('C/G', 5);
      expect(result).toBe('F/C');
    });

    it('should handle complex chords', () => {
      const result = transposeChord('Cmaj7', 1);
      expect(result).toBe('C#maj7');
    });

    it('should transpose by 0 semitones (return same chord)', () => {
      const result = transposeChord('C', 0);
      expect(result).toBe('C');
    });

    it('should keep an explicitly flat chord flat', () => {
      expect(transposeChord('Eb', 1)).toBe('E');
      expect(transposeChord('Bb', 2)).toBe('C');
    });

    it('should keep an explicitly sharp chord sharp', () => {
      expect(transposeChord('F#', 1)).toBe('G');
      expect(transposeChord('C#', 2)).toBe('D#');
    });

    it('should spell natural chords with flats in a flat key', () => {
      // A song in Eb major transposed up a tone lands in F major.
      expect(transposeChord('C', 2, { preferFlats: true })).toBe('D');
      expect(transposeChord('C', 1, { preferFlats: true })).toBe('Db');
    });

    it('should spell natural chords with sharps in a sharp key', () => {
      expect(transposeChord('C', 1, { preferFlats: false })).toBe('C#');
    });

    it('should leave unparseable chords untouched', () => {
      expect(transposeChord('N.C.', 3)).toBe('N.C.');
    });

    it('should normalise unicode accidentals', () => {
      expect(transposeChord('C♯', 1)).toBe('D');
      expect(transposeChord('E♭', 1)).toBe('E');
    });
  });

  describe('transposeKey', () => {
    it('should transpose a major key', () => {
      expect(transposeKey('G', 2)).toBe('A');
    });

    it('should keep the minor suffix', () => {
      expect(transposeKey('Am', 2)).toBe('Bm');
    });

    it('should keep the full suffix of a complex key', () => {
      expect(transposeKey('Bmaj7', 1)).toBe('Cmaj7');
    });

    it('should spell flat keys with flats', () => {
      expect(transposeKey('Eb', 1, { preferFlats: true })).toBe('E');
      expect(transposeKey('Bb', 2, { preferFlats: true })).toBe('C');
    });

    it('should return the key unchanged when it cannot be parsed', () => {
      expect(transposeKey('unknown', 2)).toBe('unknown');
    });
  });

  describe('keyPrefersFlats', () => {
    it('should detect flat keys', () => {
      expect(keyPrefersFlats('F')).toBe(true);
      expect(keyPrefersFlats('Bb')).toBe(true);
      expect(keyPrefersFlats('Eb')).toBe(true);
      expect(keyPrefersFlats('Ab')).toBe(true);
    });

    it('should detect sharp keys', () => {
      expect(keyPrefersFlats('C')).toBe(false);
      expect(keyPrefersFlats('G')).toBe(false);
      expect(keyPrefersFlats('D')).toBe(false);
      expect(keyPrefersFlats('A')).toBe(false);
      expect(keyPrefersFlats('F#')).toBe(false);
    });

    it('should use the relative major for minor keys', () => {
      expect(keyPrefersFlats('Dm')).toBe(true); // relative major F
      expect(keyPrefersFlats('Gm')).toBe(true); // relative major Bb
      expect(keyPrefersFlats('Am')).toBe(false); // relative major C
      expect(keyPrefersFlats('Em')).toBe(false); // relative major G
      expect(keyPrefersFlats('Bbm')).toBe(true); // relative major Db
    });

    it('should default to sharps when there is no key', () => {
      expect(keyPrefersFlats(undefined)).toBe(false);
    });
  });

  describe('transposeChordProContent', () => {
    it('should transpose every chord marker', () => {
      const content = '[C]Hello [G]World';
      expect(transposeChordProContent(content, 2)).toBe('[D]Hello [A]World');
    });

    it('should leave the content untouched for a zero offset', () => {
      const content = '[C]Hello';
      expect(transposeChordProContent(content, 0)).toBe(content);
    });

    it('should not touch text that is not a chord marker', () => {
      expect(transposeChordProContent('{title: Test}', 2)).toBe('{title: Test}');
    });
  });

  describe('Nashville Number System', () => {
    it('should convert chord to Nashville numbers in key of C', () => {
      const result = chordToNashville('C', 'C');
      expect(result).toBe('1');
    });

    it('should convert chord to Nashville numbers in key of G', () => {
      const result = chordToNashville('C', 'G');
      expect(result).toBe('4');
    });

    it('should convert minor chord to Nashville numbers', () => {
      const result = chordToNashville('Am', 'C');
      expect(result).toBe('vi');
    });

    it('should convert Nashville numbers correctly', () => {
      const result1 = chordToNashville('C', 'G');
      expect(result1).toBe('4');

      const result2 = chordToNashville('F', 'C');
      expect(result2).toBe('4');
    });

    it('should handle various Nashville numbers', () => {
      // Test that the function works without throwing errors
      expect(() => chordToNashville('C', 'C')).not.toThrow();
      expect(() => chordToNashville('Am', 'G')).not.toThrow();
    });
  });

  describe('generateScale', () => {
    it('should generate C major scale', () => {
      const result = generateScale('C', 'major');
      expect(result).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    });

    it('should generate A minor scale', () => {
      const result = generateScale('A', 'minor');
      expect(result).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    });

    it('should generate C major pentatonic scale', () => {
      const result = generateScale('C', 'pentatonic-major');
      expect(result).toEqual(['C', 'D', 'E', 'G', 'A']);
    });

    it('should generate scale with flats when useFlats is true', () => {
      const result = generateScale('F', 'major', true);
      expect(result).toEqual(['F', 'G', 'A', 'Bb', 'C', 'D', 'E']);
    });

    it('should throw error for invalid scale type', () => {
      expect(() => generateScale('C', 'invalid-scale')).toThrow(
        'Unknown scale type: invalid-scale'
      );
    });

    it('should throw error for invalid root note', () => {
      expect(() => generateScale('H', 'major')).toThrow('Invalid root note: H');
    });
  });

  describe('parseChordPro', () => {
    it('should parse simple chord pro content', () => {
      const content = '{title: Test Song}\n{artist: Test Artist}\nC Am F G';
      const result = parseChordPro(content);

      expect(result).toHaveLength(1);
      expect(result[0].items).toEqual([{ lyric: 'C Am F G' }]);
    });

    it('should parse content with chords', () => {
      const content = 'C Am F G C';
      const result = parseChordPro(content);

      expect(result).toHaveLength(1);
      expect(result[0].items).toEqual([{ lyric: 'C Am F G C' }]);
    });

    it('should parse content with sections', () => {
      const content =
        '{start_of_verse}\nC Am F G\n{end_of_verse}\n{start_of_chorus}\nC F G\n{end_of_chorus}';
      const result = parseChordPro(content);

      expect(result).toHaveLength(2);
      expect(result[0].section?.type).toBe('verse');
      expect(result[1].section?.type).toBe('chorus');
    });

    it('should handle empty content', () => {
      const result = parseChordPro('');
      expect(result).toHaveLength(0);
    });

    it('should handle comments', () => {
      const content = '# This is a comment\nC Am F G';
      const result = parseChordPro(content);

      expect(result).toHaveLength(1);
      expect(result[0].items).toEqual(
        expect.arrayContaining([expect.objectContaining({ lyric: 'C Am F G' })])
      );
    });
  });
});
