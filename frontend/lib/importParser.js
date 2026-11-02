import { getYouTubeId } from '@/components/YouTubeEmbed';

export const MAX_ITEMS = 2000;

const FIELD_NAMES = { Q: 'question', A: 'answer', V: 'video' };

export function parseImport(rawText) {
  const text = String(rawText || '').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const blocks = [];
  let current = null;
  let field = null;

  text.split('\n').forEach((line, index) => {
    const header = line.match(/^###\s*(\d+)?\s*(?:\|\s*(.*))?$/);
    if (header) {
      current = {
        line: index + 1,
        number: header[1] ? Number(header[1]) : null,
        categoryName: (header[2] || '').trim(),
        question: '',
        answer: '',
        video: '',
      };
      field = null;
      blocks.push(current);
      return;
    }
    if (!current) return; // anything before the first ### is ignored

    const marker = line.match(/^([QAV]):\s?(.*)$/);
    let value = line;
    if (marker) {
      field = FIELD_NAMES[marker[1]];
      value = marker[2];
    } else if (!field) {
      return;
    }
    current[field] = current[field] ? `${current[field]}\n${value}` : value;
  });

  const items = [];
  const errors = [];
  const seen = new Set();

  for (const b of blocks) {
    const label = `Item at line ${b.line}`;
    const question = b.question.trim();
    const answer = b.answer.trim();
    const video = b.video.trim();

    if (question.length < 5 || question.length > 2000) {
      errors.push(`${label}: the question must be 5 to 2000 characters.`);
      continue;
    }
    if (answer.length > 20000) {
      errors.push(`${label}: the answer is too long.`);
      continue;
    }
    if (video && !getYouTubeId(video)) {
      errors.push(`${label}: the YouTube link is not valid.`);
      continue;
    }
    if (b.number !== null) {
      if (!Number.isSafeInteger(b.number) || b.number < 1 || b.number > 999999999) {
        errors.push(`${label}: the number is not valid.`);
        continue;
      }
      if (seen.has(b.number)) {
        errors.push(`${label}: number ${b.number} appears twice in the file.`);
        continue;
      }
      seen.add(b.number);
    }

    items.push({
      line: b.line,
      number: b.number,
      categoryName: b.categoryName,
      question,
      answer,
      video: video,
    });
  }

  return { items, errors, total: blocks.length };
}