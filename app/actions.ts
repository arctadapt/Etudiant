'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { pool } from '@/lib/db';
import { createSession, destroySession } from '@/lib/session';
import { rupiah } from '@/lib/format';

export type FormState = { error?: string; waUrl?: string; id?: number; total?: number } | null;

// hanya path internal, supaya ?next= tidak bisa dipakai untuk open redirect
const aman = (next: FormDataEntryValue | null) =>
  typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/';

export async function login(_: FormState, f: FormData): Promise<FormState> {
  const email = String(f.get('email') ?? '').trim().toLowerCase();
  const password = String(f.get('password') ?? '');
  const u = (await pool.query('SELECT id, password, role FROM users WHERE email = $1', [email])).rows[0];
  // bcrypt.compare tetap dijalankan walau user tidak ada, agar waktu respons tidak membocorkan email terdaftar
  const ok = await bcrypt.compare(password, u?.password ?? '$2b$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalid.');
  if (!u || !ok) return { error: 'Email atau password salah.' };
  await createSession({ id: u.id, email, role: u.role });
  redirect(u.role === 'admin' && !f.get('next') ? '/admin' : aman(f.get('next')));
}

export async function register(_: FormState, f: FormData): Promise<FormState> {
  const email = String(f.get('email') ?? '').trim().toLowerCase();
  const password = String(f.get('password') ?? '');
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: 'Format email belum benar.' };
  if (password.length < 6) return { error: 'Password minimal 6 karakter.' };
  const hash = await bcrypt.hash(password, 10);
  const r = await pool.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING RETURNING id",
    [email, hash],
  );
  if (!r.rows[0]) return { error: 'Email ini sudah terdaftar. Coba masuk.' };
  await createSession({ id: r.rows[0].id, email, role: 'user' });
  redirect('/');
}

export async function logout() {
  await destroySession();
  redirect('/');
}

export async function placeOrder(_: FormState, f: FormData): Promise<FormState> {
  let cart: { id: number; qty: number }[] = [];
  try { cart = JSON.parse(String(f.get('cart') ?? '[]')); } catch {}
  cart = cart.filter((c) => Number.isInteger(c.id) && Number.isInteger(c.qty) && c.qty > 0).slice(0, 50);
  if (!cart.length) return { error: 'Keranjang masih kosong.' };

  const nama = String(f.get('nama') ?? '').trim();
  const no_telp = String(f.get('no_telp') ?? '').trim();
  const alamat = String(f.get('alamat') ?? '').trim();
  const catatan = String(f.get('catatan') ?? '').trim();
  const tanggal = String(f.get('tanggal') ?? ''); // waktu dinding apa adanya, tanpa konversi zona waktu
  if (!nama || !no_telp || !alamat) return { error: 'Nama, nomor telepon, dan alamat wajib diisi.' };
  if (!/^[0-9+\s-]{8,20}$/.test(no_telp)) return { error: 'Nomor telepon belum benar.' };
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(tanggal)) return { error: 'Pilih waktu pengambilan.' };

  // harga selalu dari database, bukan dari browser
  const { rows } = await pool.query('SELECT id, nama, harga, habis FROM menu WHERE id = ANY($1)', [cart.map((c) => c.id)]);
  const byId = new Map(rows.map((r) => [r.id, r]));
  const baris: string[] = [];
  let total = 0;
  for (const c of cart) {
    const m = byId.get(c.id);
    if (!m) return { error: 'Ada menu di keranjang yang sudah tidak tersedia. Muat ulang halaman.' };
    if (m.habis) return { error: `${m.nama} sedang habis. Hapus dari keranjang untuk melanjutkan.` };
    const qty = Math.min(c.qty, 10);
    baris.push(`${m.nama} x${qty}`);
    total += m.harga * qty;
  }
  const pesanan = baris.join(', ');

  const r = await pool.query(
    'INSERT INTO transaksi (pesanan, nama, no_telp, alamat, tanggal, catatan, total_harga) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
    [pesanan, nama, no_telp, alamat, tanggal, catatan, total],
  );
  const id: number = r.rows[0].id;

  const teks =
    `Halo Étudiant, saya mau pesan (#${id}):\n${baris.map((b) => '- ' + b).join('\n')}\nTotal: ${rupiah(total)}\n\n` +
    `Nama: ${nama}\nTelepon: ${no_telp}\nAlamat: ${alamat}\nWaktu: ${new Date(tanggal + 'Z').toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short', timeZone: 'UTC' })} WIB` +
    (catatan ? `\nCatatan: ${catatan}` : '');
  const wa = process.env.WA_NUMBER || '62882001743703';
  return { id, total, waUrl: `https://wa.me/${wa}?text=${encodeURIComponent(teks)}` };
}
