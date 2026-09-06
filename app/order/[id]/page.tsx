   // @ts-nocheck
'use client'

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
      <main style={{ backgroundColor: '#1A1512', minHeight: '100vh', color: '#F2EDE4', padding: '80px 24px' }}>
        <p>Loading order...</p>
      </main>
    )
  }

  const total = orderItems.reduce((sum, oi) => sum + oi.unitprice * oi.quantity, 0)

  return (
    <main style={{ backgroundColor: '#1A1512', minHeight: '100vh', color: '#F2EDE4', padding: '80px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <p style={{ color: '#E8590C', fontSize: '14px', marginBottom: '8px' }}>Order confirmed</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', marginBottom: '8px' }}>
          Order #{order.orderid.slice(0, 8)}
        </h1>
        <p style={{ color: '#C9C0B2', marginBottom: '32px' }}>
          Status: <strong style={{ color: '#F2EDE4' }}>{order.orderstatus}</strong> · Estimated wait: <strong style={{ color: '#F2EDE4' }}>{order.waitingtime} mins</strong>
        </p>
                {order.orderstatus === 'PREPARING' && timeLeft > 0 && (
          <div style={{ border: '1px solid #E8590C', borderRadius: '4px', padding: '20px', marginBottom: '32px', textAlign: 'center' }}>
            <p style={{ color: '#6B7156', fontSize: '13px', marginBottom: '4px' }}>Time remaining</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '40px', color: '#E8590C' }}>{formatTime(timeLeft)}</p>
          </div>
        )}

        {order.orderstatus === 'PREPARING' && (
          <div style={{ border: '1px solid #3A332C', borderRadius: '4px', padding: '20px', marginBottom: '32px' }}>
            <p style={{ marginBottom: '12px' }}>Bored waiting? Guess the dish category</p>
            {!revealedDish ? (
              <button onClick={playGuessGame} style={{
                color: '#F2EDE4', padding: '10px 20px', border: '1px solid #6B7156',
                borderRadius: '4px', background: 'none', cursor: 'pointer'
              }}>
                Reveal a mystery dish
              </button>
            ) : (
              <div>
                <p style={{ fontSize: '18px', marginBottom: '12px' }}>"{revealedDish.itemname}" — what category is it?</p>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  {['FOOD', 'DRINK', 'DESSERT'].map((cat) => (
                    <button key={cat} onClick={() => checkGuess(cat)} style={{
                      padding: '8px 16px', border: '1px solid #6B7156', borderRadius: '4px',
                      background: 'none', color: '#F2EDE4', cursor: 'pointer'
                    }}>
                      {cat}
                    </button>
                  ))}
                </div>
                {guessResult && (
                  <p style={{ color: guessResult === 'correct' ? '#6B7156' : '#E8590C' }}>
                    {guessResult === 'correct' ? 'Correct! 🎉' : `Not quite — it's ${revealedDish.itemtype}`}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
                <div style={{ marginBottom: '32px' }}>
          {orderItems.map((oi) => (
            <div key={oi.orderitemid} style={{
              display: 'flex', justifyContent: 'space-between',
              borderBottom: '1px solid #3A332C', padding: '12px 0'
            }}>
              <p>{oi.quantity} × {oi.menuitem?.itemname}</p>
              <p style={{ color: '#E8590C' }}>₦{oi.unitprice * oi.quantity}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', marginBottom: '40px' }}>
          <p>Total</p>
          <p style={{ color: '#E8590C' }}>₦{total}</p>
        </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <a href={`/order/${order.orderid}/complaint`} style={{
            color: '#F2EDE4', padding: '12px 20px', border: '1px solid #6B7156',
            textDecoration: 'none', borderRadius: '4px', fontSize: '14px'
          }}>
            File a Complaint
          </a>
          <a href={`/order/${order.orderid}/pay`} style={{
            backgroundColor: '#E8590C', color: '#1A1512', padding: '12px 20px',
            textDecoration: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold'
          }}>
            Pay Now
          </a>
        </div>
      </div>
    </main>
  )
}
