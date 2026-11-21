import Link from 'next/link';
import { logout } from '@/app/actions';

export default function AdminBar({ aktif }: { aktif: 'menu' | 'pesanan' }) {
  return (
    <div className="admin__bar">
      <div className="wrap">
        <b>Admin Étudiant</b>
        <Link href="/admin" aria-current={aktif === 'menu' ? 'page' : undefined}>Menu</Link>
        <Link href="/admin/pesanan" aria-current={aktif === 'pesanan' ? 'page' : undefined}>Pesanan</Link>
        <Link href="/">Lihat situs</Link>
        <form action={logout}><button>Keluar</button></form>
      </div>
    </div>
  );
}
