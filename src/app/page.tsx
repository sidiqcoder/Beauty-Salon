import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyActionRail from "@/components/layout/StickyActionRail";
import HeroSection from "@/components/home/HeroSection";
import TransformationSlider from "@/components/home/TransformationSlider";
import ServicesSection from "@/components/home/ServicesSection";
import BranchesSection from "@/components/home/BranchesSection";
import { 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  Star, 
  Heart, 
  Leaf, 
  Award, 
  MessageCircle, 
  ArrowRight 
} from "lucide-react";

export const metadata = {
  title: "Aura & Curls | Luxury Ladies Salon & Organic Spa Jakarta",
  description:
    "Salon kecantikan wanita eksklusif 100% bebas bahan kimia keras di Jakarta & BSD. Spesialis Ammonia-Free Balayage, Organic Keratin, Russian Manicure, Italian Cromoaroma Facial & Moroccan Hammam.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Before & After Transformation Slider */}
        <TransformationSlider />

        {/* 3. Organic & Clean Beauty Philosophy Strip */}
        <section className="py-20 bg-gradient-to-b from-[#FAF7F2] to-white border-b border-[#C9A96E]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
                    alt="Organic Salon Treatment"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#C9A96E]/30 text-zinc-900 shadow-lg">
                    <div className="flex items-center gap-2 text-[#85662A] font-bold text-xs uppercase tracking-wider mb-1">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      Komitmen Bersih &amp; Halal
                    </div>
                    <p className="text-xs text-zinc-600">
                      Bebas amonia, bebas racun formalin, dan bersertifikasi aman untuk kulit sensitif dan ibu hamil.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#85662A] bg-[#C9A96E]/15 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  Mengapa Memilih Aura &amp; Curls?
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
                  Perawatan Mewah Tanpa Mengorbankan Kesehatan Anda
                </h2>

                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                  Banyak salon kecantikan menggunakan bahan kimia keras demi hasil instan, namun berisiko merusak batang rambut dan menyerap racun ke dalam tubuh. Di Aura &amp; Curls, kami membuktikan bahwa kemewahan dan kesehatan dapat berjalan berdampingan.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#C9A96E]/20">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-base text-zinc-900 mb-1">
                      Formula 100% Organik
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Pewarna rambut nabati tanpa bau menyengat, menjaga kelembapan alami kutikula rambut tanpa iritasi mata &amp; hidung.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#C9A96E]/20">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-3">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-base text-zinc-900 mb-1">
                      Higienis Medis Bersertifikat
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Semua alat kuku dan facial melewati proses sterilisasi autoclave berstandar medis untuk keamanan maksimal setiap sesi.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/booking"
                    className="inline-flex items-center gap-2 gold-gradient text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
                  >
                    <span>Coba Pengalaman Organik Ini</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Services Menu Catalog */}
        <ServicesSection />

        {/* 5. Branches Locations */}
        <BranchesSection />

        {/* 6. Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#85662A] mb-2">
                <Star className="w-4 h-4 fill-[#C9A96E] text-[#C9A96E]" />
                Ulasan &amp; Kepuasan Pelanggan
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 mb-3">
                Dicintai Lebih Dari 10.000 Wanita Indonesia
              </h2>
              <div className="flex items-center justify-center gap-2 text-sm text-zinc-600">
                <span className="font-bold text-zinc-900">4.9 / 5.0</span>
                <div className="flex text-amber-400">
                  {"★★★★★"}
                </div>
                <span>(1.280+ Ulasan Terverifikasi di Google Maps)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#C9A96E]/20 flex flex-col justify-between">
                <div>
                  <div className="text-amber-400 text-sm mb-3">★★★★★</div>
                  <p className="text-sm text-zinc-700 italic leading-relaxed mb-6">
                    "Akhirnya nemu salon di Jakarta yang beneran aman buat ibu hamil! Balayage-nya sama sekali nggak ada bau kimia tajam, hasilnya rambut lembut banget berkilau kayak artis Korea."
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-200">
                  <div className="w-10 h-10 rounded-full bg-[#85662A] text-white flex items-center justify-center font-bold text-sm">
                    NS
                  </div>
                  <div>
                    <div className="font-bold text-xs text-zinc-900">Nabila Syakieb</div>
                    <div className="text-[11px] text-zinc-500">Cabang Senopati • Balayage Organik</div>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#C9A96E]/20 flex flex-col justify-between">
                <div>
                  <div className="text-amber-400 text-sm mb-3">★★★★★</div>
                  <p className="text-sm text-zinc-700 italic leading-relaxed mb-6">
                    "Russian Manicure terbaik se-PIK! Kutikula bersih banget sampai ke sudut-sudutnya, nail art-nya rapi presisi dan gel-nya tahan lebih dari sebulan tanpa ngelupas sama sekali."
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-200">
                  <div className="w-10 h-10 rounded-full bg-[#C26B83] text-white flex items-center justify-center font-bold text-sm">
                    VT
                  </div>
                  <div>
                    <div className="font-bold text-xs text-zinc-900">Valerie Thomas</div>
                    <div className="text-[11px] text-zinc-500">Cabang PIK • Russian Manicure Gel</div>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#C9A96E]/20 flex flex-col justify-between">
                <div>
                  <div className="text-amber-400 text-sm mb-3">★★★★★</div>
                  <p className="text-sm text-zinc-700 italic leading-relaxed mb-6">
                    "Treatment Cromoaroma Italian Facial-nya nagih! Wajah yang tadinya kusam kemerahan langsung glowing segar seketika. Ruangan privatnya adem dan wangi aromaterapinya bikin rileks."
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-200">
                  <div className="w-10 h-10 rounded-full bg-[#85662A] text-white flex items-center justify-center font-bold text-sm">
                    DA
                  </div>
                  <div>
                    <div className="font-bold text-xs text-zinc-900">dr. Amanda Sp.KK</div>
                    <div className="text-[11px] text-zinc-500">Cabang BSD City • Cromoaroma Facial</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Bottom Luxury CTA Banner */}
        <section className="py-20 bg-[#121214] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9A96E_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <span className="text-[#C9A96E] font-serif italic text-2xl">
              Saatnya Memberikan Hadiah Terbaik Bagi Diri Anda Sendiri ✨
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Reservasi Jadwal Anda Sekarang
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
              Slot janji temu akhir pekan terbatas. Kunci jadwal favorit Anda hari ini secara instan dengan konfirmasi cepat via WhatsApp.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/booking"
                className="gold-gradient text-white px-9 py-4 rounded-full font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#85662A]/40 hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Pilih Layanan &amp; Reservasi</span>
              </Link>

              <a
                href="https://wa.me/6285217288084?text=Halo%20Aura%20Salon,%20saya%20ingin%20konsultasi%20jadwal%20perawatan."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Tanya CS WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyActionRail />
    </div>
  );
}
