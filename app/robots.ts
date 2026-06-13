import type { MetadataRoute } from 'next';

const SITE_URL = 'https://whencaniretire.day';

// Allow standard crawlers and the major AI/answer-engine crawlers explicitly;
// keep owner/user-private routes out of the index.
export default function robots(): MetadataRoute.Robots {
  const allowAiBots = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot'];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/plans'] },
      ...allowAiBots.map((userAgent) => ({ userAgent, allow: '/', disallow: ['/admin', '/plans'] })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
