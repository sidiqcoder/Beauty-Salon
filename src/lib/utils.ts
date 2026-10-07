import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateEndTime(startTime: string, durationMinutes: number): string {
  if (!startTime || !startTime.includes(":")) return startTime;
  const [hStr, mStr] = startTime.split(":");
  const hours = parseInt(hStr, 10);
  const minutes = parseInt(mStr, 10);
  if (isNaN(hours) || isNaN(minutes)) return startTime;

  const totalMinutes = hours * 60 + minutes + (durationMinutes || 60);
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMins = totalMinutes % 60;
  return `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;
}

export function validateIndonesianPhone(phone: string): { isValid: boolean; message?: string } {
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (!cleaned) {
    return { isValid: false, message: "Nomor WhatsApp wajib diisi." };
  }
  if (!cleaned.startsWith("08") && !cleaned.startsWith("628")) {
    return { isValid: false, message: "Nomor harus diawali dengan 08... atau 628..." };
  }
  if (cleaned.length < 10 || cleaned.length > 14) {
    return { isValid: false, message: "Nomor WhatsApp harus terdiri dari 10 - 13 digit angka." };
  }
  return { isValid: true };
}
