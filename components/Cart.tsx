'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { rupiah } from '@/lib/format';

export type Item = { id: number; nama: string; harga: number; gambar: string; qty: number };
type Ctx = {
  items: Item[]; count: number; total: number; ready: boolean;
  add: (m: Omit<Item, 'qty'>) => void; setQty: (id: number, qty: number) => void; remove: (id: number) => void;
  clear: () => void; openCart: () => void;
};

const MAX = 10;
const KEY = 'etudiant-cart';
const CartCtx = createContext<Ctx | null>(null);
export const useCart = () => useContext(CartCtx)!;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<{ text: string; n: number } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, ready]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => setOpen(false), [pathname]);

  const add = useCallback((m: Omit<Item, 'qty'>) => {
    setItems((cur) =>
      cur.some((i) => i.id === m.id)
        ? cur.map((i) => (i.id === m.id ? { ...i, qty: Math.min(i.qty + 1, MAX) } : i))
        : [...cur, { ...m, qty: 1 }],
    );
    setToast((t) => ({ text: `${m.nama} masuk keranjang`, n: (t?.n ?? 0) + 1 }));
  }, []);
  const setQty = useCallback((id: number, qty: number) =>
    setItems((cur) => cur.flatMap((i) => (i.id !== id ? [i] : qty <= 0 ? [] : [{ ...i, qty: Math.min(qty, MAX) }]))), []);
  const remove = useCallback((id: number) => setItems((cur) => cur.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((n, i) => n + i.qty * i.harga, 0);
  const value = useMemo(
    () => ({ items, count, total, ready, add, setQty, remove, clear, openCart: () => setOpen(true) }),
    [items, count, total, ready, add, setQty, remove, clear],
  );
  const sembunyi = pathname.startsWith('/checkout') || pathname.startsWith('/admin') || pathname === '/login' || pathname === '/register';

  return (
    <CartCtx.Provider value={value}>
      {children}
      {open && <Drawer onClose={() => setOpen(false)} />}
      {toast && !open && (
        <div className="toast" role="status" key={toast.n}>
          {toast.text}
          <button onClick={() => { setToast(null); setOpen(true); }}>Lihat</button>
        </div>
      )}
      {!sembunyi && count > 0 && !open && (
        <button className="cartbar" onClick={() => setOpen(true)}>
          <span>{count} item di keranjang</span>
          <b>{rupiah(total)}</b>
        </button>
      )}
    </CartCtx.Provider>
  );
}

export function Stepper({ item, kecil }: { item: Pick<Item, 'id' | 'qty'>; kecil?: boolean }) {
  const { setQty } = useCart();
  return (
    <div className={'stepper' + (kecil ? ' stepper--kecil' : '')}>
      <button aria-label="Kurangi" onClick={() => setQty(item.id, item.qty - 1)}>−</button>
      <output aria-live="polite">{item.qty}</output>
      <button aria-label="Tambah" onClick={() => setQty(item.id, item.qty + 1)} disabled={item.qty >= MAX}>+</button>
    </div>
  );
}

export function CartLine({ item }: { item: Item }) {
  const { remove } = useCart();
  return (
    <li className="item">
      <div className="item__foto"><Image src={item.gambar} alt="" fill sizes="68px" /></div>
      <div>
        <div className="item__nama">{item.nama}</div>
        <div className="item__harga">{rupiah(item.harga)} per porsi, total {rupiah(item.harga * item.qty)}</div>
        <div className="item__aksi">
          <Stepper item={item} kecil />
          <button className="item__hapus" onClick={() => remove(item.id)}>Hapus</button>
        </div>
      </div>
    </li>
  );
}

function Drawer({ onClose }: { onClose: () => void }) {
  const { items, total } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Keranjang">
        <div className="drawer__head">
          <h2>Keranjang</h2>
          <button ref={closeRef} className="iconbtn" onClick={onClose} aria-label="Tutup keranjang">×</button>
        </div>
        {items.length === 0 ? (
          <div className="drawer__kosong">
            <p>Keranjangmu masih kosong. Pilih jajanan dari menu, lalu kembali ke sini.</p>
            <button className="btn btn--kuning" onClick={onClose}>Lihat menu</button>
          </div>
        ) : (
          <>
            <ul className="drawer__list">{items.map((i) => <CartLine key={i.id} item={i} />)}</ul>
            <div className="drawer__foot">
              <div className="row"><span>Subtotal</span><b>{rupiah(total)}</b></div>
              <Link href="/checkout" className="btn btn--kuning btn--block">Lanjut ke pemesanan</Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export function CartButton() {
  const { count, ready, openCart } = useCart();
  const [bump, setBump] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setBump(true);
    const t = setTimeout(() => setBump(false), 400);
    return () => clearTimeout(t);
  }, [count]);
  return (
    <button className="cartbtn" onClick={openCart} aria-label={`Buka keranjang, ${ready ? count : 0} item`}>
      Keranjang
      {ready && count > 0 && <span className={'cartbtn__n' + (bump ? ' cartbtn__n--bump' : '')}>{count}</span>}
    </button>
  );
}

export function TileAction({ menu }: { menu: Omit<Item, 'qty'> & { habis: boolean } }) {
  const { items, add, ready } = useCart();
  const ada = items.find((i) => i.id === menu.id);
  if (menu.habis) return <button className="btn btn--block" disabled>Sedang habis</button>;
  if (ready && ada) return <Stepper item={ada} />;
  return (
    <button className="btn btn--block" onClick={() => add({ id: menu.id, nama: menu.nama, harga: menu.harga, gambar: menu.gambar })}>
      Tambah ke keranjang
    </button>
  );
}
