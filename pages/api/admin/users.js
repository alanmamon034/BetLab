import { sql, ensureSchema } from '../../../lib/db';

// --- INTENTIONAL LAB BUG: Broken Access Control ---
// A real admin endpoint should call verifySession(token) and check
// decoded.is_admin === true server-side. This one only checks for the
// PRESENCE of a session cookie, not whether the user is actually an admin,
// and it also trusts a client-supplied header as a shortcut. That means
// any logged-in user (or anyone who sets the header) can pull every
// user's data, including email + balance. This mirrors real IDOR /
// broken access control bugs (OWASP A01:2025).
export default async function handler(req, res) {
  await ensureSchema();
  const hasCookie = (req.headers.cookie || '').includes('betlab_session=');
  const claimsAdmin = req.headers['x-betlab-admin'] === 'true';

  if (!hasCookie && !claimsAdmin) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const result = await sql`SELECT id, email, balance, is_admin, created_at FROM users ORDER BY id;`;
  res.status(200).json({ users: result.rows });
}
