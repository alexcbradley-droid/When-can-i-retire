import { ImageResponse } from 'next/og';

// Real, on-brand share image generated at build/request time (not a
// placeholder): brand-green canvas, the logo mark, wordmark and tagline.
export const runtime = 'edge';
export const alt = 'When Can I Retire? — a free UK retirement planner';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0b3d2e',
          color: '#ffffff',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="7" fill="#0f5544" />
            <circle cx="22" cy="10" r="3.6" fill="#f3c577" />
            <path d="M5 25h5v-5h5v-5h5v-5h7" stroke="#7fd1b9" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
            When can I <span style={{ color: '#f3c577' }}>retire?</span>
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1.5, maxWidth: 960 }}>
            Work out when you can afford to retire
          </span>
          <span style={{ fontSize: 30, color: '#cfe0d8', maxWidth: 940, lineHeight: 1.35 }}>
            A free UK retirement planner — pensions, savings, investments and property, with UK tax built in.
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 26, color: '#9fb8ad' }}>whencaniretire.day</span>
          <span style={{ fontSize: 22, color: '#f3c577', fontWeight: 600 }}>Guidance, not advice</span>
        </div>
      </div>
    ),
    size,
  );
}
