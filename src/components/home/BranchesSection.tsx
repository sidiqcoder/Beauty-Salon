import React from "react";
import Link from "next/link";
import { MapPin, Phone, Clock, MessageCircle, Calendar, Sparkles } from "lucide-react";
import { BRANCHES } from "@/data/salon-data";

export default function BranchesSection() {
  return (
    <section id="branches" className="py-20 bg-[#FAF7F2] border-b border-[#C9A96E]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#85662A] mb-2">
            <Sparkles className="w-4 h-4 text-[#C9A96E]" />
            Lokasi Cabang Kami
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
            Kunjungi Cabang Terdekat di Kota Anda
          </h2>
          <p className="text-sm text-zinc-600">
            Hadir di tiga lokasi strategis dengan interior bernuansa hangat, ruang perawatan privat yang tenang, dan barista bar untuk kenyamanan Anda.
          </p>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BRANCHES.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#C9A96E]/20 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#85662A] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {branch.city}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="font-serif text-xl font-bold text-zinc-900">
                    {branch.name.replace("Aura Salon & Spa - ", "")}
                  </h3>

                  <div className="space-y-2.5 text-xs text-zinc-600">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#85662A] shrink-0 mt-0.5" />
                      <span>{branch.address}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#85662A] shrink-0" />
                      <span>{branch.openHours}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#85662A] shrink-0" />
                      <span>{branch.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 space-y-2.5">
                <Link
                  href={`/booking?branch=${branch.id}`}
                  className="w-full gold-gradient text-white py-3 rounded-full font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-md shadow-[#C9A96E]/30 hover:shadow-lg transition"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reservasi di Cabang Ini</span>
                </Link>

                <a
                  href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(
                    `Halo ${branch.name}, saya ingin booking perawatan.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#FAF7F2] hover:bg-emerald-50 text-emerald-800 border border-emerald-300 py-2.5 rounded-full font-semibold text-xs text-center flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chat WhatsApp Cabang</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

