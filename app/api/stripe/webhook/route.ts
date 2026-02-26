import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import { logAuditEvent } from '@/lib/audit'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        await prisma.paymentRecord.updateMany({
          where: { stripePaymentIntentId: pi.id },
          data: { status: 'SUCCEEDED', paidAt: new Date() },
        })
        const record = await prisma.paymentRecord.findUnique({
          where: { stripePaymentIntentId: pi.id },
        })
        if (record) {
          await prisma.booking.update({
            where: { id: record.bookingId },
            data: { status: 'CONFIRMED' },
          })
          await logAuditEvent({
            action: 'PAYMENT_SUCCEEDED',
            entityType: 'PaymentRecord',
            entityId: record.id,
          })
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        await prisma.paymentRecord.updateMany({
          where: { stripePaymentIntentId: pi.id },
          data: { status: 'FAILED' },
        })
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        if (charge.payment_intent) {
          const record = await prisma.paymentRecord.findUnique({
            where: { stripePaymentIntentId: String(charge.payment_intent) },
          })
          if (record) {
            await prisma.paymentRecord.update({
              where: { id: record.id },
              data: {
                status: 'REFUNDED',
                refundedAt: new Date(),
                refundAmountCents: charge.amount_refunded,
              },
            })
            await prisma.booking.update({
              where: { id: record.bookingId },
              data: { status: 'REFUNDED' },
            })
            await logAuditEvent({
              action: 'PAYMENT_REFUNDED',
              entityType: 'PaymentRecord',
              entityId: record.id,
            })
          }
        }
        break
      }

      default:
        break
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
