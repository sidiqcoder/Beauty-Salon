-- Setup SQL Script untuk Supabase / Neon / PostgreSQL
-- Salin dan jalankan script ini di SQL Editor Supabase untuk membuat tabel otomatis.

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

CREATE INDEX IF NOT EXISTS "idx_booking_branch" ON "Booking" ("branchId");
CREATE INDEX IF NOT EXISTS "idx_booking_date" ON "Booking" ("date");
CREATE INDEX IF NOT EXISTS "idx_booking_status" ON "Booking" ("status");

