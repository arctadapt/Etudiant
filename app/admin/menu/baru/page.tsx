import AdminBar from '@/components/AdminBar';
import MenuForm from '@/components/MenuForm';
import { requireAdmin } from '@/lib/session';

export const metadata = { title: 'Tambah menu | Admin Étudiant' };

export default async function Page() {
  await requireAdmin();
  return <><AdminBar aktif="menu" /><main className="wrap page"><h1>Tambah menu</h1><MenuForm /></main></>;
}
