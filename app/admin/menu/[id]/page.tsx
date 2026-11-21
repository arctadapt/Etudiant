import { notFound } from 'next/navigation';
import AdminBar from '@/components/AdminBar';
import MenuForm from '@/components/MenuForm';
import { getMenuById } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

export const metadata = { title: 'Ubah menu | Admin Étudiant' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  const menu = Number.isInteger(id) ? await getMenuById(id) : null;
  if (!menu) notFound();
  return <><AdminBar aktif="menu" /><main className="wrap page"><h1>Ubah menu</h1><MenuForm menu={menu} /></main></>;
}
