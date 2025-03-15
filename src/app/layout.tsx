import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BackgroundStateProvider } from '@/components/background/pixel-art-background-provider';
import { AnimationStateProvider } from '@/components/ui/animation-state-provider';
import BackgroundWrapper from '@/components/background/pixel-art-background-wrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interactive Portfolio",
  description: "A portfolio with interactive bouncing sprites and pixel art aesthetics",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-slate-900 min-h-screen">
        <BackgroundStateProvider>
          <AnimationStateProvider>
            <BackgroundWrapper>
              {children}
            </BackgroundWrapper>
          </AnimationStateProvider>
        </BackgroundStateProvider>
      </body>
    </html>
  );
}
