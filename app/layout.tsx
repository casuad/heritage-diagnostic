import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/lang-context";
import Header from "@/components/Header";
import RegisterSW from "@/components/RegisterSW";
import StorageWarning from "@/components/StorageWarning";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Relevé Patrimoine — Heritage Survey",
  description: "Diagnostic terrain pour le bâti ancien, hors-ligne et open source.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport = {
  themeColor: "#1c1917",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <LangProvider>
          <RegisterSW />
          <Header />
          <StorageWarning />
          <main className="flex-1">{children}</main>
        </LangProvider>
      </body>
    </html>
  );
}
