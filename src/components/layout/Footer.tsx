import React from "react";
import Link from "next/link";
import { Sparkles, MapPin, Phone, Clock, Heart, Globe, Share2 } from "lucide-react";
import { BRANCHES } from "@/data/salon-data";

export default function Footer() {
  return (
    <footer className="bg-[#121214] text-zinc-300 pt-16 pb-24 border-t border-[#2A2A2E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="font-serif text-2xl font-bold text-white tracking-wide">
                <span>AURA </span>
                <span className="text-[#C9A96E]">&amp;</span>
                <span className="text-[#E88A9F]"> CURLS</span>
              </div>
            </div>
            <p className="text-xs text-[#C9A96E] uppercase tracking-widest font-semibold mb-3">
              100% Chemical-Free &amp; Organic Salon
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              Salon kecantikan wanita eksklusif di Jakarta &amp; Tangerang yang memadukan kemewahan perawatan rambut, kuku, wajah, dan spa dengan formula organik alami tanpa bahan kimia berbahaya.
            </p>
            <div className="flex items-center gap-4 text-zinc-400">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-[#C9A96E] hover:text-white transition flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-[#C9A96E] hover:text-white transition flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-base font-bold text-white mb-5 uppercase tracking-wider text-[#C9A96E]">
              Kategori Layanan
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/booking" className="hover:text-white hover:translate-x-1 transition-transform inline-block">
                  Ammonia-Free Balayage & Colouring
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-white hover:translate-x-1 transition-transform inline-block">
                  Organic Keratin Smoothening
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-white hover:translate-x-1 transition-transform inline-block">
                  Russian Dry Manicure & Nail Art
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-white hover:translate-x-1 transition-transform inline-block">
                  Italian Cromoaroma Glow Facial
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-white hover:translate-x-1 transition-transform inline-block">
                  Moroccan Hammam Spa & Massage
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-white hover:translate-x-1 transition-transform inline-block">
                  Russian Volume Lash & Brow Lamination
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-white hover:translate-x-1 transition-transform inline-block">
                  HD Bridal & Party Glam Makeup
                </Link>
              </li>
            </ul>
          </div>

          {/* Cabang Kami */}
          <div>
            <h3 className="font-serif text-base font-bold text-white mb-5 uppercase tracking-wider text-[#C9A96E]">
              Lokasi Cabang
            </h3>
            <div className="space-y-4 text-xs">
              {BRANCHES.map((b) => (
                <div key={b.id} className="border-b border-zinc-800 pb-3">
                  <div className="font-bold text-sm text-white mb-1">{b.name.replace("Aura Salon & Spa - ", "")}</div>
                  <p className="text-zinc-400 mb-1.5">{b.address}</p>
                  <a
                    href={`https://wa.me/${b.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#C9A96E] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Phone className="w-3 h-3" />
                    WhatsApp: +{b.whatsapp}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Jam & Pembayaran */}
          <div>
            <h3 className="font-serif text-base font-bold text-white mb-5 uppercase tracking-wider text-[#C9A96E]">
              Jam & Pembayaran
            </h3>
            <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 mb-5">
              <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1">
                <Clock className="w-4 h-4 text-[#C9A96E]" />
                Jam Operasional
              </div>
              <p className="text-xs text-zinc-400">Setiap Hari: 10:00 - 21:00 WIB</p>
              <p className="text-[11px] text-zinc-500 mt-1">*Disarankan melakukan reservasi H-1 untuk akhir pekan</p>
            </div>

            <div className="text-xs text-zinc-400 mb-2 font-semibold uppercase tracking-wider">
              Metode Pembayaran Diterima:
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] font-medium text-zinc-300">
              <span className="px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700">QRIS (Semua E-Wallet)</span>
              <span className="px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700">BCA / Mandiri VA</span>
              <span className="px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700">Visa / Mastercard</span>
              <span className="px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700">Bayar di Tempat</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Aura & Curls Luxury Salon & Spa. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-[#C9A96E] hover:underline font-semibold">
              Admin & Kasir POS Portal
            </Link>
            <Link href="/booking" className="hover:text-zinc-300 transition">
              Reservasi Online
            </Link>
            <Link href="/voucher" className="hover:text-zinc-300 transition">
              Gift Voucher
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
