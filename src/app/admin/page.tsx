"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
  Clock3,
  Search,
  Filter,
  Plus,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  Building,
  DollarSign,
  TrendingUp,
  X,
  Check,
  RotateCcw,
  Lock,
  Unlock,
  Download,
  Printer,
  ShieldCheck,
  Scissors
} from "lucide-react";
import { BRANCHES, SERVICES, STAFF_MEMBERS } from "@/data/salon-data";
import { Booking, AppointmentStatus, BranchId, ServiceItem } from "@/types/salon";
import { formatRupiah, calculateEndTime } from "@/lib/utils";
import { generateStaffToCustomerWhatsAppUrl } from "@/lib/whatsapp";

export default function AdminPage() {
  // Security PIN lock state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);

  // Data bookings & filter states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal Walk-In POS state
  const [walkInModalOpen, setWalkInModalOpen] = useState<boolean>(false);
  const [walkInName, setWalkInName] = useState<string>("");
  const [walkInPhone, setWalkInPhone] = useState<string>("");
  const [walkInBranch, setWalkInBranch] = useState<BranchId>("senopati");
  const [walkInSelectedServices, setWalkInSelectedServices] = useState<ServiceItem[]>([]);
  const [walkInStaffId, setWalkInStaffId] = useState<string>("");

  // Receipt Modal state
  const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);

  // Check session PIN on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("admin_aura_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "123456") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_aura_auth", "true");
      setPinError(null);
    } else {
      setPinError("PIN Keamanan salah. Silakan coba kembali (Demo PIN: 123456).");
    }
  };

  const handleLockAdmin = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_aura_auth");
    setPinInput("");
  };

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const url =
        selectedBranch === "all"
          ? "/api/bookings"
          : `/api/bookings?branchId=${selectedBranch}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [selectedBranch, isAuthenticated]);

  // Handle status update
  const handleUpdateStatus = async (id: string, newStatus: AppointmentStatus) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (e) {
      alert("Gagal update status.");
    }
  };

  // Submit Walk-in POS
  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName || !walkInPhone || walkInSelectedServices.length === 0) {
      alert("Mohon lengkapi nama, nomor telepon, dan pilih minimal 1 layanan.");
      return;
    }

    const branchObj = BRANCHES.find((b) => b.id === walkInBranch);
    const staffObj = STAFF_MEMBERS.find((s) => s.id === walkInStaffId);
    const totalAmount = walkInSelectedServices.reduce((sum, s) => sum + s.price, 0);
    const totalDuration = walkInSelectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

    const now = new Date();
    const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const payload = {
      branchId: walkInBranch,
      branchName: branchObj?.name || "Aura Salon",
      staffId: walkInStaffId || undefined,
      staffName: staffObj?.name || "Staff Walk-In",
      customerName: walkInName,
      customerPhone: walkInPhone,
      date: now.toISOString().split("T")[0],
      timeSlot: currentTimeStr,
      selectedServices: walkInSelectedServices,
      totalAmount,
      totalDurationMinutes: totalDuration,
      paymentMethod: "PAY_AT_SALON",
      paymentStatus: "PAID",
      status: "IN_SERVICE",
      notes: "Pelanggan Walk-In Kasir Langsung",
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setWalkInModalOpen(false);
        setWalkInName("");
        setWalkInPhone("");
        setWalkInSelectedServices([]);
        fetchBookings();
        // Prompt to view / print receipt
        setReceiptBooking(data.data);
      }
    } catch (err) {
      alert("Gagal menyimpan transaksi walk-in.");
    }
  };

  // Filtered Bookings logic
  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split("T")[0];

  const filteredBookings = bookings.filter((b) => {
    // Search query
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      b.customerName.toLowerCase().includes(q) ||
      b.code.toLowerCase().includes(q) ||
      b.customerPhone.includes(q);

    // Status filter
    const matchStatus = statusFilter === "all" || b.status === statusFilter;

    // Date filter
    let matchDate = true;
    if (dateFilter === "today") {
      matchDate = b.date === todayStr;
    } else if (dateFilter === "tomorrow") {
      matchDate = b.date === tomorrowStr;
    } else if (dateFilter !== "all") {
      matchDate = b.date === dateFilter;
    }

    return matchSearch && matchStatus && matchDate;
  });

  // Calculate metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const inServiceCount = bookings.filter((b) => b.status === "IN_SERVICE").length;
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;
  const cancelledCount = bookings.filter((b) => b.status === "CANCELLED").length;

  // Export CSV
  const handleExportCSV = () => {
    if (filteredBookings.length === 0) {
      alert("Tidak ada data reservasi untuk diexport.");
      return;
    }

    const headers = [
      "Kode Reservasi",
      "Nama Pelanggan",
      "Nomor WhatsApp",
      "Cabang",
      "Tanggal",
      "Jam Mulai",
      "Estimasi Selesai",
      "Layanan",
      "Terapis / Stylist",
      "Total Biaya (IDR)",
      "Metode Pembayaran",
      "Status Pembayaran",
      "Status Reservasi",
      "Catatan",
    ];

    const rows = filteredBookings.map((b) => {
      const srvList = b.selectedServices.map((s) => s.name).join(" + ");
      const endTime = calculateEndTime(b.timeSlot, b.totalDurationMinutes);
      return [
        `"${b.code}"`,
        `"${b.customerName.replace(/"/g, '""')}"`,
        `"'${b.customerPhone}"`, // Prepend ' so spreadsheet displays 08...
        `"${b.branchName.replace(/"/g, '""')}"`,
        `"${b.date}"`,
        `"${b.timeSlot} WIB"`,
        `"${endTime} WIB"`,
        `"${srvList.replace(/"/g, '""')}"`,
        `"${(b.staffName || "Rekomendasi").replace(/"/g, '""')}"`,
        b.totalAmount,
        `"${b.paymentMethod}"`,
        `"${b.paymentStatus}"`,
        `"${b.status}"`,
        `"${(b.notes || "").replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `laporan-reservasi-aura-curls-${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ================= PIN LOCK SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#121214] flex flex-col items-center justify-center p-4 text-zinc-100">
        <div className="max-w-md w-full bg-[#1c1c20] p-8 rounded-3xl border border-[#C9A96E]/30 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full gold-gradient text-white mx-auto flex items-center justify-center shadow-lg shadow-[#85662A]/40">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96E]">
              Protected Backoffice &amp; POS
            </span>
            <h1 className="font-serif text-2xl font-bold text-white mt-1">
              Aura &amp; Curls Kasir
            </h1>
            <p className="text-xs text-zinc-400 mt-2">
              Masukkan 6-digit PIN keamanan salon untuk mengakses data reservasi &amp; keuangan kasir.
            </p>
          </div>

          <form onSubmit={handleUnlockPin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/[^0-9]/g, ""));
                  setPinError(null);
                }}
                placeholder="• • • • • •"
                className="w-full text-center tracking-[0.5em] text-2xl py-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A96E] font-mono"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 flex items-center justify-center gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={pinInput.length < 6}
              className="w-full gold-gradient disabled:opacity-50 text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Buka Akses Backoffice</span>
            </button>
          </form>

          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span className="bg-zinc-800/80 px-2.5 py-1 rounded-md text-[11px] text-[#C9A96E] font-mono">
              Demo PIN: <strong>123456</strong>
            </span>
            <Link
              href="/"
              className="text-zinc-400 hover:text-white transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ke Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN BACKOFFICE DASHBOARD =================
  return (
    <div className="min-h-screen bg-[#F5F2EB] text-zinc-900">
      {/* Top Bar */}
      <header className="bg-[#121214] text-white py-4 px-6 border-b border-zinc-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Ke Website
            </Link>
            <span className="text-zinc-600">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="font-serif font-bold text-lg text-white">
                Aura &amp; Curls <span className="text-[#C9A96E]">Backoffice &amp; POS</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setWalkInModalOpen(true)}
              className="gold-gradient text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-105 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Input Walk-In / Kasir</span>
            </button>

            <button
              onClick={handleLockAdmin}
              title="Kunci Akses Backoffice"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Kunci</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-2 text-xs font-semibold">
              <span>Total Booking</span>
              <Calendar className="w-4 h-4 text-[#85662A]" />
            </div>
            <div className="font-serif text-2xl font-bold text-zinc-900">
              {bookings.length}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">Semua reservasi tercatat</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-2 text-xs font-semibold">
              <span>Estimasi Omzet</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-emerald-700">
              {formatRupiah(totalRevenue)}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">Total nilai perawatan</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-2 text-xs font-semibold">
              <span>Sedang Dilayani</span>
              <Clock3 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-blue-700">
              {inServiceCount} Kursi
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">Terapis sedang aktif</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-2 text-xs font-semibold">
              <span>Perlu Konfirmasi</span>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-amber-600">
              {pendingCount} Janji Temu
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">Menunggu staff WhatsApp</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Cabang & Date Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Cabang:
              </span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="px-3 py-2 rounded-xl border border-zinc-300 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
              >
                <option value="all">Semua Cabang (3 Lokasi)</option>
                {BRANCHES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name.replace("Aura Salon & Spa - ", "")}
                  </option>
                ))}
              </select>

              {/* Date Filter Buttons */}
              <div className="flex items-center bg-zinc-100 p-1 rounded-xl text-xs font-semibold text-zinc-600">
                <button
                  type="button"
                  onClick={() => setDateFilter("all")}
                  className={`px-3 py-1 rounded-lg transition ${
                    dateFilter === "all"
                      ? "bg-white text-zinc-900 shadow-sm font-bold"
                      : "hover:text-zinc-900"
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setDateFilter("today")}
                  className={`px-3 py-1 rounded-lg transition ${
                    dateFilter === "today"
                      ? "bg-white text-zinc-900 shadow-sm font-bold"
                      : "hover:text-zinc-900"
                  }`}
                >
                  Hari Ini
                </button>
                <button
                  type="button"
                  onClick={() => setDateFilter("tomorrow")}
                  className={`px-3 py-1 rounded-lg transition ${
                    dateFilter === "tomorrow"
                      ? "bg-white text-zinc-900 shadow-sm font-bold"
                      : "hover:text-zinc-900"
                  }`}
                >
                  Besok
                </button>
              </div>

              <button
                onClick={fetchBookings}
                className="p-2 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-600 text-xs"
                title="Refresh Data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input & CSV Export Button */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama, kode, HP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                />
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-1.5 transition shrink-0 shadow-sm"
                title="Export Laporan ke File Excel / CSV"
              >
                <Download className="w-3.5 h-3.5 text-[#C9A96E]" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="pt-2 border-t border-zinc-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mr-1 shrink-0">
              Status:
            </span>
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === "all"
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Semua ({bookings.length})
            </button>
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === "PENDING"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter("CONFIRMED")}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === "CONFIRMED"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              Dikonfirmasi ({confirmedCount})
            </button>
            <button
              onClick={() => setStatusFilter("IN_SERVICE")}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === "IN_SERVICE"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-blue-50 text-blue-800 hover:bg-blue-100"
              }`}
            >
              Sedang Dilayani ({inServiceCount})
            </button>
            <button
              onClick={() => setStatusFilter("COMPLETED")}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === "COMPLETED"
                  ? "bg-zinc-600 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Selesai ({completedCount})
            </button>
            <button
              onClick={() => setStatusFilter("CANCELLED")}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === "CANCELLED"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-rose-50 text-rose-800 hover:bg-rose-100"
              }`}
            >
              Batal ({cancelledCount})
            </button>
          </div>
        </div>

        {/* Table of Bookings */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-serif font-bold text-base text-zinc-900">
              Daftar Janji Temu Pelanggan ({filteredBookings.length})
            </h2>
            <span className="text-xs text-zinc-500">Urutan teranyar di atas</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-zinc-400 text-sm">
              Memuat data reservasi...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-zinc-400 text-sm">
              Tidak ada data reservasi yang cocok dengan filter yang dipilih.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-zinc-600 font-bold uppercase tracking-wider border-b border-zinc-200">
                  <tr>
                    <th className="py-3.5 px-4">Kode &amp; Pelanggan</th>
                    <th className="py-3.5 px-4">Cabang</th>
                    <th className="py-3.5 px-4">Jadwal</th>
                    <th className="py-3.5 px-4">Layanan &amp; Stylist</th>
                    <th className="py-3.5 px-4">Total &amp; Bayar</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Aksi Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredBookings.map((b) => {
                    const cleanPhone = b.customerPhone.replace(/[^0-9]/g, "");
                    const endTime = calculateEndTime(b.timeSlot, b.totalDurationMinutes);
                    const waText = encodeURIComponent(
                      `Halo Kak ${b.customerName}, kami dari Aura & Curls ingin mengonfirmasi janji temu Anda untuk tanggal ${b.date} pukul ${b.timeSlot} – ${endTime} WIB (Kode: ${b.code}). Apakah jadwal sudah sesuai?`
                    );

                    return (
                      <tr key={b.id} className="hover:bg-zinc-50 transition">
                        {/* Kode & Customer */}
                        <td className="py-4 px-4 align-top">
                          <span className="font-mono font-bold text-xs text-[#85662A] block">
                            {b.code}
                          </span>
                          <span className="font-bold text-sm text-zinc-900 block mt-0.5">
                            {b.customerName}
                          </span>
                          <span className="text-zinc-500 block text-[11px]">
                            {b.customerPhone}
                          </span>
                          {b.notes && (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded inline-block mt-1 font-medium">
                              Note: {b.notes}
                            </span>
                          )}
                        </td>

                        {/* Cabang */}
                        <td className="py-4 px-4 align-top">
                          <span className="font-semibold text-zinc-800">
                            {b.branchName.replace("Aura Salon & Spa - ", "")}
                          </span>
                        </td>

                        {/* Tanggal & Jam */}
                        <td className="py-4 px-4 align-top">
                          <span className="font-bold text-zinc-900 block">{b.date}</span>
                          <span className="text-zinc-700 font-semibold text-xs">
                            {b.timeSlot} – {endTime} WIB
                          </span>
                          <span className="text-[10px] text-zinc-400 block mt-0.5">
                            Durasi: {b.totalDurationMinutes} mnt
                          </span>
                        </td>

                        {/* Layanan & Stylist */}
                        <td className="py-4 px-4 align-top">
                          <div className="space-y-1">
                            {b.selectedServices.map((s, idx) => (
                              <div key={idx} className="font-medium text-zinc-800 text-[11px]">
                                • {s.name}
                              </div>
                            ))}
                          </div>
                          <div className="text-[11px] text-[#85662A] mt-1 font-semibold">
                            Terapis: {b.staffName || "Rekomendasi Salon"}
                          </div>
                        </td>

                        {/* Biaya & Metode */}
                        <td className="py-4 px-4 align-top">
                          <span className="font-serif font-bold text-sm text-zinc-900 block">
                            {formatRupiah(b.totalAmount)}
                          </span>
                          <span className="text-[10px] text-zinc-500 block">
                            {b.paymentMethod === "PAY_AT_SALON"
                              ? "Bayar di Kasir"
                              : b.paymentMethod === "QRIS_INSTANT"
                              ? "QRIS Lunas"
                              : b.paymentMethod}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 align-top">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase inline-block ${
                              b.status === "CONFIRMED"
                                ? "bg-emerald-100 text-emerald-800"
                                : b.status === "IN_SERVICE"
                                ? "bg-blue-100 text-blue-800"
                                : b.status === "COMPLETED"
                                ? "bg-zinc-200 text-zinc-800"
                                : b.status === "CANCELLED"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 align-top text-right">
                          <div className="flex flex-col items-end gap-1.5">
                            {/* WhatsApp Direct Chat with Formatted Template */}
                            <a
                              href={generateStaffToCustomerWhatsAppUrl(b)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm transition"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>

                            {/* Print Receipt Slip */}
                            <button
                              type="button"
                              onClick={() => setReceiptBooking(b)}
                              className="px-2.5 py-1 rounded-full border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-semibold text-[10px] flex items-center gap-1 transition"
                            >
                              <Printer className="w-3 h-3 text-[#85662A]" />
                              <span>Struk POS</span>
                            </button>

                            {/* Status Change Dropdown */}
                            <select
                              value={b.status}
                              onChange={(e) =>
                                handleUpdateStatus(b.id, e.target.value as AppointmentStatus)
                              }
                              className="text-[10px] font-bold px-2 py-1 rounded border border-zinc-300 bg-white"
                            >
                              <option value="PENDING">Set: Pending</option>
                              <option value="CONFIRMED">Set: Dikonfirmasi</option>
                              <option value="IN_SERVICE">Set: Sedang Dilayani</option>
                              <option value="COMPLETED">Set: Selesai</option>
                              <option value="CANCELLED">Set: Batal</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ================= MODAL WALK-IN POS KASIR ================= */}
      {walkInModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <div>
                <h3 className="font-serif font-bold text-xl text-zinc-900">
                  Input Pelanggan Walk-In (POS Kasir)
                </h3>
                <p className="text-xs text-zinc-500">
                  Catat transaksi langsung untuk pelanggan yang datang ke salon
                </p>
              </div>
              <button
                onClick={() => setWalkInModalOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="py-4 space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">
                  Pilih Cabang Salon:
                </label>
                <select
                  value={walkInBranch}
                  onChange={(e) => setWalkInBranch(e.target.value as BranchId)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs font-medium"
                >
                  {BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">
                    Nama Pelanggan:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ibu Rina"
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">
                    Nomor WhatsApp:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081298765432"
                    value={walkInPhone}
                    onChange={(e) => setWalkInPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">
                  Stylist yang Melayani (Opsional):
                </label>
                <select
                  value={walkInStaffId}
                  onChange={(e) => setWalkInStaffId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs"
                >
                  <option value="">-- Stylist yang Tersedia --</option>
                  {STAFF_MEMBERS.filter((s) => s.branchId === walkInBranch).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.roleTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">
                  Pilih Layanan Perawatan:
                </label>
                <div className="max-h-48 overflow-y-auto border border-zinc-200 rounded-xl p-2 space-y-1">
                  {SERVICES.map((srv) => {
                    const isChecked = walkInSelectedServices.some((s) => s.id === srv.id);
                    return (
                      <label
                        key={srv.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                          isChecked ? "bg-[#FAF7F2] font-bold text-[#85662A]" : "hover:bg-zinc-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setWalkInSelectedServices(
                                  walkInSelectedServices.filter((s) => s.id !== srv.id)
                                );
                              } else {
                                setWalkInSelectedServices([...walkInSelectedServices, srv]);
                              }
                            }}
                          />
                          <span>{srv.name}</span>
                        </div>
                        <span className="shrink-0">{formatRupiah(srv.price)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#C9A96E]/30 flex justify-between items-center text-xs">
                <span>Total Biaya Transaksi:</span>
                <strong className="font-serif text-base text-[#85662A]">
                  {formatRupiah(
                    walkInSelectedServices.reduce((sum, s) => sum + s.price, 0)
                  )}
                </strong>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setWalkInModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-zinc-300 font-bold text-zinc-600 hover:bg-zinc-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="gold-gradient text-white px-6 py-2 rounded-full font-bold shadow-md hover:scale-105 transition"
                >
                  Simpan &amp; Mulai Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL CETAK STRUK POS ================= */}
      {receiptBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <span className="font-serif font-bold text-sm text-zinc-800 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-[#85662A]" />
                Pratinjau Struk Kasir
              </span>
              <button
                onClick={() => setReceiptBooking(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thermal Receipt Paper */}
            <div
              id="printable-receipt"
              className="my-4 p-5 bg-[#FAF7F2] rounded-2xl border border-dashed border-[#C9A96E]/40 font-mono text-[11px] text-zinc-800 space-y-3"
            >
              <div className="text-center border-b border-dashed border-zinc-300 pb-3">
                <h4 className="font-serif font-bold text-sm text-zinc-900 tracking-wider">
                  AURA &amp; CURLS
                </h4>
                <p className="text-[10px] text-zinc-500">Luxury Beauty Salon &amp; Spa</p>
                <p className="text-[10px] text-[#85662A] font-semibold mt-1">
                  {receiptBooking.branchName}
                </p>
              </div>

              <div className="space-y-1 text-zinc-600 border-b border-dashed border-zinc-300 pb-2">
                <div className="flex justify-between">
                  <span>No. Struk:</span>
                  <span className="font-bold text-zinc-900">{receiptBooking.code}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu:</span>
                  <span>{receiptBooking.date} {receiptBooking.timeSlot} WIB</span>
                </div>
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span className="font-bold text-zinc-900">{receiptBooking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Terapis:</span>
                  <span>{receiptBooking.staffName || "Staff Salon"}</span>
                </div>
              </div>

              <div className="space-y-1 border-b border-dashed border-zinc-300 pb-2">
                {receiptBooking.selectedServices.map((srv, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="truncate max-w-[170px]">{srv.name}</span>
                    <span className="font-semibold">{formatRupiah(srv.price)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs font-bold text-zinc-900">
                  <span>TOTAL BIAYA:</span>
                  <span className="text-[#85662A]">{formatRupiah(receiptBooking.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>Metode:</span>
                  <span>{receiptBooking.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>Status:</span>
                  <span className="font-bold text-emerald-700">{receiptBooking.paymentStatus}</span>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-dashed border-zinc-300 text-[10px] text-zinc-400">
                <p>Terima kasih atas kunjungan Anda.</p>
                <p>Silakan simpan struk ini sebagai bukti reservasi.</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReceiptBooking(null)}
                className="flex-1 py-2.5 rounded-full border border-zinc-300 text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 gold-gradient text-white py-2.5 rounded-full text-xs font-bold shadow-md hover:scale-105 transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Struk</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
