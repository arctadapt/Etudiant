import Header from '@/components/Header';
import AuthForm from '@/components/AuthForm';
import { login } from '@/app/actions';

export const metadata = { title: 'Masuk | Étudiant' };

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <><Header /><AuthForm mode="login" action={login} next={next} /></>;
}
