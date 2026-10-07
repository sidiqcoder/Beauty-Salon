import { Booking } from "@/types/salon";
import { formatRupiah, calculateEndTime } from "@/lib/utils";

export function generateWhatsAppBookingUrl(booking: Booking, branchWhatsAppNumber: string): string {
  const serviceList = booking.selectedServices
    .map((s) => `  - ${s.name} (${s.durationMinutes} mnt)`)
    .join("\n");

  const endTime = calculateEndTime(booking.timeSlot, booking.totalDurationMinutes);

  const text = `Halo *${booking.branchName}*,
Saya telah melakukan reservasi online melalui website:

🔖 *Kode Booking:* ${booking.code}
👤 *Nama Pelanggan:* ${booking.customerName}
📱 *No. WhatsApp:* ${booking.customerPhone}
📅 *Tanggal:* ${booking.date}
⏰ *Jam Janji Temu:* ${booking.timeSlot} – ${endTime} WIB (Durasi ${booking.totalDurationMinutes} mnt)
${booking.staffName ? `💇‍♀️ *Stylist/Terapis:* ${booking.staffName}\n` : ""}
✨ *Layanan Pilihan:*
${serviceList}

⏱️ *Total Durasi:* ${booking.totalDurationMinutes} menit
💰 *Total Biaya:* ${formatRupiah(booking.totalAmount)}
💳 *Metode Pembayaran:* ${
    booking.paymentMethod === "PAY_AT_SALON"
      ? "Bayar di Salon (Saat Kedatangan)"
      : booking.paymentMethod === "QRIS_INSTANT"
      ? "Sudah Bayar via QRIS"
      : booking.paymentMethod === "DEPOSIT_50"
      ? "DP 50% Ditransfer"
      : "Transfer Bank"
  }
${booking.notes ? `📝 *Catatan Khusus:* ${booking.notes}\n` : ""}
Mohon konfirmasi ketersediaan jadwal saya ya. Terima kasih! 🙏`;

  const encodedText = encodeURIComponent(text);
  // Clean phone number (e.g. ensure starts with country code without + or dashes)
  const cleanPhone = branchWhatsAppNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function generateDirectWhatsAppUrl(branchPhone: string, message: string = "Halo Aura Salon & Spa, saya ingin konsultasi perawatan."): string {
  const cleanPhone = branchPhone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

