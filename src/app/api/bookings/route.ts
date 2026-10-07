import { NextResponse } from "next/server";
import { getBookings, addBooking, updateBookingStatus } from "@/lib/booking-store";
import { Booking, AppointmentStatus } from "@/types/salon";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const branchId = searchParams.get("branchId") || undefined;
  const date = searchParams.get("date") || undefined;

  const bookings = await getBookings(branchId, date);
  return NextResponse.json({ success: true, data: bookings });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate readable booking code: AUR-YYYYMM-XXXX
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const code = `AUR-${yearMonth}-${randomCode}`;

    const newBooking: Booking = {
      ...body,
      id: `b-${Date.now()}`,
      code,
      status: body.status || "PENDING",
      createdAt: new Date().toISOString(),
    };

    const saved = await addBooking(newBooking);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal membuat booking: " + String(error) },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body as { id: string; status: AppointmentStatus };

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "ID dan status dibutuhkan." },
        { status: 400 }
      );
    }

    const updated = await updateBookingStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Booking tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal update status: " + String(error) },
      { status: 400 }
    );
  }
}

