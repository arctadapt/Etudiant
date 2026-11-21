import Header from '@/components/Header';
import CheckoutForm from '@/components/CheckoutForm';

export const metadata = { title: 'Pemesanan | Étudiant' };

export default function Page() {
  return (
    <>
      <Header />
      <main className="wrap page">
        <h1>Pemesanan</h1>
        <CheckoutForm />
      </main>
    </>
  );
}
