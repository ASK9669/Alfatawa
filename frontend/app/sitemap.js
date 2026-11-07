import { connection } from 'next/server';
import { connectDB } from '@/lib/db';
import Fatwa from '@/models/Fatwa';
import Program from '@/models/Program';
import Episode from '@/models/Episode';

const SITE = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export default async function sitemap() {
  await connection();
  await connectDB();

  const fatwas = await Fatwa.find({ status: 'Published' }).select('slug updatedAt').lean();
  const programs = await Program.find({ visible: true }).select('slug updatedAt').lean();
  const episodes = await Episode.find({ visible: true })
    .populate('program', 'slug visible')
    .select('number updatedAt program')
    .lean();

  const pages = ['', '/fatwas', '/about', '/ask', '/youtube'].map((path) => ({
    url: `${SITE}${path}`,
  }));

  return [
    ...pages,
    ...fatwas
      .filter((f) => f.slug)
      .map((f) => ({ url: `${SITE}/fatwas/${f.slug}`, lastModified: f.updatedAt })),
    ...programs.map((p) => ({ url: `${SITE}/youtube/${p.slug}`, lastModified: p.updatedAt })),
    ...episodes
      .filter((e) => e.program && e.program.visible)
      .map((e) => ({
        url: `${SITE}/youtube/${e.program.slug}/${e.number}`,
        lastModified: e.updatedAt,
      })),
  ];
}