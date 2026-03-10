import { Toaster } from "sonner";
import Script from 'next/script'

import "../globals.css";
import AuthProvider from "@/components/layouts/ProviderLayouts";

export const metadata = {
  applicationName: "LowStack",
  title: "LowStack: Stack For Students",
  description:
    "Lowstack is a stack for students providing rich notes, pyqs, syllabus from various university accross the country.",
  generator: "Next.js",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LowStack",
    // startUpImage: [],
  },
  keywords: [
    "rgpv notes",
    "lowstack",
    "rgpv notes lowstack",
    "aktu notes lowstack",
    "aktu notes",
    "exam notes engineering",
    "rgpv notes download",
    "btech rgpv notes",
    "btech cse notes",
    "rgpv",
    "rgpv official notes",
    "rgpv pyq btech",
    "lowstack.in",
    "lowstack notes",
    "study material ",
    "LowStack",
  ],
  authors: [
    { name: "Kunwar Shashank Mishra" },
    {
      name: "Kunwar Shashank Mishra",
      url: "https://www.linkedin.com/in/kunwarxshashank",
    },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "/favicon/apple-touch-icon.png" },
    { rel: "icon", url: "/favicon/apple-touch-icon.png" },
  ],
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#13131a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              const key = 'notstack.theme';
              const stored = localStorage.getItem(key);
              const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
              const theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
              document.documentElement.setAttribute('data-theme', theme);
            } catch (e) {}
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-base-100 text-base-content transition-colors duration-300">
        <Script defer src='https://cloud.umami.is/script.js' data-website-id='185225b6-6381-46c7-8afd-a753b57db4a4' />
        <AuthProvider>
          <Toaster richColors closeButton position="top-center" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
