// @ts-nocheck
'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

const GUEST_ID = '62a83336-cb54-4e92-984e-71fa7c07b0d5'

export default function Complaint() {
  const { id } = useParams()
  const router = useRouter()
  const [reason, setReason] = useState('')
  const [ratingScore, setRatingScore] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit() {
    setSubmitting(true)

    if (reason.trim()) {
      await supabase.from('complaint').insert({
        complaintreason: reason,
        complaintstatus: 'OPEN',
        complaintcustomerid: GUEST_ID,
        complaintorderid: id
      })
    }

    if (ratingScore > 0) {
      await supabase.from('rating').insert({
        ratingscore: ratingScore,
        customercomment: comment,
        ratingcustomerid: GUEST_ID,
        ratingorderid: id
      })
    }

    setSubmitting(false)
    setDone(true)
  }

  if (done) {
    return (
      <main style={{ backgroundColor: '#15130F', minHeight: '100vh', color: '#EDE8DE', padding: '64px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 'normal', fontSize: '30px', marginBottom: '16px' }}>
            Thank you
          </h1>
          <p style={{ color: '#8A8378', marginBottom: '28px', fontSize: '14px' }}>
            Your feedback has been recorded against order #{id.slice(0, 8)}.
          </p>
          <a href={`/order/${id}`} style={{
            color: '#B8935F', textDecoration: 'none', fontSize: '13px'
          }}>
            ← Back to order
          </a>
        </div>
      </main>
    )
  }

  return (
    <main style={{ backgroundColor: '#15130F', minHeight: '100vh', color: '#EDE8DE', padding: '64px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 'normal', fontSize: '32px', marginBottom: '8px' }}>
          Complaint & Rating
        </h1>
        <p style={{ color: '#8A8378', marginBottom: '36px', fontSize: '14px' }}>
          Order #{id.slice(0, 8)}
        </p>

        <p style={{ marginBottom: '10px', fontSize: '14px', color: '#8A8378' }}>What went wrong?</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Serious delay in preparation"
          style={{
            width: '100%', padding: '14px', backgroundColor: '#15130F',
            color: '#EDE8DE', border: '1px solid #2A2620', borderRadius: '2px',
            minHeight: '80px', marginBottom: '28px', fontSize: '14px'
          }}
        />

        <p style={{ marginBottom: '10px', fontSize: '14px', color: '#8A8378' }}>Rate your experience</p>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setRatingScore(num)}
              style={{
                width: '42px', height: '42px', borderRadius: '2px',
                border: ratingScore === num ? '1px solid #B8935F' : '1px solid #2A2620',
                backgroundColor: ratingScore === num ? '#B8935F' : 'none',
                color: ratingScore === num ? '#15130F' : '#EDE8DE',
                cursor: 'pointer', fontSize: '14px'
              }}
            >
              {num}
            </button>
          ))}
        </div>

        <p style={{ marginBottom: '10px', fontSize: '14px', color: '#8A8378' }}>Comment (optional)</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us more..."
          style={{
            width: '100%', padding: '14px', backgroundColor: '#15130F',
            color: '#EDE8DE', border: '1px solid #2A2620', borderRadius: '2px',
            minHeight: '60px', marginBottom: '36px', fontSize: '14px'
          }}
        />

        <button onClick={handleSubmit} disabled={submitting} style={{
          backgroundColor: '#B8935F', color: '#15130F', padding: '14px 30px',
          border: 'none', borderRadius: '2px', fontWeight: 'bold',
          fontSize: '13px', letterSpacing: '0.03em', cursor: 'pointer'
        }}>
          {submitting ? 'SUBMITTING...' : 'SUBMIT'}
        </button>
      </div>
    </main>
  )
}