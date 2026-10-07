import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#121214",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://beauty-salon-three-silk.vercel.app"),
  title: {
    default: "Aura & Curls | Luxury Beauty Salon, Spa & Hair Studio Jakarta",
    template: "%s | Aura & Curls Luxury Salon",
  },
  description:
    "Salon kecantikan premium & spa modern di Senopati, PIK, dan BSD City. Reservasi online 24/7 layanan balayage, keratin smoothing, hydrafacial, nail art, dan private bridal spa dengan terapis bersertifikat.",
  keywords: [
    "salon kecantikan jakarta",
    "salon senopati",
    "salon pik",
    "salon bsd",
    "hair treatment jakarta",
    "balayage jakarta",
    "keratin treatment",
    "hydrafacial jakarta",
    "bridal spa jakarta",
    "nail art jakarta",
    "aura and curls",
    "blush and curls indonesia",
  ],
  authors: [{ name: "Aura & Curls Beauty Group" }],
  creator: "Aura & Curls",
  publisher: "Aura & Curls",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Aura & Curls | Luxury Beauty Salon, Spa & Hair Studio Jakarta",
    description:
      "Pengalaman perawatan kecantikan privat & eksklusif di Senopati, PIK, dan BSD City. Booking mudah via online & WhatsApp instan.",
    url: "https://beauty-salon-three-silk.vercel.app",
    siteName: "Aura & Curls Luxury Salon",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura & Curls | Luxury Beauty Salon & Spa",
    description:
      "Perawatan rambut & spa premium di Jakarta. Booking instan dengan konfirmasi WhatsApp langsung.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
