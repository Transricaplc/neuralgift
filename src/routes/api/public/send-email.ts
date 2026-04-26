import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

/**
 * Public email trigger for the buy + redeem flows (unauthenticated visitors).
 * Validates the redemption code against the orders table before sending,
 * so this endpoint cannot be used to spam arbitrary email addresses.
 */

const Schema = z.object({
  type: z.enum(['purchase', 'redemption']),
  code: z.string().uuid(),
  services: z
    .array(
      z.object({
        name: z.string().min(1).max(64),
        cost: z.number().min(0).max(10000),
        category: z.string().max(32).optional(),
      })
    )
    .max(20)
    .optional(),
})

export const Route = createFileRoute('/api/public/send-email')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !serviceKey) {
          return Response.json({ error: 'server_misconfigured' }, { status: 500 })
        }

        let body: unknown
        try {
          body = await request.json()
        } catch {
          return Response.json({ error: 'invalid_json' }, { status: 400 })
        }

        const parsed = Schema.safeParse(body)
        if (!parsed.success) {
          return Response.json({ error: 'invalid_input' }, { status: 400 })
        }
        const { type, code, services } = parsed.data

        const admin = createClient(supabaseUrl, serviceKey)

        // Look up the order by redemption_code — gates which addresses we email
        const { data: order, error: orderErr } = await admin
          .from('orders')
          .select('id, amount, quantity, buyer_email, recipient_email, message')
          .eq('redemption_code', code)
          .maybeSingle()

        if (orderErr || !order) {
          return Response.json({ error: 'order_not_found' }, { status: 404 })
        }

        const origin = new URL(request.url).origin

        async function enqueue(
          templateName: string,
          recipientEmail: string,
          templateData: Record<string, unknown>,
          idempotencyKey: string,
        ) {
          const res = await fetch(`${origin}/lovable/email/transactional/send`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${serviceKey}`,
            },
            body: JSON.stringify({
              templateName,
              recipientEmail,
              idempotencyKey,
              templateData,
            }),
          })
          if (!res.ok) {
            console.error('send email failed', templateName, res.status, await res.text())
          }
          return res.ok
        }

        const results: Record<string, boolean> = {}

        if (type === 'purchase') {
          const data = {
            amount: order.amount,
            redemptionCode: code,
            recipientEmail: order.recipient_email,
            message: order.message,
            quantity: order.quantity,
          }
          // Always email the buyer
          results.buyer = await enqueue(
            'purchase-confirmation',
            order.buyer_email,
            data,
            `purchase-buyer-${order.id}`,
          )
          // Optionally email the gift recipient
          if (order.recipient_email && order.recipient_email !== order.buyer_email) {
            results.recipient = await enqueue(
              'purchase-confirmation',
              order.recipient_email,
              data,
              `purchase-recipient-${order.id}`,
            )
          }
        } else {
          const totalAllocated = (services ?? []).reduce((s, x) => s + x.cost, 0)
          const remaining = Math.max(0, order.amount - totalAllocated)
          const data = {
            services: services ?? [],
            totalAllocated,
            remaining,
          }
          const target = order.recipient_email || order.buyer_email
          results.redeemer = await enqueue(
            'redemption-confirmation',
            target,
            data,
            `redemption-${order.id}`,
          )
        }

        return Response.json({ ok: true, results })
      },
    },
  },
})