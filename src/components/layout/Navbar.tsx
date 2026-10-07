"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Scissors, 
  MapPin, 
  Gift, 
  Menu, 
  X, 
  Phone, 
  ChevronDown, 
  Clock, 
  ShieldCheck, 
  LayoutDashboard 
} from "lucide-react";
import { BRANCHES, CATEGORIES } from "@/data/salon-data";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#121214] text-[#FAF7F2] text-xs py-2 px-4 border-b border-[#2A2A2E]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#C9A96E]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-medium tracking-wide">100% Organic, Vegan & Chemical-Free Beauty Salon</span>
            </span>
            <span className="hidden md:inline text-zinc-500">•</span>
            <span className="hidden md:inline text-zinc-400">Senopati • Pantai Indah Kapuk • BSD City</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-300">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C9A96E]" />
              10:00 - 21:00 WIB
            </span>
            <Link 
              href="/admin" 
              className="hidden sm:flex items-center gap-1 text-[#C9A96E] hover:text-[#E7D3A6] transition font-semibold"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF7F2]/95 backdrop-blur-md shadow-md border-b border-[#C9A96E]/20 py-3"
            : "bg-[#FAF7F2] border-b border-[#C9A96E]/15 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center shadow-md shadow-[#C9A96E]/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-serif text-2xl tracking-wider font-bold text-[#18181B] flex items-center gap-1.5">
                <span>AURA</span>
                <span className="text-[#85662A] font-sans font-light">&</span>
                <span className="text-[#C26B83]">CURLS</span>
              </div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#85662A] font-medium -mt-1">
                Ladies Luxury Salon & Spa
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link href="/" className="text-sm font-semibold text-zinc-800 hover:text-[#85662A] transition">
              Beranda
            </Link>

            {/* Mega Dropdown Services */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-semibold text-zinc-800 hover:text-[#85662A] transition py-2">
                <span>Layanan</span>
                <ChevronDown className="w-4 h-4 text-[#C9A96E]" />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[640px] bg-white rounded-2xl shadow-2xl border border-[#C9A96E]/25 p-6 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/#services`}
                      onClick={() => setServicesDropdownOpen(false)}
                      className="p-3 rounded-xl hover:bg-[#FAF7F2] transition border border-transparent hover:border-[#C9A96E]/20 group flex flex-col justify-between"
                    >
                      <div className="font-serif font-bold text-zinc-900 group-hover:text-[#85662A] transition flex items-center justify-between">
                        <span>{cat.name}</span>
                        <span className="text-xs text-[#C26B83] opacity-0 group-hover:opacity-100 transition">Lihat &rarr;</span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{cat.description}</p>
                    </Link>
                  ))}
                  <div className="col-span-2 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      100% Produk Bebas Formalin & Bebas Amonia
                    </span>
                    <Link href="/booking" className="text-[#85662A] font-bold hover:underline">
                      Jelajahi Semua Layanan &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Branches Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setBranchDropdownOpen(true)}
              onMouseLeave={() => setBranchDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-semibold text-zinc-800 hover:text-[#85662A] transition py-2">
                <span>Cabang</span>
                <ChevronDown className="w-4 h-4 text-[#C9A96E]" />
              </button>

              {branchDropdownOpen && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-xl border border-[#C9A96E]/25 p-3 space-y-1">
                  {BRANCHES.map((b) => (
                    <Link
                      key={b.id}
                      href={`/#branches`}
                      onClick={() => setBranchDropdownOpen(false)}
                      className="block p-2.5 rounded-xl hover:bg-[#FAF7F2] transition group"
                    >
                      <div className="font-semibold text-sm text-zinc-900 group-hover:text-[#85662A]">
                        {b.name.replace("Aura Salon & Spa - ", "")}
                      </div>
                      <p className="text-xs text-zinc-500">{b.city}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/#transformations" className="text-sm font-semibold text-zinc-800 hover:text-[#85662A] transition">
              Hasil & Transformasi
            </Link>

            <Link href="/voucher" className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800 hover:text-[#85662A] transition">
              <Gift className="w-4 h-4 text-[#C26B83]" />
              <span>Voucher Hadiah</span>
            </Link>

            <Link href="/#contact" className="text-sm font-semibold text-zinc-800 hover:text-[#85662A] transition">
              Kontak
            </Link>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="https://wa.me/628118899011?text=Halo%20Aura%20Salon,%20saya%20ingin%20konsultasi%20perawatan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#85662A] hover:text-[#6F5418] transition flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#C9A96E]/40 hover:bg-[#C9A96E]/10"
            >
              <Phone className="w-3.5 h-3.5" />
              WhatsApp CS
            </a>

            <Link
              href="/booking"
              className="gold-gradient text-white px-6 py-2.5 rounded-full text-sm font-bold tracking-wide shadow-md shadow-[#C9A96E]/30 hover:shadow-lg hover:shadow-[#C9A96E]/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Reservasi Jadwal</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-zinc-800 hover:bg-zinc-200 transition"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#C9A96E]/20 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-xl">
            <div className="space-y-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-zinc-900 py-2 border-b border-zinc-100"
              >
                Beranda
              </Link>
              <Link
                href="/#services"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-zinc-900 py-2 border-b border-zinc-100"
              >
                Katalog Layanan
              </Link>
              <Link
                href="/#branches"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-zinc-900 py-2 border-b border-zinc-100"
              >
                Lokasi Cabang (Senopati, PIK, BSD)
              </Link>
              <Link
                href="/#transformations"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-zinc-900 py-2 border-b border-zinc-100"
              >
                Before / After Transformasi
              </Link>
              <Link
                href="/voucher"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-zinc-900 py-2 border-b border-zinc-100"
              >
                Beli Voucher Hadiah
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-[#85662A] py-2 border-b border-zinc-100"
              >
                Portal Staff & Admin Kasir
              </Link>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Link
                href="/booking"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center gold-gradient text-white py-3 rounded-full font-bold shadow-md shadow-[#C9A96E]/30"
              >
                Reservasi Jadwal Sekarang
              </Link>
              <a
                href="https://wa.me/628118899011?text=Halo%20Aura%20Salon,%20saya%20ingin%20konsultasi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-emerald-600 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Chat WhatsApp Cabang
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

