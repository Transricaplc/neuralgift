import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

/**
 * Public lead submission endpoint for the /business/landing form.
 * Inserts via the service role (so we can return the new id reliably) and
 * fires a confirmation email when the lead included an address.
 */

const Schema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(160),
  teamSize: z.string().trim().min(1).max(40),
  useCase: z.string().trim().max(2000).optional().nullable(),
  email: z.string().trim().email().max(255).optional().nullable(),
})

export const Route = createFileRoute('/api/public/submit-lead')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !serviceKey) {
          return Response.json({ error: 'server_misconfigured' }, { status: 500 })
        }

        let body: unknown
        try { body = await request.json() } catch {
          return Response.json({ error: 'invalid_json' }, { status: 400 })
        }
        const parsed = Schema.safeParse(body)
        if (!parsed.success) {
          return Response.json({ error: 'invalid_input' }, { status: 400 })
        }
        const { name, company, teamSize, useCase, email } = parsed.data

        const admin = createClient(supabaseUrl, serviceKey)
        const { data: lead, error } = await admin
          .from('leads')
          .insert({
            name,
            company,
            team_size: teamSize,
            use_case: useCase ?? null,
            email: email ?? null,
          })
          .select('id')
          .single()
        if (error || !lead) {
          console.error('lead insert failed', error)
          return Response.json({ error: 'insert_failed' }, { status: 500 })
        }

        // Fire confirmation email asynchronously when an address was provided
        if (email) {
          const origin = new URL(request.url).origin
          fetch(`${origin}/api/public/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'lead', leadId: lead.id }),
          }).catch((e) => console.error('lead email trigger failed', e))
        }

        return Response.json({ ok: true, id: lead.id })
      },
    },
  },
})
