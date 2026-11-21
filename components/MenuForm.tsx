'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { saveMenu } from '@/app/admin/actions';
import type { FormState } from '@/app/actions';
import type { Menu } from '@/lib/db';

export default function MenuForm({ menu }: { menu?: Menu }) {
  const [state, run, pending] = useActionState(
    async (prev: FormState, f: FormData) => ({ ...(await saveMenu(prev, f)), vals: Object.fromEntries(f) as Record<string, string> }),
    null as (FormState & { vals?: Record<string, string> }) | null,
  );
  const v = state?.vals;
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form action={run} className="form" style={{ maxWidth: '34rem' }}>
      {menu && <input type="hidden" name="id" value={menu.id} />}
      {state?.error && <div className="galat" role="alert">{state.error}</div>}
      <div className="field">
        <label htmlFor="nama">Nama menu</label>
        <input id="nama" name="nama" className="input" defaultValue={v?.nama ?? menu?.nama} required />
      </div>
      <div className="field">
        <label htmlFor="keterangan">Deskripsi singkat</label>
        <textarea id="keterangan" name="keterangan" className="input" defaultValue={v?.keterangan ?? menu?.keterangan} />
      </div>
      <div className="field">
        <label htmlFor="harga">Harga (Rp)</label>
        <input id="harga" name="harga" type="number" min={0} step={500} inputMode="numeric" className="input" defaultValue={v?.harga ?? menu?.harga} required />
      </div>
      <div className="field">
        <label htmlFor="gambar">Foto{menu ? ' (kosongkan jika tidak diganti)' : ''}</label>
        <input id="gambar" name="gambar" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="input" required={!menu}
          onChange={(e) => { const f = e.target.files?.[0]; setPreview(f ? URL.createObjectURL(f) : null); }} />
        <small>JPG, PNG, WebP, atau GIF. Maksimal 3 MB.</small>
        {(preview || menu?.gambar) && /* eslint-disable-next-line @next/next/no-img-element */ <img className="preview" src={preview ?? menu!.gambar} alt="Pratinjau foto" />}
      </div>
      <label className="check"><input type="checkbox" name="habis" defaultChecked={v ? v.habis === 'on' : menu?.habis} /> Tandai sedang habis</label>
      <div style={{ display: 'flex', gap: '.75rem' }}>
        <button className="btn btn--kuning" disabled={pending}>{pending ? 'Menyimpan…' : 'Simpan menu'}</button>
        <Link href="/admin" className="btn btn--ghost">Batal</Link>
      </div>
    </form>
  );
}
