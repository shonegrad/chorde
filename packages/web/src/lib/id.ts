/**
 * Generate a unique id.
 *
 * `crypto.randomUUID` is only available in secure contexts, so a Chorde
 * instance served over plain HTTP on a LAN address would throw. This keeps
 * the app usable in that situation.
 */
export const createId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};
