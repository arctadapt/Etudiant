// Membuat tabel, mengisi menu contoh (jika kosong), dan membuat akun admin.
// Pakai: DATABASE_URL=... ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run db:init
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'node:fs';

const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!DATABASE_URL) throw new Error('DATABASE_URL belum diisi');

const db = new pg.Client({ connectionString: DATABASE_URL });
await db.connect();
await db.query(readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8'));

const { rows } = await db.query('SELECT COUNT(*)::int AS n FROM menu');
if (rows[0].n === 0) {
  const menu = [
    ['Mochi Bites Matcha', 'Mochi kenyal berbalut matcha, dicocol saus krim putih.', 12000, '/menu/matcha.jpg'],
    ['Mochi Bites Coklat', 'Bola mochi bertabur coklat, lumer di mulut.', 12000, '/menu/coklat.jpg'],
    ['Mocheeze', 'Mochi lembut dengan isian keju yang melimpah.', 15000, '/menu/mocheeze.jpg'],
    ['Mochi Bites Stroberi', 'Mochi dengan rasa stroberi yang dominan.', 12000, '/menu/stroberi.jpg'],
    ['Sandwich Buah Stroberi', 'Roti lembut, krim tebal, dan stroberi segar.', 5000, '/menu/sandwich-stroberi.jpg'],
    ['Sandwich Buah Kiwi', 'Roti lembut dengan kiwi dan stroberi yang menyegarkan.', 5000, '/menu/sandwich-kiwi.jpg'],
    ['Mozzarella Rolls', 'Luarnya renyah, dalamnya mozzarella yang lumer.', 5000, '/menu/mozzarella.jpg'],
    ['Basreng Daun Jeruk', 'Bakso goreng renyah dengan aroma daun jeruk.', 5000, '/menu/basreng.jpg'],
  ];
  for (const m of menu) {
    await db.query('INSERT INTO menu (nama, keterangan, harga, gambar) VALUES ($1,$2,$3,$4)', m);
  }
  console.log(`Menu contoh: ${menu.length} item`);
}

if (ADMIN_EMAIL && ADMIN_PASSWORD) {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await db.query(
    `INSERT INTO users (email, password, role) VALUES ($1,$2,'admin')
     ON CONFLICT (email) DO UPDATE SET password = $2, role = 'admin'`,
    [ADMIN_EMAIL.toLowerCase(), hash],
  );
  console.log(`Admin: ${ADMIN_EMAIL}`);
} else {
  console.log('ADMIN_EMAIL / ADMIN_PASSWORD kosong, akun admin tidak dibuat.');
}
await db.end();
