import React from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import ProgramsHero from './components/ProgramsHero';
import ProgramsJourneyExplainer from './components/ProgramsJourneyExplainer';
import ProgramsCards from './components/ProgramsCards';
import ProgramsFAQ from './components/ProgramsFAQ';

export default function ProgramsOverviewPage() {
  return (
    <main className="bg-[#FAF8F4] min-h-screen">
      <PublicNav />
      <ProgramsHero />
      <ProgramsJourneyExplainer />
      <ProgramsCards />
      <ProgramsFAQ />
      <PublicFooter />
    </main>
  );
}