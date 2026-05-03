import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Button, Hr,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE_NAME = 'NeuralGift'
const APP_URL = 'https://neuralgift.lovable.app'

interface GiftProps {
  amount?: number
  redemptionCode?: string
  buyerName?: string | null
  buyerEmail?: string | null
  message?: string | null
  quantity?: number
}

const GiftRecipientEmail = ({
  amount = 50,
  redemptionCode = '00000000-0000-0000-0000-000000000000',
  buyerName,
  buyerEmail,
  message,
  quantity = 1,
}: GiftProps) => {
  const short = redemptionCode.replace(/-/g, '').slice(0, 16).toUpperCase()
  const redeemUrl = `${APP_URL}/redeem?code=${encodeURIComponent(redemptionCode)}`
  const sender = buyerName || buyerEmail || 'A friend'
  const total = amount * (quantity || 1)
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{`${sender} sent you a $${total} ${SITE_NAME} card`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={eyebrow}>You've received a gift</Text>
          <Heading style={h1}>{sender} sent you a {SITE_NAME} card.</Heading>
          <Text style={text}>
            Redeem ${total} across leading AI tools — pick what you actually use.
            No expiry tricks, no lock-in.
          </Text>
          <Section style={cardBox}>
            <Text style={cardLabel}>Your code</Text>
            <Text style={cardCode}>{short}</Text>
            <Text style={cardMeta}>
              ${amount}{quantity > 1 ? ` × ${quantity}` : ''} • Full code: {redemptionCode}
            </Text>
          </Section>
          {message ? (
            <Section style={msgBox}>
              <Text style={msgLabel}>A note from {sender}</Text>
              <Text style={msgText}>"{message}"</Text>
            </Section>
          ) : null}
          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button style={button} href={redeemUrl}>Redeem your card</Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            New to {SITE_NAME}? It's a single gift card that works across the AI tools
            you actually want — just pick yours at redemption.
            <br />— The {SITE_NAME} team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: GiftRecipientEmail,
  subject: (data: Record<string, any>) => {
    const sender = data?.buyerName || data?.buyerEmail || 'A friend'
    const total = (data?.amount ?? 0) * (data?.quantity ?? 1)
    return `${sender} sent you a $${total} ${SITE_NAME} card`
  },
  displayName: 'Gift recipient',
  previewData: {
    amount: 50,
    quantity: 1,
    redemptionCode: '8c1d4f2a-9b3e-4a7c-b1f5-2d6e9a0c4f12',
    buyerName: 'Alex',
    buyerEmail: 'alex@example.com',
    message: 'Happy birthday — go build something wild.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: '"DM Sans", Arial, sans-serif' }
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const eyebrow = { fontSize: '11px', color: '#fbbf24', textTransform: 'uppercase' as const, letterSpacing: '0.2em', margin: '0 0 12px', fontWeight: 700 }
const h1 = { fontSize: '28px', fontWeight: 700, color: '#0a0a0a', margin: '0 0 16px', lineHeight: 1.2, fontFamily: '"Sora", Arial, sans-serif' }
const text = { fontSize: '15px', color: '#3f3f46', lineHeight: '1.6', margin: '0 0 16px' }
const cardBox = { background: 'linear-gradient(135deg, #1a1a2e, #0f0f1e)', borderRadius: '20px', padding: '28px', margin: '24px 0', textAlign: 'center' as const }
const cardLabel = { fontSize: '11px', color: '#a1a1aa', textTransform: 'uppercase' as const, letterSpacing: '0.15em', margin: '0 0 8px' }
const cardCode = { fontSize: '26px', color: '#fbbf24', fontFamily: 'ui-monospace, Menlo, monospace', letterSpacing: '0.1em', margin: '0 0 8px', fontWeight: 700 }
const cardMeta = { fontSize: '11px', color: '#71717a', margin: 0 }
const msgBox = { background: '#f9fafb', borderLeft: '3px solid #fbbf24', padding: '14px 18px', borderRadius: '6px', margin: '20px 0' }
const msgLabel = { fontSize: '11px', color: '#71717a', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: '0 0 6px' }
const msgText = { fontSize: '14px', color: '#3f3f46', fontStyle: 'italic' as const, margin: 0 }
const button = { backgroundColor: '#0a0a0a', color: '#ffffff', padding: '14px 32px', borderRadius: '999px', fontWeight: 600, fontSize: '15px', textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: '#e5e7eb', margin: '32px 0 20px' }
const footer = { fontSize: '12px', color: '#9ca3af', lineHeight: '1.6', margin: 0, textAlign: 'center' as const }