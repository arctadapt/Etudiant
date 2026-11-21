'use client';

export default function ConfirmButton({ pesan, children, className }: { pesan: string; children: React.ReactNode; className?: string }) {
  return <button className={className} onClick={(e) => { if (!confirm(pesan)) e.preventDefault(); }}>{children}</button>;
}
