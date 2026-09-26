// --- Mock Daraja STK Push endpoint ---
// This does NOT call Safaricom's real API. It's a lab stand-in that
// simulates the request/response shape of a real Daraja integration
// so you can practice finding the same classes of bugs that show up
// in real M-Pesa integrations.
//
// INTENTIONAL LAB BUG: the "debug" response echoes back the shortcode
// and a truncated passkey "just for troubleshooting" — a real-world
// habit that leaks more than intended into logs/responses.

import { sql, ensureSchema } from '../../../lib/db';

function buildDarajaPassword() {
  const shortcode = process.env.DARAJA_SHORTCODE;
  const passkey = process.env.DARAJA_PASSKEY;
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
  return { password, timestamp };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await ensureSchema();

  const { phone, amount, userId } = req.body;
  if (!phone || !amount) return res.status(400).json({ error: 'phone and amount required' });

  // In a real integration this is where you'd POST to Safaricom's
  // /mpesa/stkpush/v1/processrequest using an OAuth token derived from
  // DARAJA_CONSUMER_KEY / DARAJA_CONSUMER_SECRET. We mock that here.
  const { password, timestamp } = buildDarajaPassword();

  const mockCheckoutRequestId = 'ws_CO_' + Date.now();

  await sql`
    INSERT INTO bets (user_id, match_name, amount, odds)
    VALUES (${userId || null}, ${'DEPOSIT via M-Pesa'}, ${amount}, ${1});
  `;

  res.status(200).json({
    ResponseCode: '0',
    ResponseDescription: 'Success. Request accepted for processing (mock)',
    CheckoutRequestID: mockCheckoutRequestId,
    // INTENTIONAL LAB BUG: over-sharing "debug" fields in the response
    debug: {
      shortcode: process.env.DARAJA_SHORTCODE,
      password_preview: password.slice(0, 10) + '...',
      timestamp,
    },
  });
}
