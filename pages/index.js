const MOCK_MATCHES = [
  { id: 1, name: 'Falcons vs Wolves', odds: 1.85 },
  { id: 2, name: 'Sharks vs Eagles', odds: 2.10 },
  { id: 3, name: 'Titans vs Comets', odds: 1.55 },
];

export default function Home() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 640, margin: '40px auto' }}>
      <h1>BetLab (Demo — fake money only)</h1>
      <p>This is a deliberately vulnerable lab app. Not a real betting site.</p>

      <h2>Today's Matches</h2>
      <ul>
        {MOCK_MATCHES.map((m) => (
          <li key={m.id}>{m.name} — odds {m.odds}</li>
        ))}
      </ul>

      <p>
        <a href="/signup">Sign up</a> · <a href="/login">Log in</a> · <a href="/dashboard">Dashboard</a> ·{' '}
        <a href="/admin">Admin</a>
      </p>

      {/* INTENTIONAL LAB BUG: this odds "widget" reads a NEXT_PUBLIC_ env
          var and renders it into the page, meaning it ships in the
          client JS bundle for anyone to view via page source / devtools. */}
      <OddsWidget />
    </div>
  );
}

function OddsWidget() {
  const key = process.env.NEXT_PUBLIC_ODDS_API_KEY;
  return (
    <div style={{ marginTop: 24, fontSize: 12, color: '#888' }}>
      Odds feed status: connected (key: {key ? key.slice(0, 6) + '…' : 'missing'})
    </div>
  );
}
