import { Booking } from "@/types/salon";
import { formatRupiah, calculateEndTime } from "@/lib/utils";

// Nomor WhatsApp default untuk reservasi & customer care Aura & Curls
export const DEFAULT_SALON_WHATSAPP = "6285217288084";

/**
 * Membersihkan format nomor telepon Indonesia menjadi format standar internasional WhatsApp (628...)
 */
export function formatWhatsAppPhone(phone?: string): string {
  if (!phone) return DEFAULT_SALON_WHATSAPP;
  let cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  } else if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }
  return cleaned || DEFAULT_SALON_WHATSAPP;
}

/**
 * Format tanggal Indonesia yang ramah dibaca (contoh: Rabu, 15 Okt 2026)
 */
function formatIndonesianDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Template WhatsApp yang dikirimkan oleh Pelanggan ke WhatsApp Cabang Salon (085217288084)
 * setelah berhasil submit booking di website.
 */
export function generateWhatsAppBookingUrl(
  booking: Booking,
  branchWhatsAppNumber: string = DEFAULT_SALON_WHATSAPP
): string {
  const targetNumber = formatWhatsAppPhone(branchWhatsAppNumber);
  const formattedDate = formatIndonesianDate(booking.date);
  const endTime = calculateEndTime(booking.timeSlot, booking.totalDurationMinutes);

  const servicesBreakdown = booking.selectedServices
    .map(
      (s, idx) =>
        `  ${idx + 1}. *${s.name}* (${s.durationMinutes} mnt) - ${formatRupiah(s.price)}`
    )
    .join("\n");

  const paymentMethodLabel =
    booking.paymentMethod === "PAY_AT_SALON"
      ? "Bayar di Salon (Kasir)"
      : booking.paymentMethod === "QRIS_INSTANT"
      ? "QRIS Instan"
      : booking.paymentMethod === "DEPOSIT_50"
      ? "DP 50% Kunci Slot"
      : "Transfer Bank";

  const paymentStatusLabel =
    booking.paymentStatus === "PAID"
      ? "LUNAS (Sudah Dibayar)"
      : booking.paymentMethod === "DEPOSIT_50"
      ? `DP ${formatRupiah(booking.totalAmount * 0.5)} (Sisa di Salon)`
      : "Menunggu Pembayaran di Salon";

  const message = `Halo *${booking.branchName}* ✨

Saya baru saja melakukan reservasi jadwal perawatan melalui website resmi Aura & Curls. Berikut adalah rincian janji temu saya:

🔖 *Kode Reservasi:* ${booking.code}
👤 *Nama Pelanggan:* ${booking.customerName}
📱 *No. WhatsApp:* ${booking.customerPhone}

📍 *Lokasi Cabang:* ${booking.branchName}
📅 *Hari/Tanggal:* ${formattedDate}
⏰ *Jam Perawatan:* ${booking.timeSlot} – ${endTime} WIB
⏱️ *Total Durasi:* ${booking.totalDurationMinutes} Menit
💇‍♀️ *Terapis / Stylist:* ${booking.staffName || "Rekomendasi Salon"}

✨ *Layanan Pilihan:*
${servicesBreakdown}

💰 *TOTAL BIAYA:* ${formatRupiah(booking.totalAmount)}
💳 *Metode Pembayaran:* ${paymentMethodLabel}
📌 *Status Pembayaran:* ${paymentStatusLabel}
${booking.notes ? `📝 *Catatan Khusus:* ${booking.notes}\n` : ""}
Mohon dibantu konfirmasi ketersediaan slot dan terapis saya ya Kak. Terima kasih banyak! 🙏🌸`;

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Template WhatsApp yang dikirimkan oleh Staff / Resepsionis Salon ke nomor Pelanggan
 * melalui dashboard Backoffice (/admin).
 */
export function generateStaffToCustomerWhatsAppUrl(booking: Booking): string {
  const customerNumber = formatWhatsAppPhone(booking.customerPhone);
  const formattedDate = formatIndonesianDate(booking.date);
  const endTime = calculateEndTime(booking.timeSlot, booking.totalDurationMinutes);

  const servicesList = booking.selectedServices
    .map((s) => `• ${s.name}`)
    .join("\n");

  const message = `Halo Kak *${booking.customerName}*, salam hangat dari *Aura & Curls Luxury Salon* ✨

Kami ingin mengonfirmasi jadwal reservasi perawatan Anda di *${booking.branchName}*:

🔖 *Kode Booking:* ${booking.code}
📅 *Hari/Tanggal:* ${formattedDate}
⏰ *Waktu:* ${booking.timeSlot} – ${endTime} WIB (${booking.totalDurationMinutes} menit)
💇‍♀️ *Stylist Bertugas:* ${booking.staffName || "Terapis Spesialis"}
✨ *Layanan:*
${servicesList}
💰 *Total Biaya:* ${formatRupiah(booking.totalAmount)} (${
    booking.paymentMethod === "PAY_AT_SALON" ? "Bayar di Kasir" : booking.paymentMethod
  })

Apakah jadwal janji temu di atas sudah sesuai dan bisa kami kunci slot kursinya untuk Kak ${booking.customerName}? 

Jika ada perubahan waktu atau pertanyaan konsultasi, silakan balas pesan ini ya Kak. Terima kasih dan sampai jumpa! 🙏🌸`;

  return `https://wa.me/${customerNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Link WhatsApp langsung untuk tombol konsultasi umum / CS
 */
export function generateDirectWhatsAppUrl(
  phone: string = DEFAULT_SALON_WHATSAPP,
  message: string = "Halo Aura & Curls Salon, saya ingin konsultasi perawatan kecantikan dan cek ketersediaan jadwal."
): string {
  const targetNumber = formatWhatsAppPhone(phone);
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}
