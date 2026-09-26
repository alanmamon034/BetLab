import { useState } from 'react';

export default function Admin() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    const res = await fetch('/api/admin/users');
    if (res.ok) setUsers((await res.json()).users);
    else setError('Not authorized');
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '40px auto' }}>
      <h1>Admin</h1>
      <button onClick={load}>Load users</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {users && (
        <table border="1" cellPadding="6" style={{ marginTop: 16 }}>
          <thead><tr><th>id</th><th>email</th><th>balance</th><th>is_admin</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}><td>{u.id}</td><td>{u.email}</td><td>{u.balance}</td><td>{String(u.is_admin)}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
