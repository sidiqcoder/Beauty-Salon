export type BranchId = "senopati" | "pik" | "bsd";

export interface Branch {
  id: BranchId;
  name: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string; // international format e.g. 6281234567890
  openHours: string;
  image: string;
  mapEmbedUrl?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  durationMinutes: number;
  isOrganic?: boolean;
  isBestSeller?: boolean;
  image: string;
  badge?: string;
}

export interface StaffStylist {
  id: string;
  branchId: BranchId;
  name: string;
  roleTitle: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  specialties: string[];
}

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_SERVICE"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentMethod =
  | "PAY_AT_SALON"
  | "QRIS_INSTANT"
  | "BANK_TRANSFER"
  | "DEPOSIT_50";

export type PaymentStatus = "UNPAID" | "DEPOSIT_PAID" | "PAID";

export interface Booking {
  id: string;
  code: string;
  branchId: BranchId;
  branchName: string;
  staffId?: string;
  staffName?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "11:00"
  selectedServices: ServiceItem[];
  totalAmount: number;
  totalDurationMinutes: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface TransformationItem {
  id: string;
  title: string;
  category: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  stylist: string;
}

