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
  RotateCcw
} from "lucide-react";
import { BRANCHES, SERVICES, STAFF_MEMBERS } from "@/data/salon-data";
import { Booking, AppointmentStatus, BranchId, ServiceItem } from "@/types/salon";
import { formatRupiah } from "@/lib/utils";

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal Walk-In POS state
  const [walkInModalOpen, setWalkInModalOpen] = useState<boolean>(false);
  const [walkInName, setWalkInName] = useState<string>("");
  const [walkInPhone, setWalkInPhone] = useState<string>("");
  const [walkInBranch, setWalkInBranch] = useState<BranchId>("senopati");
  const [walkInSelectedServices, setWalkInSelectedServices] = useState<ServiceItem[]>([]);
  const [walkInStaffId, setWalkInStaffId] = useState<string>("");

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
    fetchBookings();
  }, [selectedBranch]);

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

  // Submit Walk-in
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
      }
    } catch (err) {
      alert("Gagal menyimpan transaksi walk-in.");
    }
  };

  // Filtered by search query
  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      b.customerName.toLowerCase().includes(q) ||
      b.code.toLowerCase().includes(q) ||
      b.customerPhone.includes(q)
    );
  });

  // Calculate metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const inServiceCount = bookings.filter((b) => b.status === "IN_SERVICE").length;
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;

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
        <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Cabang:</span>
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

            <button
              onClick={fetchBookings}
              className="p-2 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-600 text-xs"
              title="Refresh Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, kode, nomor HP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
            />
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
              Tidak ada data reservasi yang cocok.
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
                    const waText = encodeURIComponent(
                      `Halo Kak ${b.customerName}, kami dari Aura & Curls ingin mengonfirmasi janji temu Anda untuk tanggal ${b.date} pukul ${b.timeSlot} WIB (Kode: ${b.code}). Apakah jadwal sudah sesuai?`
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
                          <span className="text-zinc-500 font-semibold text-xs">
                            {b.timeSlot} WIB
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
                            {b.paymentMethod === "PAY_AT_SALON" ? "Bayar di Kasir" : b.paymentMethod}
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
                            {/* WhatsApp Direct Chat */}
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${waText}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm transition"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>Chat WhatsApp</span>
                            </a>

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
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Pilih Cabang:</label>
                <select
                  value={walkInBranch}
                  onChange={(e) => setWalkInBranch(e.target.value as BranchId)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 font-semibold"
                >
                  {BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Nama Pelanggan:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jessica"
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">No. WhatsApp:</label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081298765432"
                    value={walkInPhone}
                    onChange={(e) => setWalkInPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Pilih Stylist / Terapis:</label>
                <select
                  value={walkInStaffId}
                  onChange={(e) => setWalkInStaffId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 font-semibold"
                >
                  <option value="">-- Rekomendasi / Siap Melayani --</option>
                  {STAFF_MEMBERS.filter((s) => s.branchId === walkInBranch).map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.roleTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-2">Pilih Layanan Treatment:</label>
                <div className="max-h-48 overflow-y-auto space-y-2 border border-zinc-200 rounded-xl p-2">
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
    </div>
  );
}

