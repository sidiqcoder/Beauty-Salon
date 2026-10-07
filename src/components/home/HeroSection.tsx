import React from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Calendar, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Award, 
  Leaf, 
  Star, 
  CheckCircle2, 
  ShieldCheck 
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#0E0A0D] text-white">
      {/* Background Image with Dark Luxury Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-right md:bg-center transform scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=85')`,
          }}
        />
        {/* Multilayered subtle gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E0A0D] via-[#0E0A0D]/90 md:via-[#0E0A0D]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A0D] via-transparent to-black/40" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-12 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A96E]/15 border border-[#C9A96E]/40 text-[#C9A96E] text-xs font-semibold tracking-widest uppercase backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Chemical-Free • Organik • Vegan</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
            Salon Kecantikan &amp; Spa Mewah Khusus Wanita
          </h1>

          {/* Script Tagline */}
          <div className="text-[#E88A9F] font-serif italic text-2xl sm:text-3xl tracking-wide flex items-center gap-2">
            <span>Pancarkan Pesona Anggun Alami Anda</span>
            <span className="text-[#C9A96E] not-italic text-lg">✦</span>
          </div>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Rasakan kenyamanan perawatan rambut bebas amonia, Russian manicure presisi, Cromoaroma Italian facial, dan spa khas Maroko di ruang privat eksklusif.
          </p>

          {/* Trust bullet points */}
          <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-zinc-200">
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#C9A96E]/20 text-[#C9A96E] flex items-center justify-center border border-[#C9A96E]/40">
                <Clock className="w-3.5 h-3.5" />
              </span>
              <span><strong>10+ Tahun Pengalaman</strong> dalam perawatan rambut &amp; estetika</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#C9A96E]/20 text-[#C9A96E] flex items-center justify-center border border-[#C9A96E]/40">
                <MapPin className="w-3.5 h-3.5" />
              </span>
              <span><strong>3 Cabang Strategis:</strong> Senopati, Pantai Indah Kapuk, &amp; BSD City</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#C9A96E]/20 text-[#C9A96E] flex items-center justify-center border border-[#C9A96E]/40">
                <Leaf className="w-3.5 h-3.5" />
              </span>
              <span><strong>100% Bahan Organik</strong> bebas formalin, amonia &amp; paraben</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#C9A96E]/20 text-[#C9A96E] flex items-center justify-center border border-[#C9A96E]/40">
                <Star className="w-3.5 h-3.5 fill-[#C9A96E]" />
              </span>
              <span><strong>1.200+ Ulasan Google Bintang 5</strong> dengan kepuasan pelanggan 99%</span>
            </li>
          </ul>

          {/* Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link
              href="/booking"
              className="gold-gradient text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase text-center shadow-lg shadow-[#85662A]/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Reservasi Jadwal Sekarang</span>
            </Link>

            <a
              href="https://wa.me/628118899011?text=Halo%20Aura%20Salon,%20saya%20ingin%20konsultasi%20perawatan"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-7 py-3.5 rounded-full font-bold text-sm tracking-wide text-center transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Konsultasi WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Trust Strip Bar at bottom */}
      <div className="relative z-10 bg-black/60 backdrop-blur-md border-t border-[#C9A96E]/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Award className="w-7 h-7 text-[#C9A96E] shrink-0" />
              <div>
                <div className="font-bold text-xs sm:text-sm text-white">Standar Higienis A+</div>
                <div className="text-[11px] text-zinc-400">Sterilisasi alat autoclave medis</div>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Leaf className="w-7 h-7 text-[#C9A96E] shrink-0" />
              <div>
                <div className="font-bold text-xs sm:text-sm text-white">Formula 100% Organik</div>
                <div className="text-[11px] text-zinc-400">Aman ibu hamil &amp; menyusui</div>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <ShieldCheck className="w-7 h-7 text-[#C9A96E] shrink-0" />
              <div>
                <div className="font-bold text-xs sm:text-sm text-white">Ruang Khusus Wanita</div>
                <div className="text-[11px] text-zinc-400">Privat, nyaman &amp; ramah hijab</div>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <CheckCircle2 className="w-7 h-7 text-[#C9A96E] shrink-0" />
              <div>
                <div className="font-bold text-xs sm:text-sm text-white">Garansi Treatment</div>
                <div className="text-[11px] text-zinc-400">Garansi touch-up 7 hari</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

