"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Calendar, ChevronRight } from "lucide-react";
import { TRANSFORMATIONS } from "@/data/salon-data";

export default function TransformationSlider() {
  const [selectedTransIndex, setSelectedTransIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100

  const current = TRANSFORMATIONS[selectedTransIndex];

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const offsetX = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    setSliderPosition(percent);
  };

  return (
    <section id="transformations" className="py-20 bg-[#FAF7F2] border-b border-[#C9A96E]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#85662A] mb-2">
            <Sparkles className="w-4 h-4 text-[#C9A96E]" />
            Hasil Nyata Pelanggan
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
            Transformasi Sebelum &amp; Sesudah Perawatan
          </h2>
          <p className="text-sm text-zinc-600">
            Geser garis slider di bawah untuk melihat perbedaan hasil kilau rambut, kerapian kutikula kuku, dan kelembapan wajah sebelum dan sesudah perawatan.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {TRANSFORMATIONS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTransIndex(idx);
                setSliderPosition(50);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                selectedTransIndex === idx
                  ? "gold-gradient text-white shadow-md shadow-[#C9A96E]/30 scale-105"
                  : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
              }`}
            >
              {t.category}
            </button>
          ))}
        </div>

        {/* Main Comparison Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#C9A96E]/25">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* The Draggable Slider Box */}
            <div className="lg:col-span-7">
              <div
                className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-zinc-200 shadow-inner"
                onMouseMove={(e) => e.buttons === 1 && handleSliderMove(e)}
                onTouchMove={handleSliderMove}
                onClick={handleSliderMove}
              >
                {/* AFTER Image (Full background) */}
                <img
                  src={current.afterImage}
                  alt={`After ${current.title}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* BEFORE Image (Clipped by slider position) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={current.beforeImage}
                    alt={`Before ${current.title}`}
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: "100%", height: "100%" }}
                  />
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Sebelum
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-[#85662A]/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Sesudah
                </div>

                {/* Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  {/* Central circular handle button */}
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-zinc-900 flex items-center justify-center font-bold text-xs shadow-xl border-2 border-[#C9A96E]">
                    ⇄
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-center text-zinc-400 mt-2">
                *Klik atau tahan &amp; geser untuk membandingkan
              </p>
            </div>

            {/* Description Info */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-[#E88A9F]/15 text-[#C26B83] text-xs font-bold uppercase tracking-wider">
                {current.category}
              </div>
              <h3 className="font-serif text-2xl font-bold text-zinc-900">
                {current.title}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {current.description}
              </p>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                <span>Dikerjakan oleh:</span>
                <span className="font-bold text-zinc-900">{current.stylist}</span>
              </div>

              <div className="pt-4">
                <Link
                  href="/booking"
                  className="w-full gold-gradient text-white py-3 rounded-full font-bold text-sm text-center flex items-center justify-center gap-2 shadow-md shadow-[#C9A96E]/30 hover:scale-[1.02] transition"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Dapatkan Hasil Serupa</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

