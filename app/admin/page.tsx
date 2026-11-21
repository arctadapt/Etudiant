import Image from 'next/image';
import Link from 'next/link';
import AdminBar from '@/components/AdminBar';
import ConfirmButton from '@/components/ConfirmButton';
import { getMenu } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { rupiah } from '@/lib/format';
import { deleteMenu } from './actions';

export const metadata = { title: 'Menu | Admin Étudiant' };

export default async function Page() {
  await requireAdmin();
  const menu = await getMenu();
  return (
    <>
      <AdminBar aktif="menu" />
      <main className="wrap page">
        <div className="head-row">
          <h1>Menu</h1>
          <Link href="/admin/menu/baru" className="btn btn--kuning">Tambah menu</Link>
        </div>
        {menu.length === 0 ? (
          <div className="kosong">Belum ada menu. Tambahkan menu pertamamu.</div>
        ) : (
          <ul className="list">
            {menu.map((m) => (
              <li key={m.id} className="list__item">
                <div className="list__foto"><Image src={m.gambar} alt="" fill sizes="72px" /></div>
                <div>
                  <div className="list__nama">{m.nama}</div>
                  <div className="list__meta">
                    {rupiah(m.harga)} <span className={'chip' + (m.habis ? ' chip--habis' : '')}>{m.habis ? 'Habis' : 'Tersedia'}</span>
                  </div>
                </div>
                <div className="list__aksi">
                  <Link href={`/admin/menu/${m.id}`} className="btn btn--ghost btn--small">Ubah</Link>
                  <form action={deleteMenu}>
                    <input type="hidden" name="id" value={m.id} />
                    <ConfirmButton className="btn btn--bahaya btn--small" pesan={`Hapus ${m.nama}? Tindakan ini tidak bisa dibatalkan.`}>Hapus</ConfirmButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
