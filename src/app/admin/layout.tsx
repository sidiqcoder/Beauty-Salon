import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Backoffice & POS Kasir | Aura & Curls Luxury Salon",
  description: "Portal manajemen reservasi jadwal stylist, kasir walk-in POS, dan CRM pelanggan salon kecantikan.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

