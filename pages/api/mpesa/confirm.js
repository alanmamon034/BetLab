// --- Mock Daraja "confirm payment" callback ---
// In a REAL Daraja integration, Safaricom's servers call YOUR backend
// directly (a server-to-server callback) once a payment actually
// completes, and you credit the user's balance based on THAT trusted
// server-to-server call. The client's browser should never be able to
// trigger a balance credit directly.
//
// INTENTIONAL LAB BUG (IDOR + client-trust): this mock instead lets the
// BROWSER call this endpoint directly and tell the server "here's the
// userId and amount to credit" - exactly the anti-pattern described
// above. Nothing here verifies:
//   1. That a real payment actually happened
//   2. That the caller is actually the userId they're claiming to be
//   3. That the amount matches what was actually requested in stkpush
//
// This mirrors real-world incidents where a "payment success" webhook
// or confirm endpoint is callable directly by a client, letting an
// attacker credit their own account (or someone else's) with arbitrary
// amounts just by crafting the right request.

import { sql, ensureSchema } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await ensureSchema();

  const { userId, amount, checkoutRequestId } = req.body;
  if (!userId || !amount) {
    return res.status(400).json({ error: 'userId and amount required' });
  }

  // No verification that checkoutRequestId corresponds to a real,
  // completed STK push. No verification that `userId` belongs to the
  // caller. No verification that `amount` matches what was actually
  // requested. The server just... trusts it.
  const result = await sql`
    UPDATE users
    SET balance = balance + ${amount}
    WHERE id = ${userId}
    RETURNING id, email, balance;
  `;

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'user not found' });
  }

  res.status(200).json({
    status: 'credited',
    checkoutRequestId: checkoutRequestId || null,
    user: result.rows[0],
  });
}
