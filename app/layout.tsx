import type { Metadata } from 'next';
import { Space_Grotesk, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'JAgencourse — Medlemsområde',
  description: 'Kursinnehåll för JAgencourse-elever.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`${spaceGrotesk.variable} ${instrumentSans.variable} ${ibmPlexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
