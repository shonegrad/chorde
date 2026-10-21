import React, { useMemo } from 'react';
import type { DisplayMode, ParsedSong } from '../types';
import { chordToNashville } from '../lib/nashville';
import { ChordNotation } from './ChordNotation';
import { shapeOfChord } from '../lib/notation';
import '../styles/SongViewer.css';

interface SongBodyProps {
  lines: ParsedSong;
  displayMode: DisplayMode;
  /** Key used for Nashville number conversion and the notation key signature. */
  songKey: string;
  onChordClick?: (chord: string) => void;
  /** Called with the DOM node of each rendered line, for section navigation. */
  onLineRef?: (index: number, element: HTMLDivElement | null) => void;
}

type Token =
  | { kind: 'text'; text: string }
  | { kind: 'chord'; chord: string; word: string; rest: string; standalone: boolean };

/**
 * Split the lyric that belongs to a chord into the first word (which carries
 * the chord) and the remainder (which flows as ordinary text).
 */
const splitFirstWord = (lyric: string): { word: string; rest: string } => {
  const match = lyric.match(/^(\s*)(\S*)([\s\S]*)$/);
  if (!match) return { word: '\u00A0', rest: '' };

  const [, leading, word, rest] = match;
  if (!word) {
    // The chord has no lyric of its own, so keep a placeholder word and hold
    // on to the spacing that follows it.
    return { word: '\u00A0', rest: leading + rest };
  }

  return { word: leading + word, rest };
};

const buildTokens = (line: ParsedSong[number]): Token[] => {
  const tokens: Token[] = [];

  for (const item of line.items) {
    if (item.chord) {
      const lyric = item.lyric ?? '';
      if (!lyric.trim()) {
        const { word, rest } = splitFirstWord(lyric);
        tokens.push({ kind: 'chord', chord: item.chord, word, rest, standalone: true });
        if (rest) tokens.push({ kind: 'text', text: rest });
        continue;
      }
      const { word, rest } = splitFirstWord(lyric);
      tokens.push({ kind: 'chord', chord: item.chord, word, rest, standalone: false });
      if (rest) tokens.push({ kind: 'text', text: rest });
    } else if (item.lyric) {
      tokens.push({ kind: 'text', text: item.lyric });
    }
  }

  return tokens;
};

/**
 * Renders the body of a song.
 *
 * Chords and Nashville numbers are laid out with the chord sitting directly
 * above the word it belongs to. Tab and notation modes keep their own,
 * block-based layout because the artwork is far too large to sit inline.
 */
export const SongBody: React.FC<SongBodyProps> = ({
  lines,
  displayMode,
  songKey,
  onChordClick,
  onLineRef,
}) => {
  const isNotation = displayMode === 'notation';
  const isTabs = displayMode === 'tabs';
  const usesArtwork = isNotation || isTabs;

  const tokenized = useMemo(() => lines.map((line) => buildTokens(line)), [lines]);

  // The first line that has any chords on it, so that the clef and the key
  // signature are only drawn at the start of the song.
  const firstChordLine = useMemo(() => {
    const index = tokenized.findIndex((tokens) => tokens.some((token) => token.kind === 'chord'));
    return index;
  }, [tokenized]);

  const chordLabel = (chord: string): string =>
    displayMode === 'nashville' ? chordToNashville(chord, songKey || 'C') : chord;

  /**
   * The chords of a line, written out.
   *
   * The clef and the key signature are only drawn once, at the start of the
   * song, the way they are on a page of music.
   */
  const notationFor = (chords: string[], showKey: boolean): React.ReactNode => {
    if (isNotation) {
      return (
        <ChordNotation
          kind="staff"
          chords={chords}
          songKey={songKey}
          showKey={showKey}
          width={showKey ? 64 + chords.length * 72 : 10 + chords.length * 72}
          height={78}
        />
      );
    }

    // The tab is the shape on the guitar, which only the chords the library
    // knows about have.
    const shapes = chords.map((chord) => shapeOfChord(chord));
    if (shapes.some((shape) => !shape)) return null;

    return (
      <ChordNotation
        kind="tab"
        chords={chords}
        shapes={shapes as (number | 'x')[][]}
        showKey={showKey}
        width={showKey ? 30 + chords.length * 60 : 8 + chords.length * 60}
        height={80}
      />
    );
  };

  /**
   * The accessible name starts with the visible text so that a screen reader
   * announces the same thing a sighted user reads.
   */
  const chordButtonLabel = (chord: string): string => {
    const label = chordLabel(chord);
    return label === chord
      ? `Show chord diagram for ${chord}`
      : `${label} — show chord diagram for ${chord}`;
  };

  return (
    <div className={`song-body song-body--${displayMode}`}>
      {tokenized.map((tokens, lineIndex) => {
        const line = lines[lineIndex];
        const hasChords = tokens.some((token) => token.kind === 'chord');
        const lineChords = tokens
          .filter((token): token is Extract<Token, { kind: 'chord' }> => token.kind === 'chord')
          .map((token) => token.chord);
        // The clef and the key signature are only at the start of the song.
        const firstLine = lineIndex === firstChordLine;

        return (
          <div
            key={lineIndex}
            ref={(element: HTMLDivElement | null) => onLineRef?.(lineIndex, element)}
            className="song-line"
          >
            {line.section && (
              <div className="section-label" data-section-type={line.section.type}>
                {line.section.label}
              </div>
            )}

            {usesArtwork ? (
              <div className="song-line-art">
                {/*
                  The chords of the line are written out along the top of it,
                  in the order they are played, and the words run underneath.
                  The writing is too big to sit over a word without pushing
                  the words apart.
                */}
                {lineChords.length > 0 && (
                  <div className="song-line-art-chords">{notationFor(lineChords, firstLine)}</div>
                )}

                <div className="song-line-content">
                  {tokens.map((token, tokenIndex) =>
                    token.kind === 'text' ? (
                      <React.Fragment key={tokenIndex}>{token.text}</React.Fragment>
                    ) : (
                      <React.Fragment key={tokenIndex}>
                        <span className="chord-word">{token.word}</span>
                      </React.Fragment>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div
                className={`song-line-content${hasChords ? ' song-line-content--with-chords' : ''}`}
              >
                {tokens.map((token, tokenIndex) =>
                  token.kind === 'text' ? (
                    <React.Fragment key={tokenIndex}>{token.text}</React.Fragment>
                  ) : (
                    <React.Fragment key={tokenIndex}>
                      <span
                        className={`chord-anchor${
                          token.standalone ? ' chord-anchor--standalone' : ''
                        }`}
                      >
                        <button
                          type="button"
                          className="chord-display"
                          onClick={() => onChordClick?.(token.chord)}
                          aria-label={chordButtonLabel(token.chord)}
                        >
                          {chordLabel(token.chord)}
                        </button>
                        {token.standalone ? (
                          // Reserves the width of the chord, so chords that
                          // have no words of their own do not sit on top of
                          // each other.
                          <span className="chord-spacer" aria-hidden="true">
                            {chordLabel(token.chord)}
                          </span>
                        ) : (
                          <span className="chord-word">{token.word}</span>
                        )}
                      </span>
                    </React.Fragment>
                  )
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
