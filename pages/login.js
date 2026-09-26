import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) router.push('/dashboard');
    else setError((await res.json()).error);
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 400, margin: '40px auto' }}>
      <h1>Log in</h1>
      <form onSubmit={submit}>
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
        <button type="submit">Log in</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
