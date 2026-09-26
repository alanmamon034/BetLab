import { useState } from 'react';

export default function Deposit() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);

  async function submit(e) {
    e.preventDefault();
    const res = await fetch('/api/mpesa/stkpush', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, amount }),
    });
    setResult(await res.json());
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
        <button type="submit">Send STK Push</button>
      </form>
      {result && <pre style={{ background: '#f4f4f4', padding: 12 }}>{JSON.stringify(result, null, 2)}</pre>}

      {/* INTENTIONAL LAB BUG: consumer key rendered client-side via
          NEXT_PUBLIC_ var, same pattern as the odds widget on the
          homepage. Two independent places to practice finding it. */}
      <p style={{ fontSize: 11, color: '#bbb', marginTop: 24 }}>
        Merchant integration: {process.env.NEXT_PUBLIC_DARAJA_CONSUMER_KEY?.slice(0, 8)}…
      </p>
    </div>
  );
}
