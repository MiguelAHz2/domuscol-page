import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteMonitoring } from "@/components/monitoring/site-monitoring";
import { site } from "@/lib/site";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "DomusCol | Administración de propiedad horizontal en Colombia",
    template: "%s | DomusCol",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "propiedad horizontal",
    "administración de conjuntos",
    "software para conjuntos residenciales",
    "Ley 675",
    "cuota de administración",
    "paz y salvo",
    "portería",
    "Colombia",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: site.name,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0D223F" },
    { media: "(prefers-color-scheme: dark)", color: "#050F1D" },
  ],
};

// Runs before paint:
// - applies the saved or system theme without a flash;
// - marks modest devices (<= 4 GB RAM, <= 4 cores or data saver) with
//   html.lite, which drops live blur and the interactive skyline.
const themeScript = `(function(){var h=document.documentElement;try{var t=localStorage.getItem('domuscol-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)h.classList.add('dark');}catch(e){}try{var n=navigator,m=n.deviceMemory,c=n.hardwareConcurrency,s=n.connection&&n.connection.saveData;if((m&&m<=4)||(c&&c<=4)||s)h.classList.add('lite');}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans`}>
        {children}
        <SiteMonitoring />
      </body>
    </html>
  );
}
