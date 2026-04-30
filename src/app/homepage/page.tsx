import React from 'react';
import type { Metadata } from 'next';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import HeroScene from './components/HeroScene';
import ScrollSequenceScene from './components/ScrollSequenceScene';
import PhysicalEmotionalEnergeticScene from './components/PhysicalEmotionalEnergeticScene';
import PathwaySliderSection from './components/PathwaySliderSection';
import TransformationAreasScene from './components/TransformationAreasScene';
import AuthorityScene from './components/AuthorityScene';
import EcosystemScene from './components/EcosystemScene';
import ClosingScene from './components/ClosingScene';

export const metadata: Metadata = {
  title: 'VijayHeals — Naturopathy Healing & Transformation Programs',
  description: 'Dr. Vijay Singla guides you through a structured naturopathy healing pathway — from your first free Awareness Session to complete Transformation Mastery. Heal physically, emotionally, and energetically.',
  alternates: {
    canonical: 'https://vijayheals1931.builtwithrocket.new/homepage',
  },
};

export default function HomepagePage() {
  return (
    <main
      style={{ background: '#1A2828' }}
      className="overflow-x-hidden"
    >
      <PublicNav />
      <HeroScene />
      <ScrollSequenceScene />
      <PhysicalEmotionalEnergeticScene />
      <PathwaySliderSection />
      <TransformationAreasScene />
      <AuthorityScene />
      <EcosystemScene />
      <ClosingScene />
      <PublicFooter />
    </main>
  );
}