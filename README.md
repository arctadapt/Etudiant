# Étudiant

Étudiant adalah toko jajanan online buatan siswa SMK di Bandung. Aplikasi ini menggabungkan katalog, keranjang belanja, pencatatan pesanan, dan pengelolaan menu dalam satu website.

Demo: https://etudiant-ux.vercel.app

## Fitur

- Pelanggan dapat melihat menu, memasukkan produk ke keranjang, dan melakukan checkout.
- Pesanan disimpan ke database dengan total harga yang dihitung kembali di server. Pelanggan kemudian mengirim rincian pesanan melalui WhatsApp secara manual.
- Pengguna dapat mendaftar dan masuk dengan email dan password.
- Admin dapat menambah, mengubah, atau menghapus menu, mengunggah foto produk, menandai stok habis, serta melihat dan menghapus pesanan.

## Teknologi

Next.js 15 (App Router dan Server Actions), React 19, TypeScript, PostgreSQL, Vercel Blob, bcryptjs, dan jose. Aplikasi di-deploy melalui Vercel.

## Menjalankan secara lokal

Instal Node.js yang kompatibel dengan Next.js 15 dan siapkan database PostgreSQL terpisah untuk pengembangan.

```sh
npm ci
npm run dev
```

Buka http://localhost:3000 setelah database dan konfigurasi aplikasi disiapkan.

## Konfigurasi

Buat file `.env.local` untuk konfigurasi aplikasi atau gunakan Environment Variables di Vercel.

| Variabel | Kegunaan |
| --- | --- |
| `DATABASE_URL` | Koneksi PostgreSQL |
| `SESSION_SECRET` | Rahasia penandatanganan sesi |
| `WA_NUMBER` | Nomor WhatsApp toko dalam format internasional |
| `BLOB_READ_WRITE_TOKEN` | Penyimpanan gambar menu di Vercel Blob |

Untuk inisialisasi database, sediakan `DATABASE_URL`, `ADMIN_EMAIL` dan `ADMIN_PASSWORD` melalui environment proses shell, lalu jalankan `npm run db:init`. Script ini membuat skema, mengisi menu contoh, dan membuat atau memperbarui akun admin. Gunakan database pengembangan dan jangan menjalankan script pada database produksi tanpa peninjauan.

Tanpa Vercel Blob, gambar yang diunggah saat pengembangan lokal disimpan di `public/uploads`. Deployment Vercel membutuhkan Blob yang terhubung.

## Struktur

- `app/`: katalog, checkout, autentikasi, dashboard admin, dan Server Actions.
- `components/`: antarmuka pelanggan dan admin.
- `lib/`: database, sesi, pengunggahan gambar, dan pemformatan.
- `db/schema.sql`: skema database.
- `scripts/init-db.mjs`: inisialisasi database.

## Deployment dan catatan

Hubungkan repositori ke Vercel, siapkan PostgreSQL dan Blob, isi environment variables, lalu deploy. Build lokal tersedia melalui `npm run build`.

Password di-hash dengan bcrypt dan sesi menggunakan token bertanda tangan. Jangan menyertakan kredensial atau data pelanggan dalam repositori. Sebelum penggunaan operasional, verifikasi pembatasan percobaan login, otorisasi admin, validasi unggahan, dan perlindungan data pesanan. Checkout bukan integrasi pembayaran otomatis; konfirmasi pesanan tetap melalui WhatsApp.

Pembaruan dokumentasi ini berdasarkan peninjauan kode, bukan hasil pengujian menyeluruh.
