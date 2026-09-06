// @ts-nocheck
'use client'
export const dynamic = 'force-dynamic'

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

  async function changeStatus(orderId, newStatus) {
    await supabase.from('order').update({ orderstatus: newStatus }).eq('orderid', orderId)
    loadOrders()
  }

  const chefs = staff.filter((s) => s.staffrole === 'CHEF')
  const bartenders = staff.filter((s) => s.staffrole === 'BARTENDER')
  const statusOptions = ['PENDING', 'PREPARING', 'DELAYED', 'READY', 'SERVED']

  return (
    <main style={{ backgroundColor: '#15130F', minHeight: '100vh', color: '#EDE8DE', padding: '64px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 'normal', fontSize: '36px', marginBottom: '44px' }}>
          Waiter View
        </h1>

        {orders.length === 0 && <p style={{ color: '#8A8378' }}>No orders yet.</p>}

        {orders.map((order) => (
          <div key={order.orderid} style={{
            border: '1px solid #2A2620', borderRadius: '2px',
            padding: '20px', marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <p style={{ fontSize: '15px' }}>Order #{order.orderid.slice(0, 8)}</p>
              <select
                value={order.orderstatus}
                onChange={(e) => changeStatus(order.orderid, e.target.value)}
                style={{
                  padding: '6px 10px', backgroundColor: '#15130F', color: '#B8935F',
                  border: '1px solid #2A2620', borderRadius: '2px', fontSize: '13px',
                  letterSpacing: '0.03em', cursor: 'pointer'
                }}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <p style={{ color: '#8A8378', fontSize: '13px', marginBottom: '16px' }}>
              Wait: {order.waitingtime} mins {order.orderchefid && '· Assigned'}
            </p>

            {selectedOrder === order.orderid ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <select value={chefId} onChange={(e) => setChefId(e.target.value)} style={{
                  padding: '10px', backgroundColor: '#15130F', color: '#EDE8DE', border: '1px solid #2A2620',
                  borderRadius: '2px', fontSize: '13px'
                }}>
                  <option value="">Select chef</option>
                  {chefs.map((c) => (
                    <option key={c.staffid} value={c.staffid}>{c.staffname}</option>
                  ))}
                </select>
                <select value={bartenderId} onChange={(e) => setBartenderId(e.target.value)} style={{
                  padding: '10px', backgroundColor: '#15130F', color: '#EDE8DE', border: '1px solid #2A2620',
                  borderRadius: '2px', fontSize: '13px'
                }}>
                  <option value="">Select bartender</option>
                  {bartenders.map((b) => (
                    <option key={b.staffid} value={b.staffid}>{b.staffname}</option>
                  ))}
                </select>
                <button onClick={() => assignOrder(order.orderid)} style={{
                  backgroundColor: '#B8935F', color: '#15130F', padding: '11px',
                  border: 'none', borderRadius: '2px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
                }}>
                  CONFIRM ASSIGNMENT
                </button>
              </div>
            ) : (
              <button onClick={() => setSelectedOrder(order.orderid)} style={{
                color: '#EDE8DE', padding: '8px 16px', border: '1px solid #2A2620',
                borderRadius: '2px', background: 'none', cursor: 'pointer', fontSize: '13px'
              }}>
                Assign Staff
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}