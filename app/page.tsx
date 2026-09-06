export default function Home() {
  return (
    <main style={{ backgroundColor: '#1A1512', minHeight: '100vh', color: '#F2EDE4' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 24px' }}>
        <p style={{ color: '#E8590C', fontSize: '14px', letterSpacing: '0.05em', marginBottom: '16px' }}>
          Dining in — order from your table
        </p>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '56px',
          lineHeight: '1.1',
          marginBottom: '16px'
        }}>
          Chowly
        </h1>
        <p style={{ fontSize: '20px', color: '#C9C0B2', marginBottom: '40px' }}>
          Browse the menu, place your order, and settle up — all from where you're sitting.
        </p>

        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="/menu" style={{
            backgroundColor: '#E8590C',
            color: '#1A1512',
            padding: '14px 28px',
            fontWeight: 'bold',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            View Menu
          </a>
          <a href="/waiter" style={{
            color: '#F2EDE4',
            padding: '14px 28px',
            border: '1px solid #6B7156',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            Switch to Waiter
          </a>
        </div>
      </div>
    </main>
  )
}