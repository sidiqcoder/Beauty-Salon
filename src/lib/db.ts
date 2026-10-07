import postgres from "postgres";
import { Booking, AppointmentStatus } from "@/types/salon";

const connectionString = process.env.DATABASE_URL;

// Reusable connection instance
export const sql = connectionString
  ? postgres(connectionString, {
      ssl: connectionString.includes("localhost") ? false : "require",
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    })
  : null;

let tableInitialized = false;

// Ensure table exists in PostgreSQL automatically
export async function ensureTableInitialized() {
  if (!sql || tableInitialized) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "Booking" (
        "id" TEXT PRIMARY KEY,
        "code" TEXT UNIQUE NOT NULL,
        "branchId" TEXT NOT NULL,
        "branchName" TEXT NOT NULL,
        "staffId" TEXT,
        "staffName" TEXT,
        "customerName" TEXT NOT NULL,
        "customerPhone" TEXT NOT NULL,
        "customerEmail" TEXT,
        "date" TEXT NOT NULL,
        "timeSlot" TEXT NOT NULL,
        "servicesJson" TEXT NOT NULL,
        "totalAmount" DOUBLE PRECISION NOT NULL,
        "totalDurationMinutes" INTEGER NOT NULL,
        "paymentMethod" TEXT NOT NULL,
        "paymentStatus" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "notes" TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`CREATE INDEX IF NOT EXISTS "idx_booking_branch" ON "Booking" ("branchId");`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_booking_date" ON "Booking" ("date");`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_booking_status" ON "Booking" ("status");`;
    tableInitialized = true;
  } catch (error) {
    console.warn("Could not auto-initialize PostgreSQL table:", error);
  }
}

// Map PostgreSQL row back to Booking object
function mapRowToBooking(row: any): Booking {
  let services = [];
  try {
    services = JSON.parse(row.servicesJson || "[]");
  } catch {
    services = [];
  }

  return {
    id: row.id,
    code: row.code,
    branchId: row.branchId,
    branchName: row.branchName,
    staffId: row.staffId || undefined,
    staffName: row.staffName || undefined,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    customerEmail: row.customerEmail || undefined,
    date: row.date,
    timeSlot: row.timeSlot,
    selectedServices: services,
    totalAmount: Number(row.totalAmount),
    totalDurationMinutes: Number(row.totalDurationMinutes),
    paymentMethod: row.paymentMethod,
    paymentStatus: row.paymentStatus,
    status: row.status as AppointmentStatus,
    notes: row.notes || undefined,
    createdAt: new Date(row.createdAt).toISOString(),
  };
}

export async function getCloudBookings(branchId?: string, date?: string): Promise<Booking[] | null> {
  if (!sql) return null;

  try {
    await ensureTableInitialized();

    let rows;
    if (branchId && date) {
      rows = await sql`SELECT * FROM "Booking" WHERE "branchId" = ${branchId} AND "date" = ${date} ORDER BY "createdAt" DESC`;
    } else if (branchId) {
      rows = await sql`SELECT * FROM "Booking" WHERE "branchId" = ${branchId} ORDER BY "createdAt" DESC`;
    } else if (date) {
      rows = await sql`SELECT * FROM "Booking" WHERE "date" = ${date} ORDER BY "createdAt" DESC`;
    } else {
      rows = await sql`SELECT * FROM "Booking" ORDER BY "createdAt" DESC`;
    }

    return rows.map(mapRowToBooking);
  } catch (error) {
    console.error("PostgreSQL query error, falling back to cache:", error);
    return null;
  }
}

export async function saveCloudBooking(booking: Booking): Promise<Booking | null> {
  if (!sql) return null;

  try {
    await ensureTableInitialized();

    const servicesJson = JSON.stringify(booking.selectedServices || []);

    await sql`
      INSERT INTO "Booking" (
        "id", "code", "branchId", "branchName", "staffId", "staffName",
        "customerName", "customerPhone", "customerEmail", "date", "timeSlot",
        "servicesJson", "totalAmount", "totalDurationMinutes", "paymentMethod",
        "paymentStatus", "status", "notes", "createdAt", "updatedAt"
      ) VALUES (
        ${booking.id}, ${booking.code}, ${booking.branchId}, ${booking.branchName},
        ${booking.staffId || null}, ${booking.staffName || null},
        ${booking.customerName}, ${booking.customerPhone}, ${booking.customerEmail || null},
        ${booking.date}, ${booking.timeSlot}, ${servicesJson}, ${booking.totalAmount},
        ${booking.totalDurationMinutes}, ${booking.paymentMethod}, ${booking.paymentStatus},
        ${booking.status}, ${booking.notes || null},
        ${new Date(booking.createdAt)}, ${new Date()}
      );
    `;

    return booking;
  } catch (error) {
    console.error("PostgreSQL insert error, falling back to cache:", error);
    return null;
  }
}

export async function updateCloudBookingStatus(id: string, status: AppointmentStatus): Promise<boolean> {
  if (!sql) return false;

  try {
    await ensureTableInitialized();
    await sql`
      UPDATE "Booking"
      SET "status" = ${status}, "updatedAt" = ${new Date()}
      WHERE "id" = ${id};
    `;
    return true;
  } catch (error) {
    console.error("PostgreSQL update error:", error);
    return false;
  }
}

