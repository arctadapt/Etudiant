'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import type { FormState } from '@/app/actions';

export default function AuthForm({
  mode, action, next,
}: { mode: 'login' | 'register'; action: (s: FormState, f: FormData) => Promise<FormState>; next?: string }) {
  const [state, run, pending] = useActionState(
    async (prev: FormState, f: FormData) => ({ ...(await action(prev, f)), email: String(f.get('email') ?? '') }),
    null as (FormState & { email?: string }) | null,
  );
  const login = mode === 'login';
  return (
    <div className="auth">
      <div className="auth__card">
        <span className="sticker" aria-hidden="true">É</span>
        <h1>{login ? 'Masuk' : 'Buat akun'}</h1>
        <p>{login ? 'Masuk untuk melihat akunmu atau mengelola menu.' : 'Cukup email dan password. Tidak perlu akun untuk memesan.'}</p>
        <form action={run} className="form">
          {next && <input type="hidden" name="next" value={next} />}
          {state?.error && <div className="galat" role="alert">{state.error}</div>}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="input" autoComplete="email" defaultValue={state?.email} required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="input" required minLength={login ? undefined : 6}
              autoComplete={login ? 'current-password' : 'new-password'} />
            {!login && <small>Minimal 6 karakter.</small>}
          </div>
          <button className="btn btn--kuning btn--block" disabled={pending}>
            {pending ? 'Memproses…' : login ? 'Masuk' : 'Buat akun'}
          </button>
        </form>
        <p className="auth__alt">
          {login ? <>Belum punya akun? <Link href="/register">Buat akun</Link></> : <>Sudah punya akun? <Link href="/login">Masuk</Link></>}
        </p>
      </div>
    </div>
  );
}
