const SITE = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }],
    sitemap: `${SITE}/sitemap.xml`,
  };
}