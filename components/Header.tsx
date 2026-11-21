import Link from 'next/link';
import { getSession } from '@/lib/session';
import { logout } from '@/app/actions';
import { CartButton } from './Cart';

export default async function Header() {
  const s = await getSession();
  return (
    <header className="header">
      <div className="wrap header__in">
        <Link href="/" className="logo">Étudiant</Link>
        <nav className="nav" aria-label="Utama">
          <Link href="/#menu">Menu</Link>
          <Link href="/#cara-pesan">Cara pesan</Link>
          <Link href="/#kontak">Kontak</Link>
        </nav>
        <div className="header__aksi">
          {s ? (
            <div className="header__user">
              <span>{s.email}</span>
              {s.role === 'admin' && <Link href="/admin">Admin</Link>}
              <form action={logout}><button>Keluar</button></form>
            </div>
          ) : (
            <Link href="/login" className="btn btn--ghost btn--small">Masuk</Link>
          )}
          <CartButton />
        </div>
      </div>
    </header>
  );
}
