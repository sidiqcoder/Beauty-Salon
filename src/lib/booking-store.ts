import { Booking, AppointmentStatus } from "@/types/salon";
import { 
  getCloudBookings, 
  saveCloudBooking, 
  updateCloudBookingStatus 
} from "@/lib/db";

// In-memory initial seed bookings (as fallback when no database connection is supplied)
let bookingsCache: Booking[] = [
  {
    id: "b-101",
    code: "AUR-202610-8801",
    branchId: "senopati",
    branchName: "Aura Salon & Spa - Senopati",
    staffId: "staff-1",
    staffName: "Clarissa Dewi",
    customerName: "Jessica Mila",
    customerPhone: "081298765432",
    customerEmail: "jessica.m@example.com",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "11:00",
    selectedServices: [
      {
        id: "hair-1",
        categoryId: "hair",
        name: "Signature Balayage & Glossing (Ammonia-Free)",
        slug: "signature-balayage",
        description: "Teknik pewarnaan gradasi rambut alami Eropa...",
        price: 1350000,
        durationMinutes: 180,
        isOrganic: true,
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80",
      },
    ],
    totalAmount: 1350000,
    totalDurationMinutes: 180,
    paymentMethod: "PAY_AT_SALON",
    paymentStatus: "UNPAID",
    status: "CONFIRMED",
    notes: "Minta warna tone agak ash caramel",
    createdAt: new Date().toISOString(),
  },
  {
    id: "b-102",
    code: "AUR-202610-8802",
    branchId: "senopati",
    branchName: "Aura Salon & Spa - Senopati",
    staffId: "staff-2",
    staffName: "Nadine Putri",
    customerName: "Carissa Putri",
    customerPhone: "081187654321",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "14:30",
    selectedServices: [
      {
        id: "facial-1",
        categoryId: "facial",
        name: "SubliMY Cromoaroma Italian Advance Facial",
        slug: "cromoaroma-advance-facial",
        description: "Treatment facial premium Italia...",
        price: 850000,
        durationMinutes: 90,
        isOrganic: true,
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "nail-1",
        categoryId: "nails",
        name: "Russian Dry Manicure + Gel Polish",
        slug: "russian-manicure-gel",
        description: "Teknik pembersihan kutikula presisi...",
        price: 380000,
        durationMinutes: 90,
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80",
      },
    ],
    totalAmount: 1230000,
    totalDurationMinutes: 180,
    paymentMethod: "QRIS_INSTANT",
    paymentStatus: "PAID",
    status: "IN_SERVICE",
    notes: "Ada riwayat kulit sensitif kemerahan",
    createdAt: new Date().toISOString(),
  },
  {
    id: "b-103",
    code: "AUR-202610-8803",
    branchId: "pik",
    branchName: "Aura Salon & Spa - Pantai Indah Kapuk",
    staffId: "staff-3",
    staffName: "Jessica Tan",
    customerName: "Prilly Latuconsina",
    customerPhone: "081399887766",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "16:00",
    selectedServices: [
      {
        id: "nail-1",
        categoryId: "nails",
        name: "Russian Dry Manicure + Gel Polish",
        slug: "russian-manicure-gel",
        description: "Teknik pembersihan kutikula presisi...",
        price: 380000,
        durationMinutes: 90,
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80",
      },
    ],
    totalAmount: 380000,
    totalDurationMinutes: 90,
    paymentMethod: "PAY_AT_SALON",
    paymentStatus: "UNPAID",
    status: "PENDING",
    createdAt: new Date().toISOString(),
  },
];

export async function getBookings(branchId?: string, date?: string): Promise<Booking[]> {
  // 1. Try cloud database first if configured
  const cloudList = await getCloudBookings(branchId, date);
  if (cloudList !== null && cloudList.length > 0) {
    return cloudList;
  }

  // 2. Fallback to in-memory cache
  let list = [...bookingsCache];
  if (branchId) {
    list = list.filter((b) => b.branchId === branchId);
  }
  if (date) {
    list = list.filter((b) => b.date === date);
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addBooking(booking: Booking): Promise<Booking> {
  // 1. Try saving to cloud database
  const savedCloud = await saveCloudBooking(booking);

  // 2. Also keep in-memory sync
  bookingsCache.unshift(booking);

  return savedCloud || booking;
}

export async function updateBookingStatus(id: string, status: AppointmentStatus): Promise<Booking | null> {
  // 1. Try updating cloud database
  await updateCloudBookingStatus(id, status);

  // 2. Also update in-memory cache
  const index = bookingsCache.findIndex((b) => b.id === id);
  if (index !== -1) {
    bookingsCache[index].status = status;
    return bookingsCache[index];
  }

  return null;
}
