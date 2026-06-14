// Brand mark: "Calendar Spark" — a calendar date with a celebratory retirement
// spark. Inline SVG so it inherits no external assets; the `size` prop drives
// the rendered box (native artwork is a 64×64 grid).

export default function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="15" fill="#0A4B43" />
      <rect x="14" y="16" width="36" height="35" rx="7" fill="#F9F3E3" />
      <path d="M14 25h36" stroke="#7FD9BD" strokeWidth="5" />
      <path d="M23 13v8M41 13v8" stroke="#F4C95D" strokeWidth="4" strokeLinecap="round" />
      <rect x="22" y="33" width="7" height="7" rx="2" fill="#BEDBCC" />
      <rect x="34" y="33" width="8" height="8" rx="2" fill="#F4C95D" />
      <path d="M47 13l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="#FF8A65" />
    </svg>
  );
}
