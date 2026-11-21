# Étudiant

Toko jajanan online buatan siswa SMK Bandung. Next.js 15 (App Router) + Postgres + Vercel Blob.

- Pelanggan: lihat menu, keranjang (tersimpan di browser), checkout, pesanan tercatat lalu dikirim ke WhatsApp.
- Admin (`/admin`): kelola menu (foto, harga, status habis) dan lihat/hapus pesanan.
- Akun: daftar dan masuk dengan email + password (bcrypt, cookie sesi bertanda tangan, 7 hari).

## Deploy ke Vercel

1. **Database.** Di dashboard Vercel: *Storage* → buat Postgres (Neon). Salin `DATABASE_URL` ke Environment Variables project.
2. **Blob.** *Storage* → buat Blob store dan hubungkan ke project (variabel `BLOB_READ_WRITE_TOKEN` terisi otomatis).
3. **Environment Variables:** `DATABASE_URL`, `SESSION_SECRET` (`openssl rand -base64 32`), `WA_NUMBER` (mis. `6283829953377`).
4. **Inisialisasi database sekali saja** dari komputermu (membuat tabel, 8 menu contoh, dan akun admin):
   ```bash
   npm install
   DATABASE_URL="<url dari Neon>" ADMIN_EMAIL="kamu@email.com" ADMIN_PASSWORD="password-kuat" npm run db:init
   ```
5. Push ke GitHub, import repo di Vercel, lalu deploy. Framework terdeteksi otomatis.

## Jalan di lokal

```bash
cp .env.example .env.local   # isi DATABASE_URL dan SESSION_SECRET
npm install
npm run db:init              # lihat langkah 4 di atas untuk ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev
```

Tanpa `BLOB_READ_WRITE_TOKEN`, foto yang diunggah di lokal disimpan di `public/uploads` (hanya untuk development).

## Catatan

- Harga pesanan selalu dihitung ulang di server dari database, bukan dari browser.
- Belum ada pembatasan percobaan login (rate limit). Tambahkan sebelum dipakai untuk data sungguhan.
