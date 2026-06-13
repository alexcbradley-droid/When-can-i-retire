import Link from 'next/link';

const features = [
  {
    title: 'Forwards and backwards',
    body: 'Pick a target retirement date and see whether it is funded — or let the planner find the earliest date your money supports.',
  },
  {
    title: 'Everything in one model',
    body: 'State Pension, workplace and personal pensions, final-salary schemes, ISAs, savings, shares, ETFs, crypto, rental property and your home — projected month by month to age 95+.',
  },
  {
    title: 'UK tax built in',
    body: 'Income tax bands, the 25% tax-free lump sum, National Insurance, capital gains, Section 24 rules on rental income and an inheritance tax estimate — using verified 2026/27 figures.',
  },
  {
    title: 'Risks, not just averages',
    body: 'Monte Carlo simulation, a market-crash stress test, higher-inflation and live-to-100 cases, and sensitivity analysis on every key assumption.',
  },
  {
    title: 'Scenarios and reports',
    body: 'Save unlimited scenarios, compare them side by side, then print a clean report to share or file.',
  },
  {
    title: 'Smart spreadsheet upload',
    body: 'Already track your finances in Excel? Upload it — AI reads any layout, maps what it finds and asks about the gaps.',
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero container">
        <h1>Work out when you can afford to retire</h1>
        <p className="lead">
          <b>When Can I Retire?</b> is a free UK retirement planner that projects your pensions, savings,
          investments and property — with UK tax built in — to find your earliest retirement date, the
          income your plan can sustain, and how it holds up under stress. Enter your details or upload a
          spreadsheet to begin.
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Link href="/plan" className="btn cta">Start planning — free, no sign-up</Link>
          <Link href="/plan?demo=1" className="btn">Try the sample household</Link>
        </div>
        <p className="small muted" style={{ marginTop: 12 }}>
          No sign-up. Your data never leaves your browser unless you use the AI features.
        </p>
      </section>

      <section className="container">
        <div className="feature-grid">
          {features.map((f) => (
            <div className="card" key={f.title}>
              <h3>{f.title}</h3>
              <p className="small muted" style={{ marginBottom: 0 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section-gap">
        <div className="card">
          <h2>How it works</h2>
          <ol className="small" style={{ lineHeight: 2 }}>
            <li><b>Tell us about your household</b> — ages, income, pensions, savings, property. A guided setup takes about five minutes, or upload a spreadsheet and let the AI map it.</li>
            <li><b>See your projection</b> — month-by-month income, spending, tax and net worth from now to age 95, with your State Pension age and tax-free lump sum handled automatically.</li>
            <li><b>Test and compare</b> — duplicate your plan, retire earlier, sell a property, spend more in the early years; compare scenarios side by side and print the result.</li>
          </ol>
          <p className="small muted" style={{ marginBottom: 0 }}>
            Everything is guidance, not advice — see the <Link href="/methodology">methodology page</Link> for
            every assumption, source and known simplification.
          </p>
          <p className="small muted" style={{ marginBottom: 0, marginTop: 10 }}>
            Tax figures current for the 2026/27 UK tax year (England, Wales &amp; Northern Ireland) ·
            last reviewed 13 June 2026.
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        // Accurate structured data: a free finance web application.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'When Can I Retire?',
            url: 'https://whencaniretire.day',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web browser',
            description:
              'A free UK retirement planner that projects pensions, savings, investments and property with UK tax built in, finds your earliest retirement date and sustainable income, and stress-tests the plan with Monte Carlo simulation.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
            inLanguage: 'en-GB',
            isAccessibleForFree: true,
          }),
        }}
      />
    </main>
  );
}
