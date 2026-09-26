// --- INTENTIONAL LAB BUG: weak "admin debug" gate ---
// Real-world pattern this mimics: a developer adds a quick debug route
// during integration testing, gates it with a hardcoded shared token
// "temporarily", and it never gets removed. Two bugs stacked here:
//   1. The token is compared via a plain `===` (no constant-time compare,
//      no rate limiting -> brute-forceable).
//   2. The token is accepted via a URL query string, which means it can
//      end up logged in server access logs, browser history, and
//      referrer headers.
export default function handler(req, res) {
  const token = req.query.token;

  if (token !== process.env.ADMIN_DEBUG_TOKEN) {
    return res.status(403).json({ error: 'forbidden' });
  }

  res.status(200).json({
    daraja_shortcode: process.env.DARAJA_SHORTCODE,
    daraja_consumer_secret_preview: (process.env.DARAJA_CONSUMER_SECRET || '').slice(0, 6) + '...',
    daraja_passkey_preview: (process.env.DARAJA_PASSKEY || '').slice(0, 6) + '...',
    node_env: process.env.NODE_ENV,
  });
}
