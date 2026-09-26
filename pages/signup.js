import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) router.push('/dashboard');
    else setError((await res.json()).error);
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 400, margin: '40px auto' }}>
      <h1>Sign up</h1>
      <form onSubmit={submit}>
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
        <button type="submit">Create account</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
