import bcrypt from 'bcryptjs';
import { sql, ensureSchema } from '../../lib/db';
import { signSession } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await ensureSchema();
  const { email, password } = req.body;

  const result = await sql`SELECT * FROM users WHERE email = ${email};`;
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signSession(user);
  res.setHeader('Set-Cookie', `betlab_session=${token}; Path=/; HttpOnly; SameSite=Lax`);
  res.status(200).json({ user: { id: user.id, email: user.email, balance: user.balance, is_admin: user.is_admin } });
}
