import { put } from '@vercel/blob';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const TIPE: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

// Mengembalikan URL gambar, atau melempar Error dengan pesan yang bisa ditampilkan ke admin.
export async function simpanGambar(file: File): Promise<string> {
  const ext = TIPE[file.type];
  if (!ext) throw new Error('Gambar harus berformat JPG, PNG, WebP, atau GIF.');
  if (file.size > 3 * 1024 * 1024) throw new Error('Ukuran gambar maksimal 3 MB.');
  const nama = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return (await put(`menu/${nama}`, file, { access: 'public' })).url;
  }
  if (process.env.VERCEL) throw new Error('Vercel Blob belum dihubungkan ke project ini.');
  // lokal saja: simpan di public/uploads
  const dir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, nama), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${nama}`;
}
