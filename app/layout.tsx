import type { Metadata } from 'next';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/figtree';
import './globals.css';
import { CartProvider } from '@/components/Cart';

export const metadata: Metadata = {
  title: 'Étudiant | Jajanan buatan siswa SMK Bandung',
  description: 'Mochi bites, sandwich buah, mozzarella rolls, dan basreng buatan siswa SMK di Bandung. Pesan online, konfirmasi lewat WhatsApp.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
