export const MAX_SECONDS = 120; // longest recording
export const MAX_BYTES = 2 * 1024 * 1024; // largest file accepted (2 MB)
export const RETENTION_DAYS = 60; // days kept after the question is answered or rejected
export const MAX_TOTAL_BYTES = 300 * 1024 * 1024; // stop accepting recordings at this total
export const MAX_PER_DAY = 200; // recordings accepted per day, all visitors together

// Reads the first bytes of the file, so a wrong label from the browser cannot fool us.
export function sniffAudio(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return 'audio/webm';
  if (buf.subarray(0, 4).toString('latin1') === 'OggS') return 'audio/ogg';
  if (buf.subarray(4, 8).toString('latin1') === 'ftyp') return 'audio/mp4';
  if (buf.subarray(0, 3).toString('latin1') === 'ID3' || (buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0)) {
    return 'audio/mpeg';
  }
  return null;
}