/**
 * How long a song is.
 *
 * A duration is written as minutes and seconds, "4:28", or as hours, minutes
 * and seconds, "1:04:28". Anything else is a time we cannot add up, and is
 * left alone rather than guessed at.
 */

/**
 * How many seconds a duration is.
 *
 * Returns nothing if the duration is not a time we understand.
 */
export const parseDuration = (value?: string): number | undefined => {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (!/^\d{1,2}(:\d{1,2}){1,2}$/.test(trimmed)) return undefined;

  const parts = trimmed.split(':').map(Number);
  if (parts.some((part) => Number.isNaN(part))) return undefined;

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    if (seconds >= 60) return undefined;
    return minutes * 60 + seconds;
  }

  const [hours, minutes, seconds] = parts;
  if (minutes >= 60 || seconds >= 60) return undefined;
  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * How long a number of seconds is, the way a duration is written.
 */
export const formatDuration = (seconds: number): string => {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = total % 60;

  const pad = (value: number) => String(value).padStart(2, '0');

  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(rest)}`;
  return `${minutes}:${pad(rest)}`;
};

export interface RunningTime {
  /** How long the songs add up to, in seconds. */
  seconds: number;
  /** How many of the songs have a duration we could read. */
  known: number;
  /** How many of the songs there are. */
  total: number;
}

/**
 * How long a set of songs takes.
 *
 * Only the songs with a duration we can read are counted, and the number of
 * them is kept, so a set can say how much of it is known.
 */
export const runningTime = (durations: (string | undefined)[]): RunningTime => {
  let seconds = 0;
  let known = 0;

  durations.forEach((duration) => {
    const parsed = parseDuration(duration);
    if (parsed === undefined) return;
    seconds += parsed;
    known += 1;
  });

  return { seconds, known, total: durations.length };
};

/**
 * How long a set of songs takes, in words.
 *
 * A set that is not fully timed says so, rather than pretending to know.
 */
export const describeRunningTime = (time: RunningTime): string => {
  if (time.total === 0) return 'No songs yet';
  if (time.known === 0) return 'The length of these songs is not known';

  const length = formatDuration(time.seconds);
  if (time.known < time.total) {
    const missing = time.total - time.known;
    return `${length} so far — ${missing} ${missing === 1 ? 'song has' : 'songs have'} no length`;
  }

  return length;
};
