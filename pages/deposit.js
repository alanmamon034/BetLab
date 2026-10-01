import { useState } from 'react';

export default function Deposit() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState('');
  const [result, setResult] = useState(null);
  const [confirmResult, setConfirmResult] = useState(null);

  async function submit(e) {
    e.preventDefault();
    const res = await fetch('/api/mpesa/stkpush', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, amount }),
    });
    setResult(await res.json());
  }

  // INTENTIONAL LAB BUG: this "confirm" button calls the confirm API
  // directly from the browser, sending whatever amount/userId are
  // currently in the form fields - exactly what a real payment
  // confirmation should never let the client control.
  async function confirmDeposit() {
    const res = await fetch('/api/mpesa/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        amount,
        checkoutRequestId: result?.CheckoutRequestID,
      }),
    });
    setConfirmResult(await res.json());
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 420, margin: '40px auto' }}>
      <h1>Deposit via M-Pesa (mock)</h1>
      <p style={{ fontSize: 13, color: '#888' }}>
        No real Safaricom API is called. This simulates the STK push flow for lab purposes.
      </p>
      <form onSubmit={submit}>
        <input placeholder="07XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} /><br />
        <input placeholder="amount (KES)" value={amount} onChange={(e) => setAmount(e.target.value)} /><br />
        <input placeholder="your user id (see /dashboard)" value={userId} onChange={(e) => setUserId(e.target.value)} /><br />
        <button type="submit">Send STK Push</button>
      </form>
      {result && <pre style={{ background: '#f4f4f4', padding: 12 }}>{JSON.stringify(result, null, 2)}</pre>}

      {result && (
        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: 13, color: '#888' }}>
            Simulate the "payment confirmed" callback (normally Safaricom would call this server-to-server):
          </p>
          <button onClick={confirmDeposit}>Confirm Payment Received</button>
        </div>
      )}
      {confirmResult && <pre style={{ background: '#f4f4f4', padding: 12, marginTop: 12 }}>{JSON.stringify(confirmResult, null, 2)}</pre>}

      {/* INTENTIONAL LAB BUG: consumer key rendered client-side via
          NEXT_PUBLIC_ var, same pattern as the odds widget on the
          homepage. Two independent places to practice finding it. */}
      <p style={{ fontSize: 11, color: '#bbb', marginTop: 24 }}>
        Merchant integration: {process.env.NEXT_PUBLIC_DARAJA_CONSUMER_KEY?.slice(0, 8)}…
      </p>
    </div>
  );
}
