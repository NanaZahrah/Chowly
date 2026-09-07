// @ts-nocheck
'use client'
export const dynamic = 'force-dynamic'

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
      <main style={{ backgroundColor: '#15130F', minHeight: '100vh', color: '#EDE8DE', padding: '64px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 'normal', fontSize: '30px', marginBottom: '16px' }}>
            Payment successful
          </h1>
          <p style={{ color: '#8A8378', marginBottom: '8px', fontSize: '14px' }}>
            ₦{amount} paid via {method} for order #{id.slice(0, 8)}.
          </p>
          <p style={{ color: '#8A8378', fontSize: '12px', marginBottom: '28px', opacity: 0.7 }}>
            This is a simulated payment — no real money was charged.
          </p>
          <a href="/menu" style={{ color: '#B8935F', textDecoration: 'none', fontSize: '13px' }}>
            ← Back to menu
          </a>
        </div>
      </main>
    )
  }

  return (
    <main style={{ backgroundColor: '#15130F', minHeight: '100vh', color: '#EDE8DE', padding: '64px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <p style={{ color: '#B8935F', fontSize: '12px', letterSpacing: '0.05em', marginBottom: '10px' }}>
          PRETEND PAYMENT — NO REAL CHARGE
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 'normal', fontSize: '32px', marginBottom: '36px' }}>
          Pay for Order #{id.slice(0, 8)}
        </h1>

        <p style={{ marginBottom: '10px', fontSize: '14px', color: '#8A8378' }}>Amount (₦)</p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          style={{
            width: '100%', padding: '14px', backgroundColor: '#15130F',
            color: '#EDE8DE', border: '1px solid #2A2620', borderRadius: '2px',
            marginBottom: '28px', fontSize: '14px'
          }}
        />

        <p style={{ marginBottom: '10px', fontSize: '14px', color: '#8A8378' }}>Payment method</p>
        <select value={method} onChange={(e) => setMethod(e.target.value)} style={{
          width: '100%', padding: '14px', backgroundColor: '#15130F',
          color: '#EDE8DE', border: '1px solid #2A2620', borderRadius: '2px',
          marginBottom: '36px', fontSize: '14px'
        }}>
          <option value="CARD">Card</option>
          <option value="CASH">Cash</option>
          <option value="USSD TRANSFER">USSD Transfer</option>
        </select>

        <button onClick={handlePay} disabled={paying || !amount} style={{
          backgroundColor: '#B8935F', color: '#15130F', padding: '15px 28px',
          border: 'none', borderRadius: '2px', fontWeight: 'bold',
          fontSize: '13px', letterSpacing: '0.03em', cursor: 'pointer', width: '100%'
        }}>
          {paying ? 'PROCESSING (PRETEND)...' : 'CONFIRM PRETEND PAYMENT'}
        </button>
      </div>
    </main>
  )
}