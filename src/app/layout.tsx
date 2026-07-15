import { Plus_Jakarta_Sans } from "next/font/google";
import { Metadata, Viewport } from "next";
import "./tailwind.css";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Pusdatin Kemenag Barito Utara",
    template: "%s | Pusdatin Kemenag Barito Utara",
  },
  description: "Portal Pusat Data dan Informasi Kementerian Agama Kabupaten Barito Utara",
  icons: {
    icon: "/branding/kemenag.svg",
    apple: "/branding/kemenag.svg",
  },
  // Next.js App Router automatically injects the manifest from manifest.ts
  appleWebApp: {
    capable: true,
    title: "Pusdatin Kemenag",
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${jakarta.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
