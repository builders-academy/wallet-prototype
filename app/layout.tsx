import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Wallet",
  description: "Smart wallet for Bitcoin.",
  openGraph: {
    title: "Smart Wallet",
    description: "Smart wallet for Bitcoin.",
    url: "https://smartwalletai.vercel.app/",
    images: [
      {
        url: "https://smartwalletai.vercel.app/smartwallet.jpg",
        width: 800,
        height: 600,
      },
      {
        url: "https://smartwalletai.vercel.app/smartwallet.jpg",
        width: 1800,
        height: 1600,
        alt: "Smartwallet",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Wallet",
    description: "Smart wallet for Bitcoin.",
    creator: "@biwasbhandari",
    images: ["https://smartwalletai.vercel.app/smartwallet.jpg"], // Must be an absolute URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="h-[100vh] flex items-center justify-center">
          {children}
        </div>
      </body>
    </html>
  );
}
