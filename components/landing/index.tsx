import { ExpenseDemo } from "./expense-demo";
import { Features } from "./features";
import { Hero } from "./hero";
import { LandingAnimations } from "./landing-animations";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function LandingPage() {
  return (
    <LandingAnimations>
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <ExpenseDemo />
      </main>
      <SiteFooter />
    </LandingAnimations>
  );
}
