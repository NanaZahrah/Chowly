   // @ts-nocheck
'use client'

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
      <main style={{ backgroundColor: '#1A1512', minHeight: '100vh', color: '#F2EDE4', padding: '80px 24px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '16px' }}>
            Thank you
          </h1>
          <p style={{ color: '#C9C0B2', marginBottom: '32px' }}>
            Your feedback has been recorded against order #{id.slice(0, 8)}.
          </p>
          <a href={`/order/${id}`} style={{
            color: '#E8590C', textDecoration: 'none'
          }}>
            ← Back to order
          </a>
        </div>
      </main>
    )
  }
    return (
    <main style={{ backgroundColor: '#1A1512', minHeight: '100vh', color: '#F2EDE4', padding: '80px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', marginBottom: '8px' }}>
          Complaint & Rating
        </h1>
        <p style={{ color: '#C9C0B2', marginBottom: '32px' }}>
          Order #{id.slice(0, 8)}
        </p>

        <p style={{ marginBottom: '8px' }}>What went wrong?</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Serious delay in preparation"
          style={{
            width: '100%', padding: '12px', backgroundColor: '#1A1512',
            color: '#F2EDE4', border: '1px solid #6B7156', borderRadius: '4px',
            minHeight: '80px', marginBottom: '24px'
          }}
        />
                <p style={{ marginBottom: '8px' }}>Rate your experience</p>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setRatingScore(num)}
              style={{
                width: '44px', height: '44px', borderRadius: '4px',
                border: ratingScore === num ? '1px solid #E8590C' : '1px solid #6B7156',
                backgroundColor: ratingScore === num ? '#E8590C' : 'none',
                color: ratingScore === num ? '#1A1512' : '#F2EDE4',
                cursor: 'pointer', fontSize: '16px'
              }}
            >
              {num}
            </button>
          ))}
        </div>

        <p style={{ marginBottom: '8px' }}>Comment (optional)</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us more..."
          style={{
            width: '100%', padding: '12px', backgroundColor: '#1A1512',
            color: '#F2EDE4', border: '1px solid #6B7156', borderRadius: '4px',
            minHeight: '60px', marginBottom: '32px'
          }}
        />
                <button onClick={handleSubmit} disabled={submitting} style={{
          backgroundColor: '#E8590C', color: '#1A1512', padding: '14px 28px',
          border: 'none', borderRadius: '4px', fontWeight: 'bold',
          fontSize: '16px', cursor: 'pointer'
        }}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </main>
  )
}
