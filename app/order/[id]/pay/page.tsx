'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

const GUEST_ID = '62a83336-cb54-4e92-984e-71fa7c07b0d5'

export default function Pay() {
  const { id } = useParams()
  const [method, setMethod] = useState('CARD')
  const [amount, setAmount] = useState('')
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)
    async function handlePay() {
    setPaying(true)

    await supabase.from('payment').insert({
      amount: parseFloat(amount) || 0,
      paymentmethod: method,
      paymentstatus: 'SUCCESSFUL',
      istestpayment: true,
      paymentcustomerid: GUEST_ID,
      paymentorderid: id
    })

    await supabase.from('order').update({ orderstatus: 'PAID' }).eq('orderid', id)

    setPaying(false)
    setPaid(true)
  }
    if (paid) {
    return (
      <main style={{ backgroundColor: '#1A1512', minHeight: '100vh', color: '#F2EDE4', padding: '80px 24px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '16px' }}>
            Payment successful
          </h1>
          <p style={{ color: '#C9C0B2', marginBottom: '8px' }}>
            ₦{amount} paid via {method} for order #{id.slice(0, 8)}.
          </p>
          <p style={{ color: '#6B7156', fontSize: '13px', marginBottom: '32px' }}>
            This is a simulated payment — no real money was charged.
          </p>
          <a href="/menu" style={{ color: '#E8590C', textDecoration: 'none' }}>
            ← Back to menu
          </a>
        </div>
      </main>
    )
  }
    return (
    <main style={{ backgroundColor: '#1A1512', minHeight: '100vh', color: '#F2EDE4', padding: '80px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <p style={{ color: '#E8590C', fontSize: '13px', marginBottom: '8px' }}>
          PRETEND PAYMENT — no real charge
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', marginBottom: '32px' }}>
          Pay for Order #{id.slice(0, 8)}
        </h1>

        <p style={{ marginBottom: '8px' }}>Amount (₦)</p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          style={{
            width: '100%', padding: '12px', backgroundColor: '#1A1512',
            color: '#F2EDE4', border: '1px solid #6B7156', borderRadius: '4px',
            marginBottom: '24px'
          }}
        />

        <p style={{ marginBottom: '8px' }}>Payment method</p>
        <select value={method} onChange={(e) => setMethod(e.target.value)} style={{
          width: '100%', padding: '12px', backgroundColor: '#1A1512',
          color: '#F2EDE4', border: '1px solid #6B7156', borderRadius: '4px',
                    marginBottom: '32px'
        }}>
          <option value="CARD">Card</option>
          <option value="CASH">Cash</option>
          <option value="USSD TRANSFER">USSD Transfer</option>
        </select>

        <button onClick={handlePay} disabled={paying || !amount} style={{
          backgroundColor: '#E8590C', color: '#1A1512', padding: '14px 28px',
          border: 'none', borderRadius: '4px', fontWeight: 'bold',
          fontSize: '16px', cursor: 'pointer', width: '100%'
        }}>
          {paying ? 'Processing (pretend)...' : 'Confirm Pretend Payment'}
        </button>
      </div>
    </main>
  )
}