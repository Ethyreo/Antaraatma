import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0e0d0b',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://vijayheals1931.builtwithrocket.new'),
  title: {
    default: 'Antaraatma — Naturopathy Healing & Transformation Programs',
    template: '%s | Antaraatma',
  },
  description: 'Dr. Vijay Singla guides you through a structured naturopathy healing pathway — from your first free Awareness Session to complete Transformation Mastery. Heal physically, emotionally, and energetically.',
  keywords: [
    'naturopathy', 'healing', 'transformation', 'Dr Vijay Singla', 'awareness session',
    'foundation course', 'transformation mastery', 'holistic health', 'energetic healing',
    'emotional healing', 'naturopathic medicine', 'wellness programs', 'Antaraatma',
  ],
  authors: [{ name: 'Dr. Vijay Singla', url: 'https://vijayheals1931.builtwithrocket.new' }],
  creator: 'Dr. Vijay Singla',
  publisher: 'Antaraatma',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://vijayheals1931.builtwithrocket.new',
    siteName: 'Antaraatma',
    title: 'Antaraatma — Naturopathy Healing & Transformation Programs',
    description: 'A guided healing journey from Awareness to Transformation. Join Dr. Vijay Singla\'s naturopathy programs — free Awareness Session available.',
    images: [
      {
        url: '/assets/images/image-1775407640128.png',
        width: 1200,
        height: 630,
        alt: 'Antaraatma — Naturopathy Healing & Transformation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Antaraatma — Naturopathy Healing & Transformation Programs',
    description: 'A guided healing journey from Awareness to Transformation. Join Dr. Vijay Singla\'s naturopathy programs.',
    images: ['/assets/images/image-1775407640128.png'],
  },
  alternates: {
    canonical: 'https://vijayheals1931.builtwithrocket.new',
  },
  icons: {
    icon: [{ url: '/assets/images/WhatsApp_Image_2026-05-02_at_12.27.23_AM-removebg-preview-1777663044774.png', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HealthAndBeautyBusiness',
              name: 'VijayHeals',
              description: 'Naturopathy healing and transformation programs by Dr. Vijay Singla',
              url: 'https://vijayheals1931.builtwithrocket.new',
              founder: {
                '@type': 'Person',
                name: 'Dr. Vijay Singla',
                jobTitle: 'Naturopath & Healing Practitioner',
              },
              offers: [
                {
                  '@type': 'Offer',
                  name: 'Free Awareness Session',
                  description: 'A free live session introducing the root-cause healing framework',
                  price: '0',
                  priceCurrency: 'INR',
                  url: 'https://vijayheals1931.builtwithrocket.new/awareness-session',
                },
                {
                  '@type': 'Offer',
                  name: 'Foundation Course',
                  description: '3-day focused course for physical and energetic reset',
                  price: '999',
                  priceCurrency: 'INR',
                  url: 'https://vijayheals1931.builtwithrocket.new/foundation-course',
                },
                {
                  '@type': 'Offer',
                  name: 'Transformation Mastery',
                  description: '3-month complete healing program — physical, emotional, energetic',
                  url: 'https://vijayheals1931.builtwithrocket.new/transformation-mastery',
                },
              ],
            }),
          }}
        />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fvijayheals1931back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.18" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></head>
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}