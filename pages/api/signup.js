import bcrypt from 'bcryptjs';
import { sql, ensureSchema } from '../../lib/db';
import { signSession } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await ensureSchema();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${hash})
      RETURNING id, email, balance, is_admin;
    `;
    const user = result.rows[0];
    const token = signSession(user);
    res.setHeader('Set-Cookie', `betlab_session=${token}; Path=/; HttpOnly; SameSite=Lax`);
    res.status(200).json({ user });
  } catch (e) {
    console.error('SIGNUP_ERROR', e);
    res.status(400).json({ error: 'Email already exists or DB error', debug_message: e.message });
  }
}
