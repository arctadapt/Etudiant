'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { placeOrder, type FormState } from '@/app/actions';
import { CartLine, useCart } from './Cart';
import { rupiah } from '@/lib/format';

// nilai awal untuk input datetime-local (waktu lokal browser, 1 jam dari sekarang)
const lokal = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

export default function CheckoutForm() {
  const { items, total, ready, clear } = useCart();
  // React 19 mengosongkan form setelah action; simpan isian supaya tidak hilang saat ada error
  const [state, run, pending] = useActionState(
    async (prev: FormState, f: FormData) => ({ ...(await placeOrder(prev, f)), vals: Object.fromEntries(f) as Record<string, string> }),
    null as (FormState & { vals?: Record<string, string> }) | null,
  );
  const v = state?.vals ?? {};
  const [min, setMin] = useState('');
  useEffect(() => setMin(lokal(new Date(Date.now() + 36e5))), []);
  useEffect(() => { if (state?.waUrl) clear(); }, [state, clear]);

  if (state?.waUrl) {
    return (
      <div className="sukses">
        <h2>Pesanan #{state.id} tercatat</h2>
        <p>Total {rupiah(state.total ?? 0)}. Langkah terakhir: kirim rincian pesanan ke WhatsApp kami. Pesananmu baru dikonfirmasi setelah pesan terkirim.</p>
        <a className="btn btn--kuning" href={state.waUrl} target="_blank" rel="noopener noreferrer">Kirim lewat WhatsApp</a>
        <Link href="/" className="linkbtn">Kembali ke menu</Link>
      </div>
    );
  }
  if (!ready) return <p>Memuat keranjang…</p>;
  if (items.length === 0) {
    return (
      <div className="sukses">
        <h2>Keranjangmu masih kosong</h2>
        <p>Tambahkan jajanan dari menu dulu, lalu kembali ke sini untuk memesan.</p>
        <Link href="/#menu" className="btn btn--kuning">Pilih jajanan</Link>
      </div>
    );
  }

  return (
    <div className="cols">
      <form action={run} className="form">
        <input type="hidden" name="cart" value={JSON.stringify(items.map((i) => ({ id: i.id, qty: i.qty })))} />
        {state?.error && <div className="galat" role="alert">{state.error}</div>}
        <div className="field">
          <label htmlFor="nama">Nama lengkap</label>
          <input id="nama" name="nama" className="input" autoComplete="name" defaultValue={v.nama} required />
        </div>
        <div className="field">
          <label htmlFor="no_telp">Nomor telepon</label>
          <input id="no_telp" name="no_telp" type="tel" inputMode="tel" className="input" autoComplete="tel" placeholder="0812…" defaultValue={v.no_telp} required />
        </div>
        <div className="field">
          <label htmlFor="alamat">Alamat pengantaran</label>
          <textarea id="alamat" name="alamat" className="input" autoComplete="street-address" defaultValue={v.alamat} required />
          <small>Untuk diambil di tempat, tulis “ambil di tempat”.</small>
        </div>
        <div className="field">
          <label htmlFor="tanggal">Waktu pengambilan atau pengantaran</label>
          <input id="tanggal" name="tanggal" type="datetime-local" className="input" min={min} defaultValue={v.tanggal || min} required key={min} />
        </div>
        <div className="field">
          <label htmlFor="catatan">Catatan (opsional)</label>
          <input id="catatan" name="catatan" className="input" defaultValue={v.catatan} />
        </div>
        <button className="btn btn--kuning btn--block" disabled={pending}>{pending ? 'Menyimpan…' : 'Kirim pesanan'}</button>
      </form>

      <aside className="panel cols__ringkasan">
        <h2>Ringkasan pesanan</h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>{items.map((i) => <CartLine key={i.id} item={i} />)}</ul>
        <div className="row" style={{ marginTop: '1rem' }}><span>Total</span><b>{rupiah(total)}</b></div>
      </aside>
    </div>
  );
}
