import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

/**
 * Public email trigger for the buy + redeem flows (unauthenticated visitors).
 * Validates the redemption code against the orders table before sending,
 * so this endpoint cannot be used to spam arbitrary email addresses.
 */

const Schema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('purchase'),
    code: z.string().uuid(),
  }),
  z.object({
    type: z.literal('redemption'),
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
  }),
  z.object({
    type: z.literal('lead'),
    leadId: z.string().uuid(),
  }),
])

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
        const input = parsed.data

        const admin = createClient(supabaseUrl, serviceKey)

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

        if (input.type === 'lead') {
          const { data: lead, error: leadErr } = await admin
            .from('leads')
            .select('id, name, company, team_size, email')
            .eq('id', input.leadId)
            .maybeSingle()
          if (leadErr || !lead) {
            return Response.json({ error: 'lead_not_found' }, { status: 404 })
          }
          if (!lead.email) {
            return Response.json({ ok: true, results: { skipped: true } })
          }
          results.lead = await enqueue(
            'lead-confirmation',
            lead.email,
            { name: lead.name, company: lead.company, teamSize: lead.team_size },
            `lead-${lead.id}`,
          )
          return Response.json({ ok: true, results })
        }

        // Order-based flows: look up by redemption_code
        const { data: order, error: orderErr } = await admin
          .from('orders')
          .select('id, amount, quantity, buyer_email, recipient_email, message')
          .eq('redemption_code', input.code)
          .maybeSingle()
        if (orderErr || !order) {
          return Response.json({ error: 'order_not_found' }, { status: 404 })
        }

        if (input.type === 'purchase') {
          const data = {
            amount: order.amount,
            redemptionCode: input.code,
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
          // Send a separate, recipient-styled gift email when applicable
          if (order.recipient_email && order.recipient_email !== order.buyer_email) {
            results.recipient = await enqueue(
              'gift-recipient',
              order.recipient_email,
              {
                amount: order.amount,
                quantity: order.quantity,
                redemptionCode: input.code,
                buyerEmail: order.buyer_email,
                message: order.message,
              },
              `gift-recipient-${order.id}`,
            )
          }
        } else {
          const services = input.services
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