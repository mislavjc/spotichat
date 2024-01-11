import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import PlausibleProvider from 'next-plausible';

import { Toaster } from 'ui/toaster';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spotichat - Chat with your Spotify account',
  description: 'Chat with your Spotify account',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider domain="spotichat.vercel.app" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
