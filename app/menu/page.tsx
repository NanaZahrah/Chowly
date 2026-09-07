// @ts-nocheck
'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

const GUEST_ID = '62a83336-cb54-4e92-984e-71fa7c07b0d5'

export default function Menu() {
  const [items, setItems] = useState<any[]>([])
  const [cart, setCart] = useState<Record<string, number>>({})
  const [placing, setPlacing] = useState(false)
  const [activeCategory, setActiveCategory] = useState('ALL')
  const router = useRouter()

  useEffect(() => {
    async function loadMenu() {
      const { data, error } = await supabase.from('menuitem').select('*')
      if (error) console.error(error)
      else setItems(data)
    }
    loadMenu()
  }, [])

  const categories = ['ALL', 'FOOD', 'DRINK', 'DESSERT']

  function addItem(itemId: any) {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }))
  }

  function removeItem(itemId: any) {
    setCart((prev) => {
      const updated = { ...prev }
      if (updated[itemId] > 1) updated[itemId] -= 1
      else delete updated[itemId]
      return updated
    })
  }

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = items.find((i) => i.menuitemid === id)
    return sum + (item ? item.priceofitem * qty : 0)
  }, 0)

  async function placeOrder() {
    setPlacing(true)

    const estimatedWait = Object.entries(cart).reduce((max, [id, qty]) => {
      const item = items.find((i) => i.menuitemid === id)
      return Math.max(max, item ? item.preptime : 0)
    }, 0)

    const { data: order, error: orderError } = await supabase
      .from('order')
      .insert({
        ordercustomerid: GUEST_ID,
        orderstatus: 'PENDING',
        waitingtime: estimatedWait
      })
      .select()
      .single()

    if (orderError) {
      console.error(orderError)
      setPlacing(false)
      return
    }

    const orderItems = Object.entries(cart).map(([itemId, qty]) => {
      const item = items.find((i) => i.menuitemid === itemId)
      return {
        orderitemorderid: order.orderid,
        orderitemmenuitemid: itemId,
        quantity: qty,
        unitprice: item.priceofitem
      }
    })

    const { error: itemsError } = await supabase.from('orderitem').insert(orderItems)

    if (itemsError) {
      console.error(itemsError)
      setPlacing(false)
      return
    }

    router.push(`/order/${order.orderid}`)
  }

  const visibleItems = activeCategory === 'ALL'
    ? items
    : items.filter((item) => item.itemtype === activeCategory)

  return (
    <main style={{ backgroundColor: '#15130F', minHeight: '100vh', color: '#EDE8DE', padding: '48px 24px 160px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 'normal', fontSize: '34px', marginBottom: '28px' }}>
          Menu
        </h1>

        <div style={{
          display: 'flex', gap: '10px', marginBottom: '32px',
          overflowX: 'auto', paddingBottom: '4px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px', borderRadius: '20px', whiteSpace: 'nowrap',
                border: activeCategory === cat ? '1px solid #B8935F' : '1px solid #2A2620',
                backgroundColor: activeCategory === cat ? '#B8935F' : 'transparent',
                color: activeCategory === cat ? '#15130F' : '#8A8378',
                fontSize: '13px', letterSpacing: '0.03em', cursor: 'pointer'
              }}
            >
              {cat === 'ALL' ? 'All' : cat === 'FOOD' ? 'Food' : cat === 'DRINK' ? 'Drinks' : 'Dessert'}
            </button>
          ))}
        </div>

        {items.length === 0 && <p style={{ color: '#8A8378' }}>Loading menu...</p>}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          {visibleItems.map((item) => (
            <div key={item.menuitemid} style={{
              border: '1px solid #2A2620',
              borderRadius: '10px',
              overflow: 'hidden',
              backgroundColor: '#1B1812',
              position: 'relative'
            }}>
              <div style={{
                position: 'relative', width: '100%', aspectRatio: '1 / 1',
                backgroundColor: '#242018', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontSize: '48px', opacity: 0.5 }}>
                  {item.itemtype === 'FOOD' ? '🍽' : item.itemtype === 'DRINK' ? '🥤' : '🍰'}
                </span>
                <div style={{
                  position: 'absolute', top: '8px', right: '8px',
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: 'rgba(21,19,15,0.7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', color: '#EDE8DE'
                }}>
                  ♡
                </div>
                <button
                  onClick={() => addItem(item.menuitemid)}
                  style={{
                    position: 'absolute', bottom: '-16px', right: '12px',
                    width: '34px', height: '34px', borderRadius: '50%',
                    backgroundColor: '#B8935F', color: '#15130F',
                    border: '3px solid #15130F', fontSize: '18px', fontWeight: 'bold',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  +
                </button>
              </div>

              <div style={{ padding: '20px 12px 12px' }}>
                <p style={{ fontSize: '14px', marginBottom: '4px', lineHeight: '1.3' }}>{item.itemname}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '14px', color: '#B8935F' }}>₦{item.priceofitem}</p>
                  {cart[item.menuitemid] > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => removeItem(item.menuitemid)} style={{
                        width: '20px', height: '20px', borderRadius: '50%',
                        border: '1px solid #2A2620', color: '#EDE8DE', background: 'none',
                        cursor: 'pointer', fontSize: '12px', lineHeight: 1
                      }}>−</button>
                      <span style={{ fontSize: '12px' }}>{cart[item.menuitemid]}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {cartCount > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          backgroundColor: '#15130F', borderTop: '1px solid #2A2620', padding: '20px 24px',
          display: 'flex', justifyContent: 'center'
        }}>
          <button onClick={placeOrder} disabled={placing} style={{
            maxWidth: '680px', width: '100%',
            backgroundColor: '#B8935F', color: '#15130F',
            padding: '15px', border: 'none', borderRadius: '2px',
            fontSize: '14px', letterSpacing: '0.03em', fontWeight: 'bold', cursor: 'pointer'
          }}>
            {placing ? 'PLACING ORDER...' : `PLACE ORDER — ${cartCount} ITEM(S) — ₦${cartTotal}`}
          </button>
        </div>
      )}
    </main>
  )
}