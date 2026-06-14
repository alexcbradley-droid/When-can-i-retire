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
          <svg width="68" height="68" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="15" fill="#0A4B43" />
            <rect x="14" y="16" width="36" height="35" rx="7" fill="#F9F3E3" />
            <path d="M14 25h36" stroke="#7FD9BD" strokeWidth="5" />
            <path d="M23 13v8M41 13v8" stroke="#F4C95D" strokeWidth="4" strokeLinecap="round" />
            <rect x="22" y="33" width="7" height="7" rx="2" fill="#BEDBCC" />
            <rect x="34" y="33" width="8" height="8" rx="2" fill="#F4C95D" />
            <path d="M47 13l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="#FF8A65" />
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
