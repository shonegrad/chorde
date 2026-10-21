import React, { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { notesOfChord, keySignatureName, tabPositionsOfShape } from '../lib/notation';

/**
 * Real notation, drawn by VexFlow.
 *
 * The library is heavy, so it is only fetched when a chord is actually
 * written out, and the music font is kept in the app so it works offline.
 */

export type NotationKind = 'staff' | 'tab';

interface ChordNotationProps {
  kind: NotationKind;
  /** The chord, for example "Bb7". */
  chord: string;
  /** The key of the song, which decides how the notes are spelled. */
  songKey?: string;
  /** The shape of the chord, for the tablature. */
  frets?: (number | 'x')[];
  width?: number;
  height?: number;
}

/** The colours the notation is drawn in, so it follows the theme. */
interface Ink {
  staff: string;
  notes: string;
  text: string;
}

const inkOf = (theme: {
  palette: { text: { primary: string; secondary: string }; divider: string };
}): Ink => ({
  staff: theme.palette.text.secondary,
  notes: theme.palette.text.primary,
  text: theme.palette.text.primary,
});

/**
 * The drawn notation, kept so that a song with forty chords only draws the
 * handful of different ones.
 */
const drawn = new Map<string, SVGElement>();

let vexflow: typeof import('vexflow/core') | null = null;
let loading: Promise<typeof import('vexflow/core')> | null = null;

/**
 * The music font, kept in the app so the notation works offline.
 *
 * It holds only the handful of glyphs a chord needs.
 */
const fontReady = (): Promise<void> => {
  const load = async () => {
    const module = await import('vexflow/core');
    const { Font, VexFlow } = module;
    VexFlow.setFonts('Bravura');
    await Font.load('Bravura', `${import.meta.env.BASE_URL}fonts/Bravura-notation.woff2`, {
      display: 'block',
    });
  };

  return load();
};

const loadVexflow = (): Promise<typeof import('vexflow/core')> => {
  if (vexflow) return Promise.resolve(vexflow);
  if (!loading) {
    loading = Promise.all([import('vexflow/core'), fontReady()]).then(([module]) => {
      vexflow = module;
      return module;
    });
  }
  return loading;
};

/**
 * Draw a chord and return the SVG of it.
 */
const drawNotation = async (
  kind: NotationKind,
  chord: string,
  songKey: string | undefined,
  frets: (number | 'x')[] | undefined,
  width: number,
  height: number,
  ink: Ink
): Promise<SVGElement | null> => {
  const module = await loadVexflow();
  const { Factory, StaveNote, Formatter, Voice, TabNote, Accidental } = module;

  const host = document.createElement('div');
  host.id = `vex-${Math.random().toString(36).slice(2)}`;
  host.style.position = 'absolute';
  host.style.left = '-9999px';
  host.style.top = '0';
  document.body.appendChild(host);

  try {
    const factory = new Factory({
      renderer: { elementId: host.id, width, height },
    });
    const context = factory.getContext();
    context.setFillStyle(ink.notes);
    context.setStrokeStyle(ink.staff);

    if (kind === 'staff') {
      // The stave is no wider than the clef, the key and the chord need, and
      // it is drawn low enough for the stems to have room above it.
      const signature = keySignatureName(songKey);
      const stave = factory.Stave({
        x: 0,
        y: 30,
        width: Math.min(width - 10, 100),
        options: { spaceAboveStaffLn: 0 },
      });
      stave.addClef('treble');
      if (signature) stave.addKeySignature(signature);
      stave.setContext(context).draw();

      const notes = notesOfChord(chord);
      if (notes.length === 0) return null;

      // The notes of a chord are one chord on the stave, not one note after
      // another, so they sit on top of each other with a single stem.
      const voice = new Voice({ numBeats: 4, beatValue: 4 }).setMode(Voice.Mode.SOFT);
      voice.addTickables([new StaveNote({ keys: notes.map((note) => note.key), duration: 'h' })]);

      // The key signature says which sharps and flats are already in the
      // key, so only the notes that differ from it get an accidental.
      Accidental.applyAccidentals([voice], signature ?? 'C');

      new Formatter().joinVoices([voice]).formatToStave([voice], stave);
      voice.draw(context, stave);
    } else {
      const positions = tabPositionsOfShape(frets ?? []);
      const played = positions.filter((position) => !position.muted);
      if (played.length === 0) return null;

      // The shape is one note played on several strings, so the frets are
      // written in a column, the way tablature is written.
      const tab = factory.TabStave({
        x: 22,
        y: 8,
        width: Math.min(width - 32, 78),
        options: { spaceAboveStaffLn: 0 },
      });
      tab.setContext(context).draw();

      const voice = new Voice({ numBeats: 4, beatValue: 4 }).setMode(Voice.Mode.SOFT);
      voice.addTickables([
        new TabNote({
          positions: positions.map((position) => ({
            str: position.str,
            fret: position.muted ? 'X' : position.fret,
          })),
          duration: 'h',
        }),
      ]);
      new Formatter().joinVoices([voice]).formatToStave([voice], tab);
      voice.draw(context, tab);

      // The fret the shape starts at, so it is clear where on the neck it is.
      const first = played.reduce((lowest, position) => Math.min(lowest, position.fret), 99);
      if (first > 0) {
        context.setFont('Arial', 9);
        context.setFillStyle(ink.text);
        context.fillText(`${first}fr`, 0, tab.getYForLine(0) - 4);
      }
    }

    const svg = host.querySelector('svg');
    if (!svg) return null;

    // A copy is kept, so the same drawing can be shown in more than one place.
    const copy = svg.cloneNode(true) as SVGElement;
    copy.removeAttribute('style');
    return copy;
  } catch {
    return null;
  } finally {
    host.remove();
  }
};

export const ChordNotation: React.FC<ChordNotationProps> = ({
  kind,
  chord,
  songKey,
  frets,
  width = 160,
  height = 100,
}) => {
  const theme = useTheme();
  const ink = inkOf(theme);
  const id = useId();
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  const key = `${kind}|${chord}|${songKey ?? ''}|${(frets ?? []).join(',')}|${width}|${height}|${
    ink.notes
  }|${ink.staff}`;

  useEffect(() => {
    let cancelled = false;

    const paint = async () => {
      const cached = drawn.get(key);
      if (cached) {
        hostRef.current?.replaceChildren(cached.cloneNode(true));
        return;
      }

      const svg = await drawNotation(kind, chord, songKey, frets, width, height, ink);
      if (cancelled) return;

      if (!svg) {
        setFailed(true);
        return;
      }

      drawn.set(key, svg);
      hostRef.current?.replaceChildren(svg.cloneNode(true));
    };

    void paint();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (failed) return null;

  return (
    <div
      id={id}
      ref={hostRef}
      role="img"
      aria-label={kind === 'staff' ? `${chord} on the stave` : `${chord} in tablature`}
      style={{ width, height, lineHeight: 0 }}
    />
  );
};
