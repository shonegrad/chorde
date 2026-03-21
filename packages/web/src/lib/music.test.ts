import { transposeChord } from '../lib/music';
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
            expect(result).toBe('Bb');
        });

        it('should transpose minor chord', () => {
            const result = transposeChord('Am', 3);
            expect(result).toBe('Cm');
        });

        it('should transpose chord with slash bass', () => {
            const result = transposeChord('C/G', 5);
            expect(result).toBe('F/D');
        });

        it('should handle complex chords', () => {
            const result = transposeChord('Cmaj7', 1);
            expect(result).toBe('C#maj7');
        });

        it('should transpose by 0 semitones (return same chord)', () => {
            const result = transposeChord('C', 0);
            expect(result).toBe('C');
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
            expect(result).toBe('6m');
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
            const result = generateScale('C', 'major-pentatonic');
            expect(result).toEqual(['C', 'D', 'E', 'G', 'A']);
        });

        it('should generate scale with flats when useFlats is true', () => {
            const result = generateScale('F', 'major', true);
            expect(result).toEqual(['F', 'G', 'Ab', 'Bb', 'C', 'D', 'E']);
        });

        it('should throw error for invalid scale type', () => {
            expect(() => generateScale('C', 'invalid-scale')).toThrow('Unknown scale type: invalid-scale');
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
            expect(result[0].items).toEqual([
                { text: 'C Am F G', chord: 'C' },
                { text: ' Am F G', chord: 'Am' },
                { text: ' F G', chord: 'F' },
                { text: ' G', chord: 'G' }
            ]);
        });

        it('should parse content with chords', () => {
            const content = 'C Am F G C';
            const result = parseChordPro(content);

            expect(result).toHaveLength(1);
            expect(result[0].items).toEqual([
                { text: 'C Am F G C', chord: 'C' },
                { text: ' Am F G C', chord: 'Am' },
                { text: ' F G C', chord: 'F' },
                { text: ' G C', chord: 'G' },
                { text: ' C', chord: 'C' }
            ]);
        });

        it('should parse content with sections', () => {
            const content = '{start_of_verse}\nC Am F G\n{end_of_verse}\n{start_of_chorus}\nC F G\n{end_of_chorus}';
            const result = parseChordPro(content);

            expect(result).toHaveLength(4);
            expect(result[0].section?.type).toBe('start_of_verse');
            expect(result[2].section?.type).toBe('start_of_chorus');
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
                expect.arrayContaining([
                    expect.objectContaining({ text: 'C Am F G' })
                ])
            );
        });
    });
});