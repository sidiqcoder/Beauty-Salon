"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  AlertCircle,
  MessageCircle,
  Scissors,
  CreditCard,
  Building,
  CheckCircle2,
  FileText,
  Printer
} from "lucide-react";
import { 
  BRANCHES, 
  CATEGORIES, 
  SERVICES, 
  STAFF_MEMBERS, 
  AVAILABLE_TIME_SLOTS 
} from "@/data/salon-data";
import { 
  BranchId, 
  ServiceItem, 
  StaffStylist, 
  PaymentMethod, 
  Booking 
} from "@/types/salon";
import { formatRupiah, calculateEndTime, validateIndonesianPhone } from "@/lib/utils";
import { generateWhatsAppBookingUrl } from "@/lib/whatsapp";

interface BookingWizardProps {
  initialBranchId?: BranchId;
  initialServiceId?: string;
}

export default function BookingWizard({ initialBranchId, initialServiceId }: BookingWizardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Step state (1 to 5, and 6 is success)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form selections
  const [selectedBranchId, setSelectedBranchId] = useState<BranchId>(
    (searchParams.get("branch") as BranchId) || initialBranchId || "senopati"
  );
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("any");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PAY_AT_SALON");

  // Filter category in step 2
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Existing bookings for slot availability check
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Initialize service from params if present
  useEffect(() => {
    const sId = searchParams.get("service") || initialServiceId;
    if (sId) {
      const found = SERVICES.find((s) => s.id === sId);
      if (found && !selectedServices.some((s) => s.id === found.id)) {
        setSelectedServices([found]);
        setCurrentStep(2); // move to step 2 directly
      }
    }
  }, [searchParams, initialServiceId]);

  // Set default date to tomorrow if empty
  useEffect(() => {
    if (!selectedDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split("T")[0]);
    }
  }, [selectedDate]);

  // Fetch real-time existing bookings to avoid double-booking / slot conflicts
  useEffect(() => {
    if (!selectedBranchId || !selectedDate) return;
    let isMounted = true;
    setLoadingSlots(true);

    fetch(`/api/bookings?branchId=${selectedBranchId}&date=${selectedDate}`)
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success) {
          setExistingBookings(json.data || []);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat jadwal terisi:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedBranchId, selectedDate]);

  // Selected Branch object
  const currentBranch = BRANCHES.find((b) => b.id === selectedBranchId) || BRANCHES[0];

  // Available staff for the selected branch
  const availableStaff = STAFF_MEMBERS.filter((s) => s.branchId === selectedBranchId);

  // Computations
  const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  // Check if a time slot is available
  const getSlotStatus = (time: string) => {
    const activeBookingsAtTime = existingBookings.filter(
      (b) => b.timeSlot === time && b.status !== "CANCELLED"
    );

    if (selectedStaffId !== "any") {
      const isStaffBooked = activeBookingsAtTime.some((b) => b.staffId === selectedStaffId);
      if (isStaffBooked) {
        return { isAvailable: false, label: "Stylist Sibuk" };
      }
    } else {
      const branchCapacity = Math.max(availableStaff.length, 2);
      if (activeBookingsAtTime.length >= branchCapacity) {
        return { isAvailable: false, label: "Penuh" };
      }
      if (activeBookingsAtTime.length > 0) {
        return { 
          isAvailable: true, 
          label: `Tersisa ${branchCapacity - activeBookingsAtTime.length} Slot` 
        };
      }
    }

    return { isAvailable: true, label: null };
  };

  // Toggle service selection
  const handleToggleService = (service: ServiceItem) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Handle phone input changes with instant validation
  const handlePhoneChange = (val: string) => {
    setCustomerPhone(val);
    if (phoneError) {
      const check = validateIndonesianPhone(val);
      if (check.isValid) setPhoneError(null);
    }
  };

  // Generate date options for the next 14 days
  const dateOptions = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(d);
    const dayNumber = d.getDate();
    const monthName = new Intl.DateTimeFormat("id-ID", { month: "short" }).format(d);
    return { dateStr, dayName, dayNumber, monthName };
  });

  // Handle final submission
  const handleSubmitBooking = async () => {
    if (!customerName.trim()) {
      alert("Mohon masukkan nama lengkap Anda.");
      return;
    }

    const phoneValidation = validateIndonesianPhone(customerPhone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.message || "Nomor WhatsApp tidak valid.");
      return;
    }
    setPhoneError(null);

    setIsSubmitting(true);
    try {
      const selectedStaffObj = availableStaff.find((s) => s.id === selectedStaffId);

      const payload = {
        branchId: selectedBranchId,
        branchName: currentBranch.name,
        staffId: selectedStaffId !== "any" ? selectedStaffId : undefined,
        staffName: selectedStaffId !== "any" ? selectedStaffObj?.name : "Terapis Rekomendasi Salon",
        customerName,
        customerPhone,
        customerEmail: customerEmail || undefined,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        selectedServices,
        totalAmount,
        totalDurationMinutes: totalDuration,
        paymentMethod,
        paymentStatus: paymentMethod === "QRIS_INSTANT" ? "PAID" : "UNPAID",
        notes: customerNotes,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setCreatedBooking(json.data);
        setCurrentStep(6); // Success step
        // Fire confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#C9A96E", "#E88A9F", "#FFFFFF", "#85662A"],
        });
      } else {
        alert("Gagal memproses booking: " + json.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi. Silakan coba kembali.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsLabels = ["Cabang", "Layanan", "Stylist", "Jadwal", "Data Diri"];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-[#C9A96E]/20 overflow-hidden">
      {/* Wizard Progress Header */}
      {currentStep <= 5 && (
        <div className="bg-[#FAF7F2] border-b border-[#C9A96E]/20 px-6 py-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {stepsLabels.map((label, index) => {
              const stepNum = index + 1;
              const isActive = currentStep === stepNum;
              const isPassed = currentStep > stepNum;

              return (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isActive
                          ? "gold-gradient text-white ring-4 ring-[#C9A96E]/20 shadow-md"
                          : isPassed
                          ? "bg-emerald-600 text-white"
                          : "bg-zinc-200 text-zinc-500"
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4" /> : stepNum}
                    </div>
                    <span
                      className={`text-[11px] mt-1.5 font-bold tracking-wider uppercase ${
                        isActive ? "text-[#85662A]" : isPassed ? "text-emerald-700" : "text-zinc-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {index < stepsLabels.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 transition-all ${
                        currentStep > stepNum ? "bg-emerald-600" : "bg-zinc-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Form Body */}
      <div className="p-6 sm:p-10">
        {/* ================= STEP 1: PILIH CABANG ================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center max-w-lg mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
                Pilih Lokasi Cabang
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Tentukan cabang terdekat yang ingin Anda kunjungi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
              {BRANCHES.map((b) => {
                const isSelected = selectedBranchId === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBranchId(b.id)}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? "border-[#85662A] bg-[#FAF7F2] shadow-lg shadow-[#85662A]/10 scale-[1.02]"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full gold-gradient text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#C9A96E]/30 flex items-center justify-center text-[#85662A] mb-3">
                        <Building className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-lg text-zinc-900">
                        {b.name.replace("Aura Salon & Spa - ", "")}
                      </h3>
                      <p className="text-xs font-semibold text-[#85662A] mt-0.5">{b.city}</p>
                      <p className="text-xs text-zinc-500 mt-2 line-clamp-2 leading-relaxed">
                        {b.address}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-zinc-200/60 text-[11px] text-zinc-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C9A96E]" />
                      <span>{b.openHours}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="gold-gradient text-white px-8 py-3 rounded-full font-bold text-sm shadow-md hover:scale-105 transition flex items-center gap-2"
              >
                <span>Lanjut Pilih Layanan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: PILIH LAYANAN ================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center max-w-lg mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
                Pilih Layanan Perawatan
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Anda dapat memilih lebih dari satu perawatan sekaligus
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  activeCategory === "all"
                    ? "gold-gradient text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                Semua
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                    activeCategory === cat.id
                      ? "gold-gradient text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Service List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
              {(activeCategory === "all"
                ? SERVICES
                : SERVICES.filter((s) => s.categoryId === activeCategory)
              ).map((service) => {
                const isSelected = selectedServices.some((s) => s.id === service.id);

                return (
                  <div
                    key={service.id}
                    onClick={() => handleToggleService(service)}
                    className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex items-start gap-4 ${
                      isSelected
                        ? "border-[#85662A] bg-[#FAF7F2] shadow-md"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    }`}
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#85662A]/60 flex items-center justify-center text-white">
                          <Check className="w-6 h-6 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif font-bold text-sm text-zinc-900 leading-snug line-clamp-1">
                          {service.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="font-serif font-bold text-sm text-[#85662A]">
                          {formatRupiah(service.price)}
                        </span>
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1 font-medium bg-zinc-100 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 text-[#C9A96E]" />
                          {service.durationMinutes} mnt
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom summary bar of selected services */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#C9A96E]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-zinc-500">
                  Layanan Dipilih:{" "}
                  <strong className="text-zinc-900">{selectedServices.length} Treatment</strong> (
                  {totalDuration} menit)
                </div>
                <div className="font-serif text-xl font-bold text-[#85662A]">
                  Total: {formatRupiah(totalAmount)}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-full border border-zinc-300 text-zinc-700 text-xs font-bold hover:bg-zinc-100 transition"
                >
                  Kembali
                </button>
                <button
                  disabled={selectedServices.length === 0}
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 sm:flex-none gold-gradient disabled:opacity-50 text-white px-7 py-2.5 rounded-full font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <span>Lanjut Pilih Stylist</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PILIH STYLIST ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center max-w-lg mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
                Pilih Terapis / Stylist
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Pilih terapis favorit Anda di {currentBranch.name.replace("Aura Salon & Spa - ", "")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              {/* Option 1: Any Staff */}
              <div
                onClick={() => setSelectedStaffId("any")}
                className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex flex-col items-center text-center justify-center ${
                  selectedStaffId === "any"
                    ? "border-[#85662A] bg-[#FAF7F2] shadow-lg"
                    : "border-zinc-200 hover:border-zinc-300 bg-white"
                }`}
              >
                <div className="w-16 h-16 rounded-full gold-gradient text-white flex items-center justify-center text-xl font-serif font-bold mb-3 shadow">
                  ✨
                </div>
                <h4 className="font-serif font-bold text-base text-zinc-900">
                  Rekomendasi Salon
                </h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Kami pilihkan stylist terbaik yang siap melayani Anda
                </p>
                <span className="mt-3 text-[11px] font-bold text-[#85662A]">
                  Paling Fleksibel
                </span>
              </div>

              {/* Specific Staff */}
              {availableStaff.map((staff) => {
                const isSelected = selectedStaffId === staff.id;
                return (
                  <div
                    key={staff.id}
                    onClick={() => setSelectedStaffId(staff.id)}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex flex-col items-center text-center ${
                      isSelected
                        ? "border-[#85662A] bg-[#FAF7F2] shadow-lg"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    }`}
                  >
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-[#C9A96E]/50">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-serif font-bold text-base text-zinc-900">
                      {staff.name}
                    </h4>
                    <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                      {staff.roleTitle}
                    </p>
                    <div className="mt-2 text-xs text-amber-600 font-bold flex items-center gap-1">
                      <span>★ {staff.rating}</span>
                      <span className="text-zinc-400 font-normal">({staff.reviewsCount})</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 rounded-full border border-zinc-300 text-zinc-700 text-xs font-bold hover:bg-zinc-100 transition"
              >
                Kembali
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="gold-gradient text-white px-8 py-3 rounded-full font-bold text-sm shadow-md hover:scale-105 transition flex items-center gap-2"
              >
                <span>Lanjut Pilih Waktu</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: PILIH TANGGAL & JAM ================= */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center max-w-lg mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
                Pilih Tanggal &amp; Waktu
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Total estimasi pengerjaan Anda: <strong>{totalDuration} menit</strong>
              </p>
            </div>

            {/* Horizontal Date Picker */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-2">
                Pilih Hari Kedatangan:
              </label>
              <div className="flex gap-2.5 overflow-x-auto pb-3 no-scrollbar">
                {dateOptions.map((item) => {
                  const isSelected = selectedDate === item.dateStr;
                  return (
                    <button
                      key={item.dateStr}
                      type="button"
                      onClick={() => setSelectedDate(item.dateStr)}
                      className={`flex flex-col items-center justify-center min-w-[70px] py-3 rounded-2xl border-2 transition-all shrink-0 ${
                        isSelected
                          ? "border-[#85662A] gold-gradient text-white shadow-md scale-105"
                          : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {item.dayName}
                      </span>
                      <span className="text-xl font-bold font-serif my-0.5">
                        {item.dayNumber}
                      </span>
                      <span className="text-[10px] font-medium opacity-80">
                        {item.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Available Time Slots */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Pilih Jam Janji Temu:
                </label>
                {loadingSlots && (
                  <span className="text-[11px] text-[#85662A] animate-pulse">
                    Memeriksa ketersediaan slot...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {AVAILABLE_TIME_SLOTS.map((time) => {
                  const isSelected = selectedTimeSlot === time;
                  const slotStatus = getSlotStatus(time);
                  const isFull = !slotStatus.isAvailable;

                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={isFull}
                      onClick={() => setSelectedTimeSlot(time)}
                      className={`relative py-3 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center min-h-[58px] ${
                        isFull
                          ? "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed opacity-60"
                          : isSelected
                          ? "gold-gradient text-white border-transparent shadow-md scale-105"
                          : "bg-white text-zinc-800 border-zinc-200 hover:border-[#C9A96E]"
                      }`}
                    >
                      <span className="text-xs">{time} WIB</span>
                      {isFull ? (
                        <span className="text-[9px] font-semibold text-rose-500 mt-0.5 tracking-tight">
                          {slotStatus.label}
                        </span>
                      ) : slotStatus.label ? (
                        <span
                          className={`text-[9px] mt-0.5 font-medium tracking-tight ${
                            isSelected ? "text-amber-100" : "text-amber-600"
                          }`}
                        >
                          {slotStatus.label}
                        </span>
                      ) : (
                        <span className="text-[9px] opacity-60 mt-0.5 font-normal">Tersedia</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Real-time Estimated Finish Banner */}
              {selectedTimeSlot && (
                <div className="mt-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#C9A96E]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#85662A]" />
                    <span className="text-zinc-700 font-medium">Estimasi Durasi Perawatan:</span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="font-serif font-bold text-sm text-[#85662A]">
                      {selectedTimeSlot} – {calculateEndTime(selectedTimeSlot, totalDuration)} WIB
                    </span>
                    <span className="text-[11px] text-zinc-500 block">
                      (Total {totalDuration} menit pengerjaan menyeluruh)
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 rounded-full border border-zinc-300 text-zinc-700 text-xs font-bold hover:bg-zinc-100 transition"
              >
                Kembali
              </button>
              <button
                disabled={!selectedTimeSlot}
                onClick={() => setCurrentStep(5)}
                className="gold-gradient disabled:opacity-50 text-white px-8 py-3 rounded-full font-bold text-sm shadow-md hover:scale-105 transition flex items-center gap-2"
              >
                <span>Lanjut Pengisian Data</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: DATA DIRI & METODE BAYAR ================= */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center max-w-lg mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
                Lengkapi Data &amp; Konfirmasi
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Data Anda digunakan untuk konfirmasi jadwal dan reservasi privat
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {/* Form Input */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1">
                    Nama Lengkap <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Contoh: Amanda Permata"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1">
                    Nomor WhatsApp <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="Contoh: 081234567890"
                      value={customerPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        phoneError
                          ? "border-rose-400 focus:ring-rose-400 bg-rose-50/20"
                          : "border-zinc-300 focus:ring-[#C9A96E]"
                      }`}
                      required
                    />
                  </div>
                  {phoneError ? (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{phoneError}</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-zinc-500 mt-1">
                      *Notifikasi dan link konfirmasi reservasi akan dikirim ke nomor WhatsApp ini (08... / 628...)
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1">
                    Email <span className="text-zinc-400 font-normal">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1">
                    Catatan Khusus / Riwayat Alergi
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Minta warna rambut agak ash, kulit agak sensitif..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                  />
                </div>

                {/* Metode Pembayaran */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-2">
                    Metode Pembayaran:
                  </label>
                  <div className="space-y-2">
                    <label
                      onClick={() => setPaymentMethod("PAY_AT_SALON")}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                        paymentMethod === "PAY_AT_SALON"
                          ? "border-[#85662A] bg-[#FAF7F2]"
                          : "border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === "PAY_AT_SALON"}
                        onChange={() => {}}
                        className="text-[#85662A]"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-xs text-zinc-900">Bayar di Salon (Pay at Salon)</div>
                        <div className="text-[11px] text-zinc-500">Bayar saat kedatangan di kasir dengan Cash/Kartu/QRIS</div>
                      </div>
                    </label>

                    <label
                      onClick={() => setPaymentMethod("QRIS_INSTANT")}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                        paymentMethod === "QRIS_INSTANT"
                          ? "border-[#85662A] bg-[#FAF7F2]"
                          : "border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === "QRIS_INSTANT"}
                        onChange={() => {}}
                        className="text-[#85662A]"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-xs text-zinc-900">QRIS Instan (BCA, GoPay, OVO, ShopeePay)</div>
                        <div className="text-[11px] text-zinc-500">Pembayaran online langsung lunas</div>
                      </div>
                    </label>

                    <label
                      onClick={() => setPaymentMethod("DEPOSIT_50")}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                        paymentMethod === "DEPOSIT_50"
                          ? "border-[#85662A] bg-[#FAF7F2]"
                          : "border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === "DEPOSIT_50"}
                        onChange={() => {}}
                        className="text-[#85662A]"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-xs text-zinc-900">Deposit Kunci Slot (DP 50%)</div>
                        <div className="text-[11px] text-zinc-500">Bayar {formatRupiah(totalAmount * 0.5)}, sisa di salon</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Order Summary Card */}
              <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#C9A96E]/30 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-zinc-900 pb-3 border-b border-[#C9A96E]/20 flex items-center justify-between">
                    <span>Ringkasan Reservasi</span>
                    <Sparkles className="w-4 h-4 text-[#C9A96E]" />
                  </h3>

                  <div className="py-4 space-y-3 text-xs border-b border-[#C9A96E]/20">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Cabang:</span>
                      <strong className="text-zinc-900">{currentBranch.name.replace("Aura Salon & Spa - ", "")}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Tanggal:</span>
                      <strong className="text-zinc-900">{selectedDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Waktu Treatment:</span>
                      <strong className="text-zinc-900">
                        {selectedTimeSlot} – {calculateEndTime(selectedTimeSlot, totalDuration)} WIB
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Estimasi Durasi:</span>
                      <strong className="text-[#85662A] font-semibold">{totalDuration} Menit</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Stylist:</span>
                      <strong className="text-zinc-900">
                        {selectedStaffId === "any"
                          ? "Rekomendasi Salon"
                          : availableStaff.find((s) => s.id === selectedStaffId)?.name}
                      </strong>
                    </div>
                  </div>

                  <div className="py-4 space-y-2">
                    <span className="text-xs font-bold text-zinc-700 block">Layanan Pilihan:</span>
                    {selectedServices.map((s) => (
                      <div key={s.id} className="flex justify-between text-xs">
                        <span className="text-zinc-600 line-clamp-1">{s.name}</span>
                        <span className="font-semibold text-zinc-900 shrink-0 ml-2">
                          {formatRupiah(s.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#C9A96E]/20">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-zinc-800">Total Pembayaran:</span>
                    <span className="font-serif text-2xl font-bold text-[#85662A]">
                      {formatRupiah(totalAmount)}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="px-5 py-3 rounded-full border border-zinc-300 text-zinc-700 text-xs font-bold hover:bg-zinc-100 transition"
                    >
                      Kembali
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmitBooking}
                      className="flex-1 gold-gradient disabled:opacity-50 text-white py-3 rounded-full font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>Memproses Booking...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Konfirmasi &amp; Reservasi</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 6: SUKSES KONFIRMASI ================= */}
        {currentStep === 6 && createdBooking && (
          <div className="py-8 space-y-8 text-center animate-in zoom-in-95 duration-400">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-200">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#85662A] font-bold">
                Reservasi Berhasil Dibuat
              </span>
              <h2 className="font-serif text-3xl font-bold text-zinc-900 mt-1">
                Terima Kasih, {createdBooking.customerName}!
              </h2>
              <p className="text-sm text-zinc-600 mt-2 max-w-md mx-auto">
                Janji temu Anda telah dicatat di sistem kami. Silakan klik tombol di bawah untuk konfirmasi instan ke WhatsApp cabang.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="max-w-md mx-auto bg-[#FAF7F2] rounded-3xl p-6 border-2 border-[#C9A96E]/40 shadow-xl text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#85662A] text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                {createdBooking.status}
              </div>

              <div className="font-serif text-xs text-zinc-400 uppercase tracking-widest">
                Kode Booking Anda
              </div>
              <div className="font-serif text-2xl font-bold text-[#85662A] tracking-wider mb-4">
                {createdBooking.code}
              </div>

              <div className="space-y-2.5 text-xs text-zinc-700 border-t border-[#C9A96E]/20 pt-4">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Cabang:</span>
                  <strong>{createdBooking.branchName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Jadwal:</span>
                  <strong>
                    {createdBooking.date} • {createdBooking.timeSlot} –{" "}
                    {calculateEndTime(createdBooking.timeSlot, createdBooking.totalDurationMinutes)} WIB
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Stylist:</span>
                  <strong>{createdBooking.staffName || "Terapis Pilihan"}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Total Biaya:</span>
                  <strong className="text-emerald-700 font-bold">{formatRupiah(createdBooking.totalAmount)}</strong>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="max-w-md mx-auto space-y-3">
              {/* WhatsApp Bridge Button (Matching Blush N Curls) */}
              <div className="space-y-1.5">
                <a
                  href={generateWhatsAppBookingUrl(createdBooking, currentBranch.whatsapp || "6285217288084")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#15803D] hover:bg-[#166534] text-white py-4 rounded-full font-bold text-sm shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Kirim Konfirmasi ke WhatsApp Cabang</span>
                </a>
                <p className="text-[11px] text-zinc-500 text-center">
                  *Terhubung langsung ke WhatsApp Official Salon (+62 852-1728-8084)
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-3 rounded-full border border-zinc-300 text-zinc-700 text-xs font-bold hover:bg-zinc-100 flex items-center justify-center gap-1.5 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedServices([]);
                    setCurrentStep(1);
                    setCreatedBooking(null);
                  }}
                  className="flex-1 py-3 rounded-full border border-[#85662A] text-[#85662A] text-xs font-bold hover:bg-[#85662A] hover:text-white transition"
                >
                  Booking Jadwal Baru
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

