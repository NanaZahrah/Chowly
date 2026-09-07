// @ts-nocheck
'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function OrderConfirmation() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [timeLeft, setTimeLeft] = useState(null)
  const [guessResult, setGuessResult] = useState(null)
  const [revealedDish, setRevealedDish] = useState(null)

  useEffect(() => {
    async function loadOrder() {
      const { data: orderData } = await supabase
        .from('order')
        .select('*')
        .eq('orderid', id)
        .single()
      setOrder(orderData)
      if (orderData) setTimeLeft(orderData.waitingtime * 60)

      const { data: itemsData } = await supabase
        .from('orderitem')
        .select('*, menuitem(itemname)')
        .eq('orderitemorderid', id)
      setOrderItems(itemsData || [])
    }
    loadOrder()
  }, [id])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  async function playGuessGame() {
    const { data: allItems } = await supabase.from('menuitem').select('*')
    if (!allItems || allItems.length === 0) return
    const random = allItems[Math.floor(Math.random() * allItems.length)]
    setRevealedDish(random)
    setGuessResult(null)
  }

  function checkGuess(guess) {
    if (!revealedDish) return
    setGuessResult(guess === revealedDish.itemtype ? 'correct' : 'wrong')
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (!order) {
    return (
      <main style={{ backgroundColor: '#15130F', minHeight: '100vh', color: '#EDE8DE', padding: '64px 24px' }}>
        <p style={{ color: '#8A8378' }}>Loading order...</p>
      </main>
    )
  }

  const total = orderItems.reduce((sum, oi) => sum + oi.unitprice * oi.quantity, 0)

  return (
    <main style={{ backgroundColor: '#15130F', minHeight: '100vh', color: '#EDE8DE', padding: '64px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <p style={{ color: '#B8935F', fontSize: '12px', letterSpacing: '0.08em', marginBottom: '12px' }}>ORDER CONFIRMED</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 'normal', fontSize: '32px', marginBottom: '12px' }}>
          Order #{order.orderid.slice(0, 8)}
        </h1>
        <p style={{ color: '#8A8378', marginBottom: '36px', fontSize: '14px' }}>
          Status: <strong style={{ color: '#EDE8DE' }}>{order.orderstatus}</strong> · Estimated wait: <strong style={{ color: '#EDE8DE' }}>{order.waitingtime} mins</strong>
        </p>

        {order.orderstatus === 'PREPARING' && timeLeft > 0 && (
          <div style={{ border: '1px solid #2A2620', borderRadius: '2px', padding: '24px', marginBottom: '28px', textAlign: 'center' }}>
            <p style={{ color: '#8A8378', fontSize: '12px', letterSpacing: '0.05em', marginBottom: '8px' }}>TIME REMAINING</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '38px', color: '#B8935F', fontWeight: 'normal' }}>{formatTime(timeLeft)}</p>
          </div>
        )}

        {order.orderstatus === 'PREPARING' && (
          <div style={{ border: '1px solid #2A2620', borderRadius: '2px', padding: '24px', marginBottom: '28px' }}>
            <p style={{ marginBottom: '16px', fontSize: '14px', color: '#8A8378' }}>Bored waiting? Guess the dish category</p>
            {!revealedDish ? (
              <button onClick={playGuessGame} style={{
                color: '#EDE8DE', padding: '10px 20px', border: '1px solid #2A2620',
                borderRadius: '2px', background: 'none', cursor: 'pointer', fontSize: '13px'
              }}>
                Reveal a mystery dish
              </button>
            ) : (
              <div>
                <p style={{ fontSize: '16px', marginBottom: '16px' }}>"{revealedDish.itemname}" — what category is it?</p>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  {['FOOD', 'DRINK', 'DESSERT'].map((cat) => (
                    <button key={cat} onClick={() => checkGuess(cat)} style={{
                      padding: '8px 16px', border: '1px solid #2A2620', borderRadius: '2px',
                      background: 'none', color: '#EDE8DE', cursor: 'pointer', fontSize: '13px'
                    }}>
                      {cat}
                    </button>
                  ))}
                </div>
                {guessResult && (
                  <p style={{ color: guessResult === 'correct' ? '#B8935F' : '#8A8378', fontSize: '14px' }}>
                    {guessResult === 'correct' ? 'Correct.' : `Not quite — it's ${revealedDish.itemtype}`}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{ marginBottom: '28px' }}>
          {orderItems.map((oi) => (
            <div key={oi.orderitemid} style={{
              display: 'flex', justifyContent: 'space-between',
              borderBottom: '1px solid #2A2620', padding: '14px 0'
            }}>
              <p style={{ fontSize: '15px' }}>{oi.quantity} × {oi.menuitem?.itemname}</p>
              <p style={{ color: '#8A8378', fontSize: '15px' }}>₦{oi.unitprice * oi.quantity}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', marginBottom: '36px' }}>
          <p>Total</p>
          <p style={{ color: '#B8935F' }}>₦{total}</p>
        </div>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <a href={`/order/${order.orderid}/complaint`} style={{
            color: '#EDE8DE', padding: '12px 22px', border: '1px solid #2A2620',
            textDecoration: 'none', borderRadius: '2px', fontSize: '13px', letterSpacing: '0.02em'
          }}>
            FILE A COMPLAINT
          </a>
          <a href={`/order/${order.orderid}/pay`} style={{
            backgroundColor: '#B8935F', color: '#15130F', padding: '12px 22px',
            textDecoration: 'none', borderRadius: '2px', fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.02em'
          }}>
            PAY NOW
          </a>
        </div>
      </div>
    </main>
  )
}