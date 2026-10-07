"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Clock, ArrowRight, Check, Leaf } from "lucide-react";
import { CATEGORIES, SERVICES } from "@/data/salon-data";
import { formatRupiah } from "@/lib/utils";

export default function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredServices =
    activeCategory === "all"
      ? SERVICES
      : SERVICES.filter((s) => s.categoryId === activeCategory);

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#85662A] mb-2">
            <Sparkles className="w-4 h-4 text-[#C9A96E]" />
            Daftar Perawatan Eksklusif
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
            Menu Layanan Kecantikan &amp; Spa
          </h2>
          <p className="text-sm text-zinc-600">
            Diformulasikan secara cermat dengan bahan alami bebas racun kimia untuk hasil maksimal yang aman jangka panjang.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 gap-2 mb-12 no-scrollbar">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === "all"
                ? "gold-gradient text-white shadow-md shadow-[#C9A96E]/30 scale-105"
                : "bg-[#FAF7F2] text-zinc-700 hover:bg-zinc-200 border border-zinc-200"
            }`}
          >
            Semua Layanan
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "gold-gradient text-white shadow-md shadow-[#C9A96E]/30 scale-105"
                  : "bg-[#FAF7F2] text-zinc-700 hover:bg-zinc-200 border border-zinc-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="luxury-card rounded-2xl overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {service.badge && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#85662A] text-white shadow-md">
                        {service.badge}
                      </span>
                    )}
                    {service.isOrganic && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-800/90 text-emerald-100 flex items-center gap-1 backdrop-blur-sm">
                        <Leaf className="w-3 h-3 text-emerald-300" />
                        Organic
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/75 text-white flex items-center gap-1 backdrop-blur-sm">
                    <Clock className="w-3.5 h-3.5 text-[#C9A96E]" />
                    {service.durationMinutes} menit
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-serif text-lg font-bold text-zinc-900 group-hover:text-[#85662A] transition-colors mb-2 line-clamp-2">
                    {service.name}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 mb-4">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="px-6 pb-6 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">Harga Mulai</span>
                  <span className="font-serif text-lg font-bold text-[#85662A]">
                    {formatRupiah(service.price)}
                  </span>
                </div>

                <Link
                  href={`/booking?service=${service.id}`}
                  className="px-4 py-2 rounded-full gold-gradient text-white text-xs font-bold tracking-wide hover:shadow-md hover:scale-105 transition flex items-center gap-1"
                >
                  <span>Pilih</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#85662A] text-[#85662A] font-bold text-sm tracking-wider uppercase hover:bg-[#85662A] hover:text-white transition-all shadow-sm"
          >
            <span>Buka Kalender &amp; Booking Jadwal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

