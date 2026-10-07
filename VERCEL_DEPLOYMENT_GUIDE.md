# PANDUAN DEPLOY KE VERCEL (100% GRATIS & PERMANEN)
## Sistem Web & Smart Booking Salon Kecantikan "Aura & Curls"

Dokumen ini memandu langkah demi langkah cara mendeploy aplikasi web salon ini ke **Vercel** agar **tetap berjalan stabil selamanya tanpa kehilangan data booking**.

---

### ARSITEKTUR CLOUD (100% TIER GRATIS)
* **Frontend & Backend API:** **Vercel** (Hosting, Serverless API, Global CDN, SSL HTTPS) $\rightarrow$ **GRATIS**
* **Database Permanen:** **Supabase** atau **Neon** (PostgreSQL Cloud 500 MB) $\rightarrow$ **GRATIS**
* **Total Biaya Bulanan:** **Rp 0 / bulan**

---

### LANGKAH 1: Buat Database Cloud Gratis (Pilih Salah Satu)

#### Opsi A: Menggunakan Supabase (Rekomendasi No. 1)
1. Buka [https://supabase.com](https://supabase.com) dan buat akun (bisa login dengan akun GitHub).
2. Klik **"New Project"**, beri nama proyek (misal: `salon-database`), pilih password database Anda, dan pilih region **Singapore (ap-southeast-1)**.
3. Setelah project selesai dibuat (± 1 menit):
   * Masuk ke menu **Project Settings** (ikon gear di kiri bawah) $\rightarrow$ **Database**.
   * Cari bagian **Connection string** $\rightarrow$ Pilih tab **URI**.
   * Salin connection string tersebut. Formatnya seperti ini:
     ```
     postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require
     ```
   * *Ganti `[PASSWORD]` dengan password yang Anda buat tadi.*

*(Catatan: Anda tidak perlu membuat tabel manual! Sistem web ini sudah otomatis membuat tabel `Booking` dan indeksnya pada saat pertama kali dijalankan).*

---

### LANGKAH 2: Push Kode ke GitHub
1. Pastikan seluruh file proyek ini sudah di-*commit* ke repositori Git:
   ```bash
   git add .
   git commit -m "feat: complete luxury beauty salon end-to-end app"
   ```
2. Buat repositori baru di akun [GitHub](https://github.com/) Anda (misal: `beauty-salon-web`).
3. Hubungkan dan push kode ke GitHub:
   ```bash
   git remote add origin https://github.com/USERNAME-ANDA/beauty-salon-web.git
   git branch -M main
   git push -u origin main
   ```

---

### LANGKAH 3: Deploy di Vercel
1. Buka [https://vercel.com](https://vercel.com) dan login menggunakan akun GitHub Anda.
2. Klik tombol **"Add New..."** $\rightarrow$ Pilih **"Project"**.
3. Cari dan pilih repositori `beauty-salon-web` yang baru saja Anda push, lalu klik **"Import"**.
4. Di halaman konfigurasi sebelum deploy:
   * Buka bagian **"Environment Variables"**.
   * Masukkan:
     * **Key:** `DATABASE_URL`
     * **Value:** *(Tempelkan connection string Supabase dari Langkah 1 tadi)*
5. Klik tombol **"Deploy"**.

---

### LANGKAH 4: Selesai & Verifikasi!
Dalam waktu **± 60 detik**, Vercel akan selesai melakukan build dan memberikan link website resmi yang sudah live (contoh: `https://beauty-salon-web.vercel.app`).

**Uji Coba Langsung:**
1. Buka link web dari HP Anda.
2. Coba buat satu reservasi jadwal di `/booking`.
3. Buka halaman admin di `/admin`, data reservasi Anda akan langsung muncul dan tersimpan aman di cloud database selamanya!

