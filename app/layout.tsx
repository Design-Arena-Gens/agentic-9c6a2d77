import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'आज की Headlines - Today\'s News Video',
  description: 'Get today\'s top news headlines in video format',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body>{children}</body>
    </html>
  );
}
