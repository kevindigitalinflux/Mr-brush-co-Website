import { Navigation } from './components/Navigation'
import { CleaningProgressIndicator } from './components/CleaningProgressIndicator'
import { SectionRevealEffect } from './components/SectionRevealEffect'
import { SectionCleanEffect } from './components/SectionCleanEffect'
import { Hero } from './components/Hero'
import { Problem } from './components/Problem'
import { HowItWorks } from './components/HowItWorks'
import { Services } from './components/Services'
import { MrBrushDifference } from './components/MrBrushDifference'
import { Ratings } from './components/Ratings'
import { TrustSignals } from './components/TrustSignals'
import { GetAQuote } from './components/GetAQuote'
import { Footer } from './components/Footer'

/** Root application component — composes all page sections in order */
export function App() {
  return (
    <>
      <Navigation />
      <CleaningProgressIndicator />
      <SectionRevealEffect />
      <SectionCleanEffect />
      <Hero />
      <Problem />
      <HowItWorks />
      <Services />
      <MrBrushDifference />
      <Ratings />
      <TrustSignals />
      <GetAQuote />
      <Footer />
    </>
  )
}
