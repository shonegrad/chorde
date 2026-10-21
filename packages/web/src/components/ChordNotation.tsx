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
  /** The chords to write out, in the order they are played. */
  chords: string[];
  /** The shape of each chord, for the tablature. */
  shapes?: (number | 'x')[][];
  /** The key of the song, which decides how the notes are spelled. */
  songKey?: string;
  /** Whether to draw the clef and the key signature. */
  showKey?: boolean;
  width?: number;
  height?: number;
  /** The colour behind the writing, so the gaps in the lines are not white. */
  background?: string;
  /** How much bigger to draw it than it is. */
  scale?: number;
}

/** The colours the notation is drawn in, so it follows the theme. */
interface Ink {
  staff: string;
  notes: string;
  text: string;
}

const inkOf = (theme: { palette: { text: { primary: string; secondary: string } } }): Ink => ({
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
 * Break the strings of a tablature around the numbers.
 *
 * VexFlow hides the string under each number with a rectangle in the colour
 * of the page. The rectangle does its job, but it is still a shape on the
 * page, and it shows up wherever the page is not the colour it was drawn for.
 * The string is broken around the number instead, which looks the same and
 * leaves nothing behind.
 */
const breakTheStrings = (svg: SVGElement): void => {
  const masks = [...svg.querySelectorAll('.vf-tabnote rect')].map((rect) => ({
    x: Number(rect.getAttribute('x')),
    y: Number(rect.getAttribute('y')),
    width: Number(rect.getAttribute('width')),
    height: Number(rect.getAttribute('height')),
  }));

  svg.querySelectorAll('.vf-stave path').forEach((path) => {
    const line = path.getAttribute('d')?.match(/^M([\d.-]+) ([\d.-]+)L([\d.-]+) ([\d.-]+)$/);
    if (!line) return;

    const [, start, y, end] = line.map(Number);
    const gaps = masks
      .filter((mask) => Math.abs(mask.y + mask.height / 2 - y) < 1)
      .map((mask) => [mask.x + 1, mask.x + mask.width - 1] as [number, number])
      .sort((a, b) => a[0] - b[0]);

    // Each piece of the string is a path of its own, with the numbers
    // taken out of it.
    let d = '';
    let cursor = start;
    for (const [from, to] of gaps) {
      if (from > cursor) d += `M${cursor} ${y}L${from} ${y}`;
      cursor = Math.max(cursor, to);
    }
    if (cursor < end) d += `M${cursor} ${y}L${end} ${y}`;

    path.setAttribute('d', d);
  });

  svg.querySelectorAll('.vf-tabnote rect').forEach((rect) => rect.remove());
};

/**
 * Draw the chords and return the SVG of them.
 */
const drawNotation = async (
  kind: NotationKind,
  chords: string[],
  shapes: (number | 'x')[][],
  songKey: string | undefined,
  showKey: boolean,
  width: number,
  height: number,
  ink: Ink,
  background: string
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
      renderer: { elementId: host.id, width, height, background },
    });
    const context = factory.getContext();
    context.setFillStyle(ink.notes);
    context.setStrokeStyle(ink.staff);

    const signature = keySignatureName(songKey);

    if (kind === 'staff') {
      // The stave is drawn low enough for the stems to have room above it.
      const stave = factory.Stave({
        x: 0,
        y: 30,
        width,
        options: { spaceAboveStaffLn: 0 },
      });

      if (showKey) {
        stave.addClef('treble');
        if (signature) stave.addKeySignature(signature);
      }

      stave.setContext(context).draw();

      const notes = chords
        .map((chord) => notesOfChord(chord))
        .filter((chordNotes) => chordNotes.length > 0);
      if (notes.length === 0) return null;

      // The notes of a chord are one chord on the stave, not one note after
      // another, so they sit on top of each other with a single stem.
      const voice = new Voice({ numBeats: notes.length * 2, beatValue: 4 }).setMode(
        Voice.Mode.SOFT
      );
      voice.addTickables(
        notes.map(
          (chordNotes) => new StaveNote({ keys: chordNotes.map((n) => n.key), duration: 'h' })
        )
      );

      // The key signature says which sharps and flats are already in the
      // key, so only the notes that differ from it get an accidental.
      Accidental.applyAccidentals([voice], signature ?? 'C');

      new Formatter().joinVoices([voice]).formatToStave([voice], stave);
      voice.draw(context, stave);
    } else {
      const positions = shapes.map((frets) => tabPositionsOfShape(frets));
      if (positions.every((shape) => shape.every((position) => position.muted))) return null;

      // The fret the shape starts at, so it is clear where on the neck it is.
      const firstFret = positions
        .flat()
        .filter((position) => !position.muted)
        .reduce((lowest, position) => Math.min(lowest, position.fret), 99);

      // The fret the shape starts at only takes room when there is one.
      const fretSpace = firstFret > 0 ? 22 : 2;
      const tab = factory.TabStave({
        x: fretSpace,
        y: 8,
        width: width - fretSpace,
        options: { spaceAboveStaffLn: 0 },
      });
      tab.setContext(context).draw();

      // Each shape is one note played on several strings, so the frets are
      // written in a column, the way tablature is written.
      const voice = new Voice({ numBeats: positions.length * 2, beatValue: 4 }).setMode(
        Voice.Mode.SOFT
      );
      voice.addTickables(
        positions.map(
          (shape) =>
            new TabNote({
              positions: shape.map((position) => ({
                str: position.str,
                fret: position.muted ? 'X' : position.fret,
              })),
              duration: 'h',
            })
        )
      );

      new Formatter().joinVoices([voice]).formatToStave([voice], tab);
      voice.draw(context, tab);

      if (firstFret > 0) {
        context.setFont('Arial', 9);
        context.setFillStyle(ink.text);
        context.fillText(`${firstFret}fr`, 0, tab.getYForLine(0) - 4);
      }
    }

    const svg = host.querySelector('svg');
    if (!svg) return null;

    /*
     * The numbers in a tablature are written over the strings, so VexFlow
     * hides the string under each one with a rectangle in the colour of the
     * page. The rectangle does its job, but it is still a shape on the page,
     * and it shows up wherever the page is not the colour it was drawn for.
     * The number is given a halo instead, which breaks the string in the
     * same way without leaving anything behind.
     */
    if (kind === 'tab') breakTheStrings(svg);

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
  chords,
  shapes = [],
  songKey,
  showKey = true,
  width = 160,
  height = 100,
  background,
  scale = 1,
}) => {
  const theme = useTheme();
  const ink = inkOf(theme);
  const id = useId();
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  const paper = background ?? theme.palette.background.default;
  const shapeKey = shapes.map((shape) => shape.join(',')).join('|');
  const key = `${kind}|${chords.join(',')}|${shapeKey}|${songKey ?? ''}|${showKey}|${width}|${height}|${
    ink.notes
  }|${ink.staff}|${paper}`;

  useEffect(() => {
    let cancelled = false;

    const paint = async () => {
      const cached = drawn.get(key);
      if (cached) {
        hostRef.current?.replaceChildren(cached.cloneNode(true));
        return;
      }

      const svg = await drawNotation(
        kind,
        chords,
        shapes,
        songKey,
        showKey,
        width,
        height,
        ink,
        paper
      );
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
      role="img"
      aria-label={
        kind === 'staff' ? `${chords.join(', ')} on the stave` : `${chords.join(', ')} in tablature`
      }
      style={{ width: width * scale, height: height * scale, lineHeight: 0 }}
    >
      <div ref={hostRef} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }} />
    </div>
  );
};
