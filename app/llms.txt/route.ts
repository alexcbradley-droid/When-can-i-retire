// Plain-text summary for LLMs / answer engines, served at /llms.txt.

const SITE_URL = 'https://whencaniretire.day';

const BODY = `# When Can I Retire?

> When Can I Retire? is a free UK retirement planner that projects your pensions
> (State, workplace, final-salary), savings, investments and property month by
> month with UK tax built in, finds your earliest retirement date and the
> income your plan can sustain, and stress-tests it with Monte Carlo simulation.
> The projection engine runs entirely in the browser. Guidance only — not
> financial advice. Tax figures current for 2026/27 (England, Wales & NI).

## Key pages
- Planner: ${SITE_URL}/plan — enter details or upload a spreadsheet; see your earliest retirement date and sustainable income.
- Compare: ${SITE_URL}/compare — compare saved plans side by side.
- Help: ${SITE_URL}/help — what information you need and where to find it.
- Methodology: ${SITE_URL}/methodology — every assumption, tax rule and source, with 2026/27 figures.
- About: ${SITE_URL}/about — what the tool does and how it was built.

## Notes
- Free to use, no sign-up required; optional Google sign-in saves plans across devices.
- Covers income tax, National Insurance, the 25% tax-free lump sum, capital gains, Section 24 rental rules and an inheritance tax estimate for 2026/27.
- Not financial advice; for personal decisions consult a regulated adviser (MoneyHelper) or, if 50+, Pension Wise.
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
