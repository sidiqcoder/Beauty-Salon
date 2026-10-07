import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gift Voucher Hadiah Eksklusif | Aura & Curls Luxury Salon",
  description: "Beli voucher hadiah perawatan salon kecantikan dan spa wanita untuk orang tersayang.",
};

export default function VoucherLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

