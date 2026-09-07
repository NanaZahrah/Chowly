export default function Home() {
  return (
    <main style={{ backgroundColor: '#15130F', minHeight: '100vh', color: '#EDE8DE' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '100px 24px' }}>
        <p style={{ color: '#B8935F', fontSize: '13px', letterSpacing: '0.08em', marginBottom: '20px' }}>
          DINING IN — ORDER FROM YOUR TABLE
        </p>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontWeight: 'normal',
          fontSize: '58px',
          lineHeight: '1.15',
          letterSpacing: '0.01em',
          marginBottom: '20px'
        }}>
          Chowly
        </h1>
        <p style={{ fontSize: '18px', color: '#8A8378', marginBottom: '48px', lineHeight: '1.6', maxWidth: '440px' }}>
          Browse the menu, place your order, and settle up — all from where you're sitting.
        </p>

        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="/menu" style={{
            backgroundColor: '#B8935F',
            color: '#15130F',
            padding: '14px 32px',
            fontSize: '14px',
            letterSpacing: '0.03em',
            fontWeight: 'bold',
            textDecoration: 'none',
            borderRadius: '2px'
          }}>
            VIEW MENU
          </a>
          <a href="/waiter" style={{
            color: '#EDE8DE',
            padding: '14px 32px',
            fontSize: '14px',
            letterSpacing: '0.03em',
            border: '1px solid #2A2620',
            textDecoration: 'none',
            borderRadius: '2px'
          }}>
            SWITCH TO WAITER
          </a>
        </div>
      </div>
    </main>
  )
}