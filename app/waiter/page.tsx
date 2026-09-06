// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Waiter() {
  const [orders, setOrders] = useState([])
  const [staff, setStaff] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [chefId, setChefId] = useState('')
  const [bartenderId, setBartenderId] = useState('')

  useEffect(() => {
    loadOrders()
    loadStaff()
  }, [])

  async function loadOrders() {
    const { data } = await supabase
      .from('order')
      .select('*, customer(customername)')
      .order('orderdate', { ascending: false })
    setOrders(data || [])
  }

  async function loadStaff() {
    const { data } = await supabase.from('staff').select('*')
    setStaff(data || [])
  }
    async function assignOrder(orderId) {
    const { error } = await supabase
      .from('order')
      .update({ orderchefid: chefId, orderbartenderid: bartenderId })
      .eq('orderid', orderId)

    if (!error) {
      setSelectedOrder(null)
      setChefId('')
      setBartenderId('')
      loadOrders()
    }
  }

  async function markServed(orderId) {
    await supabase.from('order').update({ orderstatus: 'SERVED' }).eq('orderid', orderId)
    loadOrders()
  }

  const chefs = staff.filter((s) => s.staffrole === 'CHEF')
  const bartenders = staff.filter((s) => s.staffrole === 'BARTENDER')
    return (
    <main style={{ backgroundColor: '#1A1512', minHeight: '100vh', color: '#F2EDE4', padding: '80px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '40px', marginBottom: '40px' }}>
          Waiter View
        </h1>

        {orders.length === 0 && <p style={{ color: '#C9C0B2' }}>No orders yet.</p>}
                {orders.map((order) => (
          <div key={order.orderid} style={{
            border: '1px solid #3A332C', borderRadius: '4px',
            padding: '16px', marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <p>Order #{order.orderid.slice(0, 8)}</p>
              <p style={{ color: '#E8590C' }}>{order.orderstatus}</p>
            </div>
            <p style={{ color: '#C9C0B2', fontSize: '14px', marginBottom: '12px' }}>
              Wait: {order.waitingtime} mins {order.orderchefid && '· Assigned'}
            </p>
                        {selectedOrder === order.orderid ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <select value={chefId} onChange={(e) => setChefId(e.target.value)} style={{
                  padding: '8px', backgroundColor: '#1A1512', color: '#F2EDE4', border: '1px solid #6B7156'
                }}>
                  <option value="">Select chef</option>
                  {chefs.map((c) => (
                    <option key={c.staffid} value={c.staffid}>{c.staffname}</option>
                  ))}
                </select>
                                <select value={bartenderId} onChange={(e) => setBartenderId(e.target.value)} style={{
                  padding: '8px', backgroundColor: '#1A1512', color: '#F2EDE4', border: '1px solid #6B7156'
                }}>
                  <option value="">Select bartender</option>
                  {bartenders.map((b) => (
                    <option key={b.staffid} value={b.staffid}>{b.staffname}</option>
                  ))}
                </select>
                <button onClick={() => assignOrder(order.orderid)} style={{
                  backgroundColor: '#E8590C', color: '#1A1512', padding: '10px',
                  border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'
                }}>
                  Confirm Assignment
                </button>
              </div>
            ) : (
                              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setSelectedOrder(order.orderid)} style={{
                  color: '#F2EDE4', padding: '8px 16px', border: '1px solid #6B7156',
                  borderRadius: '4px', background: 'none', cursor: 'pointer'
                }}>
                  Assign Staff
                </button>
                <button onClick={() => markServed(order.orderid)} style={{
                  color: '#F2EDE4', padding: '8px 16px', border: '1px solid #6B7156',
                  borderRadius: '4px', background: 'none', cursor: 'pointer'
                }}>
                  Mark Served
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}