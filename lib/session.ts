import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type Session = { id: number; email: string; role: 'user' | 'admin' };

const secret = () => {
  const s = process.env.SESSION_SECRET;
  if (!s && process.env.NODE_ENV === 'production') throw new Error('SESSION_SECRET belum diisi');
  return new TextEncoder().encode(s || 'dev-only-secret-change-me');
};

export async function verify(token?: string): Promise<Session | null> {
  if (!token) return null;
  try {
    return (await jwtVerify(token, secret())).payload as unknown as Session;
  } catch {
    return null;
  }
}

export async function createSession(s: Session) {
  const token = await new SignJWT({ ...s }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(secret());
  (await cookies()).set('session', token, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 7 * 86400,
  });
}

export async function destroySession() {
  (await cookies()).delete('session');
}

export async function getSession() {
  return verify((await cookies()).get('session')?.value);
}

// dipanggil di setiap halaman & server action admin (middleware saja tidak cukup untuk server action)
export async function requireAdmin() {
  const s = await getSession();
  if (s?.role !== 'admin') redirect('/login?next=/admin');
  return s;
}
