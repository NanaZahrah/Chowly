   // @ts-nocheck
'use client'

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

  function addItem(itemId) {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }))
  }

  function addItem(itemId: any) {
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
        orderstatus: 'PREPARING',
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
    <main style={{ backgroundColor: '#1A1512', minHeight: '100vh', color: '#F2EDE4', padding: '80px 24px 140px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '40px', marginBottom: '40px' }}>
          Menu
        </h1>

        {items.length === 0 && <p style={{ color: '#C9C0B2' }}>Loading menu...</p>}

        {categories.map((cat) => (
          <div key={cat} style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#E8590C', fontSize: '20px', marginBottom: '12px' }}>
              {cat === 'FOOD' ? 'Food' : cat === 'DRINK' ? 'Drinks' : 'Dessert'}
            </h2>
            {items.filter((item) => item.itemtype === cat).map((item) => (
              <div key={item.menuitemid} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #3A332C',
                padding: '12px 0'
              }}>
                <div>
                  <p style={{ fontSize: '17px' }}>{item.itemname}</p>
                  <p style={{ fontSize: '15px', color: '#E8590C' }}>₦{item.priceofitem}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {cart[item.menuitemid] > 0 && (
                    <>
                      <button onClick={() => removeItem(item.menuitemid)} style={{
                        width: '28px', height: '28px', borderRadius: '4px',
                        border: '1px solid #6B7156', color: '#F2EDE4', background: 'none', cursor: 'pointer'
                      }}>−</button>
                      <span>{cart[item.menuitemid]}</span>
                    </>
                  )}
                  <button onClick={() => addItem(item.menuitemid)} style={{
                    width: '28px', height: '28px', borderRadius: '4px',
                    border: '1px solid #E8590C', color: '#E8590C', background: 'none', cursor: 'pointer'
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
          backgroundColor: '#E8590C', padding: '20px 24px',
          display: 'flex', justifyContent: 'center'
        }}>
          <button onClick={placeOrder} disabled={placing} style={{
            maxWidth: '640px', width: '100%',
            backgroundColor: '#1A1512', color: '#F2EDE4',
            padding: '14px', border: 'none', borderRadius: '4px',
            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
          }}>
            {placing ? 'Placing order...' : `Place Order — ${cartCount} item(s) — ₦${cartTotal}`}
          </button>
        </div>
      )}
    </main>
  )
}