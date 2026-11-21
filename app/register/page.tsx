import Header from '@/components/Header';
import AuthForm from '@/components/AuthForm';
import { register } from '@/app/actions';

export const metadata = { title: 'Buat akun | Étudiant' };

export default function Page() {
  return <><Header /><AuthForm mode="register" action={register} /></>;
}
