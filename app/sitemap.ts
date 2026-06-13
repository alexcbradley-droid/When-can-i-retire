import type { MetadataRoute } from 'next';

const SITE_URL = 'https://whencaniretire.day';

// Public, indexable routes only. /plans and /admin are intentionally excluded
// (account-private / owner-only).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-06-13');
  const routes: { path: string; priority: number }[] = [
    { path: '/', priority: 1 },
    { path: '/plan', priority: 0.9 },
    { path: '/compare', priority: 0.6 },
    { path: '/help', priority: 0.7 },
    { path: '/methodology', priority: 0.7 },
    { path: '/about', priority: 0.5 },
  ];
  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: 'monthly',
    priority,
  }));
}
