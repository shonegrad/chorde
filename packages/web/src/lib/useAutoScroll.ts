import { useEffect, useRef, type RefObject } from 'react';

export interface AutoScrollOptions {
  /** Whether the song is scrolling. */
  enabled: boolean;
  /** How fast to scroll, in pixels a second. */
  speed: number;
  /** The element of each line of the song, by index. */
  linesRef?: RefObject<(HTMLElement | null)[]>;
  /** The line each section starts at, used when looping a section. */
  sectionStarts?: number[];
  /** The section to loop, or null to scroll straight through. */
  loopSection?: number | null;
  /** How many lines the song has. */
  totalLines?: number;
  /** Called when the end of the song is reached. */
  onReachEnd?: () => void;
  /** Called when the looped section has been played out. */
  onLoop?: (sectionIndex: number) => void;
}

/**
 * Scrolls a song at a steady pace.
 *
 * The speed is kept in a ref so that changing it does not restart the scroll,
 * and the leftover of a partial pixel is carried over so the pace stays even
 * however slow the speed is.
 */
export const useAutoScroll = ({
  enabled,
  speed,
  linesRef,
  sectionStarts = [],
  loopSection = null,
  totalLines = 0,
  onReachEnd,
  onLoop,
}: AutoScrollOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(speed);
  const onReachEndRef = useRef(onReachEnd);
  const onLoopRef = useRef(onLoop);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    onReachEndRef.current = onReachEnd;
  }, [onReachEnd]);

  useEffect(() => {
    onLoopRef.current = onLoop;
  }, [onLoop]);

  useEffect(() => {
    if (!enabled || !containerRef.current) {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      return;
    }

    let last = Date.now();
    let accumulator = 0;

    const step = () => {
      const container = containerRef.current;
      if (!container) return;

      const now = Date.now();
      const elapsed = (now - last) / 1000;
      last = now;

      // Carry the fraction over so a slow speed still moves smoothly.
      accumulator += speedRef.current * elapsed;
      const pixels = Math.floor(accumulator);
      if (pixels > 0) {
        container.scrollTop += pixels;
        accumulator -= pixels;
      }

      const lines = linesRef?.current ?? [];

      // Loop back to the start of the section when it has been played out.
      if (loopSection !== null && sectionStarts.length > 0) {
        const start = sectionStarts[loopSection];
        const end = sectionStarts[loopSection + 1] ?? totalLines;
        const sectionEnd = lines[end - 1];

        if (sectionEnd) {
          const containerTop = container.getBoundingClientRect().top;
          if (sectionEnd.getBoundingClientRect().bottom <= containerTop + 100) {
            lines[start]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            onLoopRef.current?.(loopSection);
            return;
          }
        }
      }

      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        onReachEndRef.current?.();
        return;
      }

      frameRef.current = requestAnimationFrame(step);
    };

    last = Date.now();
    accumulator = 0;
    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [enabled, loopSection, sectionStarts, totalLines, linesRef]);

  return containerRef;
};
