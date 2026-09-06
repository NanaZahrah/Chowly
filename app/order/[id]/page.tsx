'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function OrderConfirmation() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])

  useEffect(() => {
    async function loadOrder() {
      const { data: orderData } = await supabase
        .from('order')
        .select('*')
        .eq('orderid', id)
        .single()
      setOrder(orderData)

      const { data: itemsData } = await supabase
        .from('orderitem')
        .select('*, menuitem(itemname)')
        .eq('orderitemorderid', id)
      setOrderItems(itemsData || [])
    }
    loadOrder()
  }, [id])

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
