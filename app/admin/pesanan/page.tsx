import AdminBar from '@/components/AdminBar';
import ConfirmButton from '@/components/ConfirmButton';
import { pool, type Pesanan } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { rupiah } from '@/lib/format';
import { deleteOrder } from '../actions';

export const metadata = { title: 'Pesanan | Admin Étudiant' };

const wib = (t: string) => new Date(t + 'Z').toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' WIB';

export default async function Page() {
  await requireAdmin();
  const { rows } = await pool.query<Pesanan>("SELECT *, to_char(tanggal, 'YYYY-MM-DD\"T\"HH24:MI') AS tanggal FROM transaksi ORDER BY id DESC LIMIT 200");
  return (
    <>
      <AdminBar aktif="pesanan" />
      <main className="wrap page">
        <div className="head-row"><h1>Pesanan</h1></div>
        {rows.length === 0 ? (
          <div className="kosong">Belum ada pesanan masuk.</div>
        ) : (
          <div className="list">
            {rows.map((o) => (
              <article key={o.id} className="order">
                <div className="order__top"><b>#{o.id} {o.nama}</b><span className="order__total">{rupiah(o.total_harga)}</span></div>
                <dl>
                  <dt>Pesanan</dt><dd>{o.pesanan}</dd>
                  <dt>Telepon</dt><dd><a href={`tel:${o.no_telp}`}>{o.no_telp}</a></dd>
                  <dt>Alamat</dt><dd>{o.alamat}</dd>
                  <dt>Waktu</dt><dd>{wib(o.tanggal)}</dd>
                  {o.catatan && <><dt>Catatan</dt><dd>{o.catatan}</dd></>}
                </dl>
                <form action={deleteOrder}>
                  <input type="hidden" name="id" value={o.id} />
                  <ConfirmButton className="btn btn--bahaya btn--small" pesan={`Hapus pesanan #${o.id}?`}>Hapus pesanan</ConfirmButton>
                </form>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
