import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SITE_NAME } from "@/lib/site";
import "./globals.css";

const plex = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export const metadata = {
    metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: "Alfataawaa Afaan Oromoo||Dr Jibriil Qamar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plex.variable} ${plexArabic.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
