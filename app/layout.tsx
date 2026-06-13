import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import HeaderAuth from '@/components/HeaderAuth';
import Providers from '@/components/Providers';
import LogoMark from '@/components/Logo';
import CookieConsent from '@/components/CookieConsent';
import './globals.css';

const SITE_URL = 'https://whencaniretire.day';
const DESCRIPTION =
  'A free UK retirement calculator: project your pensions, savings, investments and property; find your earliest retirement date; compare scenarios; stress-test your plan.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'When Can I Retire? — UK retirement planner',
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  applicationName: 'When Can I Retire?',
  openGraph: {
    type: 'website',
    siteName: 'When Can I Retire?',
    locale: 'en_GB',
    url: '/',
    title: 'When Can I Retire? — UK retirement planner',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'When Can I Retire? — UK retirement planner',
    description: DESCRIPTION,
  },
};

// Analytics runs only on the production deployment, so local dev and Vercel
// preview builds never send traffic.
const ANALYTICS_ON = process.env.VERCEL_ENV === 'production';
const GA_ID = 'G-QM4TF66QYS';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        {ANALYTICS_ON && (
          <>
            {/* Google Consent Mode v2: set defaults to denied BEFORE the GA
                library loads, so no analytics cookies are set until consent.
                Returning visitors who already accepted are upgraded here. */}
            <Script id="ga-consent-default" strategy="beforeInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('consent', 'default', {
                  ad_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied',
                  analytics_storage: 'denied'
                });
                try {
                  if (localStorage.getItem('wcir-cookie-consent-v1') === 'granted') {
                    gtag('consent', 'update', { analytics_storage: 'granted' });
                  }
                } catch (e) {}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');`}
            </Script>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          </>
        )}
        <Providers>
          <header className="site-header no-print">
            <div className="container">
              <Link href="/" className="brand">
                <LogoMark />
                When can I <span>retire?</span>
              </Link>
              <nav className="main-nav">
                <Link href="/plan">Planner</Link>
                <Link href="/plans">My plans</Link>
                <Link href="/compare">Compare</Link>
                <Link href="/help">Help</Link>
                <Link href="/methodology">Methodology</Link>
                <Link href="/about">About</Link>
              </nav>
              <HeaderAuth />
            </div>
          </header>
          {children}
          <footer className="site-footer no-print">
            <div className="container">
              <p>
                <b>This tool provides information and guidance only — it is not financial advice.</b> If you are
                unsure about retirement decisions, speak to a regulated financial adviser (find one via{' '}
                <a href="https://www.moneyhelper.org.uk/en/getting-help-and-advice/financial-advisers" rel="noopener noreferrer" target="_blank">MoneyHelper</a>).
                If you are 50 or over, <a href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise" rel="noopener noreferrer" target="_blank">Pension Wise</a>{' '}
                offers free, impartial pension guidance backed by government.
              </p>
              <p>
                Projections are estimates, not guarantees: they depend on assumptions about growth, inflation,
                charges and tax that may not be borne out, and on the accuracy of the information you enter.
                The value of investments can go down as well as up and you may get back less than you invest.
                Tax treatment depends on individual circumstances and rules may change. Calculations use
                England, Wales &amp; Northern Ireland tax bands for 2026/27 — Scottish income tax differs.
                Past performance is not a reliable indicator of future results.
              </p>
              <p>
                Your data stays in your browser by default. If you sign up / in with Google, your
                scenarios are saved to your account so you can pick them up on any device. If you use the
                AI features (chat assistant or spreadsheet upload), the plan or file content you provide is
                sent to our AI provider (Anthropic) solely to answer your request and is not used to train
                models — avoid including names, addresses or account numbers you would not want processed.
              </p>
              <p>
                We use privacy-conscious analytics (Microsoft Clarity and Google Analytics) to understand how
                the site is used and improve it. They set cookies only if you accept — until then Google
                Analytics runs without cookies (Consent Mode), and Microsoft Clarity does not run at all.
                No data is sold, ever.
              </p>
              <div className="footer-crosssell">
                <h2>More from this maker</h2>
                <ul>
                  <li>
                    <a href="https://truebricks.online" target="_blank" rel="noopener noreferrer">True Bricks</a>{' '}
                    — work out the true total cost of owning any UK home: mortgage, energy, maintenance, risk and area data.
                  </li>
                  <li>
                    <a href="https://aidailysignal.app" target="_blank" rel="noopener noreferrer">The AI Daily Signal</a>{' '}
                    — one daily brief on everything that mattered in artificial intelligence, in plain English.
                  </li>
                </ul>
              </div>
            </div>
          </footer>
          <CookieConsent enabled={ANALYTICS_ON} clarityId="x6cmyc53rf" />
        </Providers>
      </body>
    </html>
  );
}
