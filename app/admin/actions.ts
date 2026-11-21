'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { pool } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { simpanGambar } from '@/lib/upload';
import type { FormState } from '@/app/actions';

export async function saveMenu(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(f.get('id')) || 0;
  const nama = String(f.get('nama') ?? '').trim();
  const keterangan = String(f.get('keterangan') ?? '').trim();
  const harga = Number(f.get('harga'));
  const habis = f.get('habis') === 'on';
  const file = f.get('gambar');
  const ada = file instanceof File && file.size > 0;

  if (!nama) return { error: 'Nama menu wajib diisi.' };
  if (!Number.isInteger(harga) || harga < 0) return { error: 'Harga harus berupa angka bulat.' };
  if (!id && !ada) return { error: 'Foto menu wajib diunggah.' };

  try {
    const gambar = ada ? await simpanGambar(file) : null;
    if (id) {
      await pool.query(
        'UPDATE menu SET nama=$1, keterangan=$2, harga=$3, habis=$4, gambar=COALESCE($5, gambar) WHERE id=$6',
        [nama, keterangan, harga, habis, gambar, id],
      );
    } else {
      await pool.query('INSERT INTO menu (nama, keterangan, harga, habis, gambar) VALUES ($1,$2,$3,$4,$5)', [nama, keterangan, harga, habis, gambar]);
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Gagal menyimpan menu.' };
  }
  revalidatePath('/');
  redirect('/admin');
}

export async function deleteMenu(f: FormData) {
  await requireAdmin();
  await pool.query('DELETE FROM menu WHERE id = $1', [Number(f.get('id'))]);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteOrder(f: FormData) {
  await requireAdmin();
  await pool.query('DELETE FROM transaksi WHERE id = $1', [Number(f.get('id'))]);
  revalidatePath('/admin/pesanan');
}
