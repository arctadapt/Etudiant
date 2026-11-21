import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TileAction } from '@/components/Cart';
import { getMenu } from '@/lib/db';
import { rupiah } from '@/lib/format';

export const dynamic = 'force-dynamic'; // menu dibaca dari database saat request, bukan saat build

const rb = (n: number) => (n % 1000 === 0 ? `${n / 1000}rb` : rupiah(n));

export default async function Home() {
  const menu = await getMenu();
  const termurah = menu.length ? Math.min(...menu.map((m) => m.harga)) : 0;
  const foto = (nama: string) => menu.find((m) => m.nama.toLowerCase().includes(nama))?.gambar ?? menu[0]?.gambar;
  const hero = { a: foto('matcha'), b: foto('sandwich buah stroberi'), c: foto('mozzarella') };

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="wrap hero__in">
            <div>
              <h1>Jajan manis buatan anak SMK Bandung</h1>
              <p>Mochi lumer, sandwich buah, dan camilan gurih. Pilih, isi data, lalu kirim pesananmu lewat WhatsApp.</p>
              <div className="hero__cta">
                <a href="#menu" className="btn btn--kuning">Lihat menu</a>
                <a href="#cara-pesan" className="btn btn--ghost">Cara pesan</a>
              </div>
            </div>
            {hero.a && (
              <div className="collage" aria-hidden="true">
                <div className="collage__img collage__a"><Image src={hero.a} alt="" fill priority sizes="(max-width: 860px) 60vw, 340px" /></div>
                <div className="collage__img collage__b"><Image src={hero.b!} alt="" fill priority sizes="(max-width: 860px) 40vw, 220px" /></div>
                <div className="collage__img collage__c"><Image src={hero.c!} alt="" fill priority sizes="(max-width: 860px) 46vw, 250px" /></div>
                <div className="sticker"><small>mulai dari</small>{rb(termurah)}</div>
              </div>
            )}
          </div>
        </section>

        <section className="steps" id="cara-pesan" aria-label="Cara pesan">
          <ol className="wrap steps__in">
            <li><div><b>Pilih jajanan</b><span>Tambahkan menu favoritmu ke keranjang.</span></div></li>
            <li><div><b>Isi data pengambilan</b><span>Nama, nomor telepon, alamat, dan waktu.</span></div></li>
            <li><div><b>Kirim lewat WhatsApp</b><span>Pesananmu dikonfirmasi oleh tim kami.</span></div></li>
          </ol>
        </section>

        <section className="section" id="menu">
          <div className="wrap">
            <div className="section__head">
              <h2>Menu</h2>
              <p>{menu.length} pilihan, mulai {rupiah(termurah)}. Foto dan harga selalu mengikuti menu terbaru.</p>
            </div>
            {menu.length === 0 ? (
              <div className="kosong">Menu sedang disiapkan. Silakan kembali beberapa saat lagi.</div>
            ) : (
              <div className="grid">
                {menu.map((m) => (
                  <article key={m.id} className={'tile' + (m.habis ? ' tile--habis' : '')}>
                    <div className="tile__foto">
                      <Image src={m.gambar} alt={m.nama} fill sizes="(max-width: 640px) 100vw, 260px" />
                      {m.habis ? <span className="tile__habis">Habis</span> : <span className="sticker">{rb(m.harga)}</span>}
                    </div>
                    <h3>{m.nama}</h3>
                    <p>{m.keterangan}</p>
                    <div className="tile__aksi"><TileAction menu={{ id: m.id, nama: m.nama, harga: m.harga, gambar: m.gambar, habis: m.habis }} /></div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
