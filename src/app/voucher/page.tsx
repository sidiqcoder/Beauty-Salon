"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyActionRail from "@/components/layout/StickyActionRail";
import { Sparkles, Gift, Heart, Send, Check, MessageCircle } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function VoucherPage() {
  const [amount, setAmount] = useState<number>(500000);
  const [recipientName, setRecipientName] = useState<string>("Sahabat Tersayang");
  const [senderName, setSenderName] = useState<string>("Dari Saya");
  const [personalMessage, setPersonalMessage] = useState<string>(
    "Selamat menikmati waktu relaksasi dan perawatan istimewa untukmu! ✨"
  );

  const voucherAmounts = [300000, 500000, 1000000, 1500000, 2500000];

  const handleOrderVoucher = () => {
    const text = `Halo Aura & Curls Salon, saya ingin memesan *Digital Gift Voucher*:

🎁 *Nominal:* ${formatRupiah(amount)}
👤 *Untuk:* ${recipientName}
💌 *Dari:* ${senderName}
📝 *Pesan Khusus:* "${personalMessage}"

Mohon info rekening pembayaran untuk penerbitan e-voucher resmi ya. Terima kasih! 🙏`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/628118899011?text=${encoded}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-10 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#85662A] bg-[#C9A96E]/15 px-3 py-1 rounded-full">
            <Gift className="w-3.5 h-3.5 text-[#C9A96E]" />
            Hadiah Istimewa Untuk Yang Tercinta
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900">
            Aura &amp; Curls Luxury Gift Voucher
          </h1>
          <p className="text-sm text-zinc-600 max-w-lg mx-auto">
            Berikan kejutan hari ulang tahun, pernikahan, atau apresiasi hari istimewa dengan voucher perawatan salon eksklusif yang berlaku di semua cabang kami.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Live Preview Card */}
          <div className="lg:col-span-7">
            <div className="bg-gradient-to-br from-[#1A1612] via-[#2A2219] to-[#120F0D] rounded-3xl p-8 text-white shadow-2xl border-2 border-[#C9A96E]/40 relative overflow-hidden">
              {/* Gold watermark ornament */}
              <div className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full border-[16px] border-[#C9A96E]/10 pointer-events-none" />
              <div className="absolute top-0 right-0 p-6 opacity-20">
                <Sparkles className="w-24 h-24 text-[#C9A96E]" />
              </div>

              <div className="relative z-10 flex flex-col justify-between min-h-[300px]">
                <div className="flex items-center justify-between pb-6 border-b border-[#C9A96E]/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-serif text-lg font-bold tracking-wider">
                        AURA <span className="text-[#C9A96E]">&amp;</span> CURLS
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-[#C9A96E]">
                        Official Gift Certificate
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-[#C9A96E] tracking-widest font-bold">
                    AUR-GC-2026
                  </div>
                </div>

                <div className="py-6 space-y-4">
                  <div className="text-xs uppercase tracking-widest text-zinc-400">
                    Nilai Perawatan:
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-[#E7D3A6] tracking-wide">
                    {formatRupiah(amount)}
                  </div>

                  <div className="pt-2 text-xs text-zinc-300">
                    <div>
                      Diberikan Kepada: <strong className="text-white text-sm">{recipientName}</strong>
                    </div>
                    <div>
                      Dari: <strong className="text-white">{senderName}</strong>
                    </div>
                  </div>

                  <p className="text-xs italic text-zinc-400 font-serif border-l-2 border-[#C9A96E] pl-3 py-1">
                    "{personalMessage}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#C9A96E]/20 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>Berlaku 6 Bulan Sejak Diterbitkan</span>
                  <span>Senopati • PIK • BSD City</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 text-center mt-3">
              *E-Voucher resmi dengan barcode QR unik akan dikirimkan dalam format PDF HD siap cetak.
            </p>
          </div>

          {/* Form Configuration */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#C9A96E]/20 space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-2">
                Pilih Nominal Voucher:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {voucherAmounts.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                      amount === val
                        ? "gold-gradient text-white border-transparent shadow"
                        : "bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200"
                    }`}
                  >
                    {formatRupiah(val)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1">
                Nama Penerima Voucher:
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs focus:ring-2 focus:ring-[#C9A96E]"
                placeholder="Contoh: Jessica"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1">
                Nama Pengirim (Anda):
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs focus:ring-2 focus:ring-[#C9A96E]"
                placeholder="Contoh: Amanda"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1">
                Ucapan Khusus:
              </label>
              <textarea
                rows={2}
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs focus:ring-2 focus:ring-[#C9A96E]"
                placeholder="Tulis ucapan manis..."
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleOrderVoucher}
                className="w-full bg-[#15803D] hover:bg-[#166534] text-white py-3.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pesan Voucher via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <StickyActionRail />
    </div>
  );
}

