import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Krona_One } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/lang-context";
import { ThemeProvider } from "@/lib/theme-context";
import Header from "@/components/Header";
import RegisterSW from "@/components/RegisterSW";
import StorageWarning from "@/components/StorageWarning";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const kronaOne = Krona_One({
  variable: "--font-krona-one",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Relevo — Heritage Survey",
  description: "Diagnostic terrain pour le bâti ancien, hors-ligne et open source.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport = {
  themeColor: "#0c0c0b",
};

// Applies the persisted theme class before paint so there is no flash of
// the wrong theme between first paint and ThemeProvider's mount effect.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("relevo-theme");
    var dark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${dmSans.variable} ${kronaOne.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 dark:bg-[#0c0c0b] dark:text-stone-50">
        <ThemeProvider>
          <LangProvider>
            <RegisterSW />
            <Header />
            <StorageWarning />
            <main className="flex-1">{children}</main>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
