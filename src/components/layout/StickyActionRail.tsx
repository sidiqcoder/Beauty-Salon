"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Phone, MessageCircle } from "lucide-react";

export default function StickyActionRail() {
  const defaultWhatsAppNumber = "628118899011"; // Senopati

  return (
    <>
      {/* Desktop Sticky Right Rail */}
      <aside 
        aria-label="Aksi Cepat" 
        className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col gap-3"
      >
        <Link
          href="/booking"
          title="Reservasi Jadwal"
          className="w-14 h-14 rounded-full gold-gradient text-white flex flex-col items-center justify-center shadow-lg shadow-[#85662A]/30 hover:scale-110 active:scale-95 transition-all group"
        >
          <Calendar className="w-5 h-5 mb-0.5 group-hover:rotate-12 transition-transform" />
          <span className="text-[9px] font-bold tracking-wider uppercase">Book</span>
        </Link>

        <a
          href={`https://wa.me/${defaultWhatsAppNumber}?text=${encodeURIComponent(
            "Halo Aura & Curls, saya ingin bertanya tentang layanan salon."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Chat WhatsApp"
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex flex-col items-center justify-center shadow-lg shadow-emerald-700/30 hover:scale-110 active:scale-95 transition-all group"
        >
          <MessageCircle className="w-5 h-5 mb-0.5 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-bold tracking-wider uppercase">Chat</span>
        </a>

        <a
          href="tel:+62217208899"
          title="Hubungi Kami"
          className="w-14 h-14 rounded-full bg-[#C26B83] hover:bg-[#D66C86] text-white flex flex-col items-center justify-center shadow-lg shadow-[#C26B83]/30 hover:scale-110 active:scale-95 transition-all group"
        >
          <Phone className="w-5 h-5 mb-0.5 group-hover:-rotate-12 transition-transform" />
          <span className="text-[9px] font-bold tracking-wider uppercase">Call</span>
        </a>
      </aside>

      {/* Mobile Fixed Bottom Tab Bar */}
      <nav 
        aria-label="Mobile Navigation Bar" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#C9A96E]/20 shadow-2xl grid grid-cols-3 h-16 pb-[env(safe-area-inset-bottom)]"
      >
        <a
          href="tel:+62217208899"
          className="flex flex-col items-center justify-center gap-1 text-zinc-700 hover:text-[#C26B83] active:bg-zinc-100 transition"
        >
          <Phone className="w-5 h-5 text-[#C26B83]" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Telepon</span>
        </a>

        <a
          href={`https://wa.me/${defaultWhatsAppNumber}?text=${encodeURIComponent(
            "Halo Aura & Curls, saya ingin konsultasi janji temu."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 bg-emerald-600 text-white active:bg-emerald-700 transition"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp</span>
        </a>

        <Link
          href="/booking"
          className="flex flex-col items-center justify-center gap-1 gold-gradient text-white active:opacity-90 transition"
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Booking</span>
        </Link>
      </nav>
    </>
  );
}

