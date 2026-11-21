import { Pool } from 'pg';

const g = globalThis as unknown as { pool?: Pool };

// satu pool per instance; max kecil karena tiap request serverless punya instance sendiri
export const pool =
  g.pool ?? (g.pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 }));

export type Menu = { id: number; nama: string; keterangan: string; harga: number; habis: boolean; gambar: string };
export type Pesanan = {
  id: number; pesanan: string; nama: string; no_telp: string; alamat: string;
  tanggal: string; catatan: string; total_harga: number; dibuat: Date;
};

export async function getMenu(): Promise<Menu[]> {
  return (await pool.query('SELECT * FROM menu ORDER BY id')).rows;
}

export async function getMenuById(id: number): Promise<Menu | null> {
  return (await pool.query('SELECT * FROM menu WHERE id = $1', [id])).rows[0] ?? null;
}
