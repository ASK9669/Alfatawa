export function slugify(text = '') {
  const slug = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/['’`]/g, '')           // remove apostrophes: ba'a becomes baa
    .replace(/[^a-z0-9]+/g, '-')     // everything else becomes a dash
    .replace(/^-+|-+$/g, '')         // trim dashes
    .slice(0, 60);
  return slug || 'fatwa';
}