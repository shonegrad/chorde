import { describe, it, expect } from 'vitest';
import { describeRunningTime, formatDuration, parseDuration, runningTime } from '../duration';

describe('reading a duration', () => {
  it('reads minutes and seconds', () => {
    expect(parseDuration('4:28')).toBe(268);
    expect(parseDuration('0:30')).toBe(30);
  });

  it('reads hours, minutes and seconds', () => {
    expect(parseDuration('1:04:28')).toBe(3868);
  });

  it('leaves anything it cannot read alone', () => {
    expect(parseDuration('about four minutes')).toBeUndefined();
    expect(parseDuration('4:70')).toBeUndefined();
    expect(parseDuration('4')).toBeUndefined();
    expect(parseDuration('')).toBeUndefined();
    expect(parseDuration(undefined)).toBeUndefined();
  });
});

describe('writing a duration', () => {
  it('writes minutes and seconds', () => {
    expect(formatDuration(268)).toBe('4:28');
    expect(formatDuration(30)).toBe('0:30');
  });

  it('writes hours when there are more than sixty minutes', () => {
    expect(formatDuration(3868)).toBe('1:04:28');
  });
});

describe('how long a set of songs takes', () => {
  it('adds the songs up', () => {
    const time = runningTime(['4:28', '3:32', '5:00']);

    expect(time.seconds).toBe(780);
    expect(time.known).toBe(3);
    expect(time.total).toBe(3);
  });

  it('counts only the songs it can read', () => {
    const time = runningTime(['4:28', undefined, '3:32']);

    expect(time.seconds).toBe(480);
    expect(time.known).toBe(2);
    expect(time.total).toBe(3);
  });

  it('says how much of the set is known', () => {
    expect(describeRunningTime(runningTime(['4:28', '3:32']))).toBe('8:00');
    expect(describeRunningTime(runningTime(['4:28', undefined]))).toBe(
      '4:28 so far — 1 song has no length'
    );
    expect(describeRunningTime(runningTime([undefined]))).toBe(
      'The length of these songs is not known'
    );
    expect(describeRunningTime(runningTime([]))).toBe('No songs yet');
  });
});
