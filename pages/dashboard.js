export default function Dashboard() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 500, margin: '40px auto' }}>
      <h1>Dashboard</h1>
      <p>(Lab note: this page doesn't check auth server-side yet either — that's fine, we'll harden it later once you've practiced finding these gaps.)</p>
      <p><a href="/">Home</a></p>
    </div>
  );
}
