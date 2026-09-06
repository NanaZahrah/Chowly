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
  const router = useRouter()

  useEffect(() => {
    async function loadMenu() {
      const { data, error } = await supabase.from('menuitem').select('*')
      if (error) console.error(error)
      else setItems(data)
    }
    loadMenu()
  }, [])

  const categories = ['FOOD', 'DRINK', 'DESSERT']

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

  return (
    <main style={{ backgroundColor: '#15130F', minHeight: '100vh', color: '#EDE8DE', padding: '64px 24px 160px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 'normal', fontSize: '36px', marginBottom: '48px' }}>
          Menu
        </h1>

        {items.length === 0 && <p style={{ color: '#8A8378' }}>Loading menu...</p>}

        {categories.map((cat) => (
          <div key={cat} style={{ marginBottom: '44px' }}>
            <p style={{ color: '#B8935F', fontSize: '12px', letterSpacing: '0.1em', marginBottom: '16px' }}>
              {cat === 'FOOD' ? 'FOOD' : cat === 'DRINK' ? 'DRINKS' : 'DESSERT'}
            </p>
            {items.filter((item) => item.itemtype === cat).map((item) => (
              <div key={item.menuitemid} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #2A2620',
                padding: '16px 0'
              }}>
                <div>
                  <p style={{ fontSize: '16px', marginBottom: '4px' }}>{item.itemname}</p>
                  <p style={{ fontSize: '14px', color: '#8A8378' }}>₦{item.priceofitem}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {cart[item.menuitemid] > 0 && (
                    <>
                      <button onClick={() => removeItem(item.menuitemid)} style={{
                        width: '26px', height: '26px', borderRadius: '2px',
                        border: '1px solid #2A2620', color: '#EDE8DE', background: 'none', cursor: 'pointer', fontSize: '14px'
                      }}>−</button>
                      <span style={{ fontSize: '14px', minWidth: '12px', textAlign: 'center' }}>{cart[item.menuitemid]}</span>
                    </>
                  )}
                  <button onClick={() => addItem(item.menuitemid)} style={{
                    width: '26px', height: '26px', borderRadius: '2px',
                    border: '1px solid #B8935F', color: '#B8935F', background: 'none', cursor: 'pointer', fontSize: '14px'
                  }}>+</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {cartCount > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          backgroundColor: '#15130F', borderTop: '1px solid #2A2620', padding: '20px 24px',
          display: 'flex', justifyContent: 'center'
        }}>
          <button onClick={placeOrder} disabled={placing} style={{
            maxWidth: '600px', width: '100%',
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