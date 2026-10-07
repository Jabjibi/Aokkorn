import { Noto_Sans_Thai } from "next/font/google";
import { ExpenseDemoContainer } from "./expense-demo-container";
import { Features } from "./features";
import { Hero } from "./hero";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const landingFont = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: "variable",
  display: "swap",
});

export function LandingPage() {
  return (
    <div className={`landing-page ${landingFont.className}`}>
      <a
        href="#main-content"
        className="sr-only fixed top-3 left-3 z-50 rounded-full bg-white px-5 py-3 text-black focus:not-sr-only"
      >
        ข้ามไปเนื้อหา
      </a>
      <div className="landing-grid relative">
        <SiteHeader />
        <main id="main-content">
          <Hero />
          <Features />
          <ExpenseDemoContainer />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
