// --- INTENTIONAL LAB BUG: Debug endpoint left in production ---
// Real incidents: devs leave a debug/status route enabled that echoes
// environment info "just for local testing" and forget to remove it,
// or forget to gate it behind NODE_ENV !== 'production'. Your job later:
// discover this route exists (via common-path wordlists / nuclei templates)
// and see what it exposes.
export default function handler(req, res) {
  res.status(200).json({
    node_env: process.env.NODE_ENV,
    has_jwt_secret: Boolean(process.env.JWT_SECRET),
    has_payments_key: Boolean(process.env.PAYMENTS_API_KEY),
    // Deliberately careless: dumping a value instead of just a boolean
    payments_key_preview: (process.env.PAYMENTS_API_KEY || '').slice(0, 8) + '...',
  });
}
