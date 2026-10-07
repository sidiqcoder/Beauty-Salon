import React, { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyActionRail from "@/components/layout/StickyActionRail";
import BookingWizard from "@/components/booking/BookingWizard";
import { Sparkles, Calendar, ShieldCheck, Clock, Award } from "lucide-react";

export const metadata = {
  title: "Reservasi Jadwal Online | Aura & Curls Luxury Salon & Spa",
  description:
    "Reservasi jadwal perawatan salon kecantikan dan spa wanita di Jakarta & Tangerang. Pilih cabang Senopati, PIK, atau BSD City secara instan dengan konfirmasi WhatsApp.",
};

export default function BookingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-8 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#85662A] bg-[#C9A96E]/15 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Sistem Reservasi Resmi
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900">
            Reservasi Jadwal Perawatan Anda
          </h1>
          <p className="text-sm text-zinc-600 max-w-lg mx-auto">
            Pilih cabang, layanan favorit, dan waktu yang nyaman. Dapatkan konfirmasi instan langsung ke WhatsApp cabang dalam hitungan menit.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500 pt-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Produk Bebas Racun Kimia
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-[#85662A]" />
              Bisa Bayar di Salon
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-[#C26B83]" />
              Garansi Higienis Terjaga
            </span>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-12 text-center text-zinc-500 shadow-xl border border-[#C9A96E]/20">
              <div className="w-8 h-8 rounded-full border-2 border-[#C9A96E] border-t-transparent animate-spin mx-auto mb-3" />
              Memuat formulir reservasi...
            </div>
          }
        >
          <BookingWizard />
        </Suspense>
      </main>

      <Footer />
      <StickyActionRail />
    </div>
  );
}

