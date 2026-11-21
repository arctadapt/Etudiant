export default function Footer() {
  return (
    <footer className="footer" id="kontak">
      <div className="wrap">
        <div className="footer__in">
          <div>
            <h2>Étudiant</h2>
            <p style={{ marginTop: '.6rem', maxWidth: '30ch' }}>Jajanan manis dan gurih buatan siswa SMK, dari Bandung.</p>
          </div>
          <div>
            <h3>Jam buka</h3>
            <p>Akhir pekan, 10.00 sampai 17.00 WIB</p>
            <h3 style={{ marginTop: '1rem' }}>Alamat</h3>
            <p>SMK PI Inofthank, Jl. Inhoftank No. 46-146, Astanaanyar, Kota Bandung</p>
          </div>
          <div>
            <h3>Hubungi kami</h3>
            <p><a href="tel:+6289684828821">(+62) 896-8482-8821</a></p>
            <p><a href="mailto:etudiantsmkp1@gmail.com">etudiantsmkp1@gmail.com</a></p>
          </div>
        </div>
        <p className="footer__copy">© {new Date().getFullYear()} 52 Group. Semua hak dilindungi.</p>
      </div>
    </footer>
  );
}
