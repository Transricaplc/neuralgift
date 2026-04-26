import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE_NAME = 'NeuralGift'

interface ServicePick { name: string; cost: number; category?: string }
interface RedemptionProps {
  services?: ServicePick[]
  totalAllocated?: number
  remaining?: number
}

const RedemptionConfirmationEmail = ({
  services = [{ name: 'ChatGPT', cost: 20, category: 'Chat' }],
  totalAllocated = 20,
  remaining = 0,
}: RedemptionProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`Your ${SITE_NAME} tools are being provisioned`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You're set.</Heading>
        <Text style={text}>
          We're issuing single-use virtual cards for each tool you picked.
          Expect a follow-up email with card details within 24 hours.
        </Text>
        <Section style={listBox}>
          {services.map((s, i) => (
            <div key={i} style={row}>
              <Text style={rowName}>{s.name}</Text>
              <Text style={rowCost}>${s.cost}/mo</Text>
            </div>
          ))}
          <Hr style={hrInner} />
          <div style={row}>
            <Text style={rowTotal}>Allocated</Text>
            <Text style={rowTotal}>${totalAllocated}</Text>
          </div>
          {remaining > 0 ? (
            <div style={row}>
              <Text style={rowMeta}>Saved on card</Text>
              <Text style={rowMeta}>${remaining}</Text>
            </div>
          ) : null}
        </Section>
        <Text style={text}>
          You can return to {SITE_NAME} any time to allocate the remaining balance.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          Need help? Reply to this email and we'll jump in.
          <br />— The {SITE_NAME} team
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: RedemptionConfirmationEmail,
  subject: `Your ${SITE_NAME} tools are on the way`,
  displayName: 'Redemption confirmation',
  previewData: {
    services: [
      { name: 'ChatGPT', cost: 20, category: 'Chat' },
      { name: 'Midjourney', cost: 10, category: 'Image' },
    ],
    totalAllocated: 30,
    remaining: 20,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: '"DM Sans", Arial, sans-serif' }
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '26px', fontWeight: 700, color: '#0a0a0a', margin: '0 0 16px', fontFamily: '"Sora", Arial, sans-serif' }
const text = { fontSize: '15px', color: '#3f3f46', lineHeight: '1.6', margin: '0 0 16px' }
const listBox = { background: '#f9fafb', borderRadius: '14px', padding: '8px 20px', margin: '20px 0' }
const row = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }
const rowName = { fontSize: '14px', color: '#0a0a0a', fontWeight: 500, margin: '10px 0' }
const rowCost = { fontSize: '14px', color: '#fbbf24', fontFamily: 'ui-monospace, Menlo, monospace', margin: '10px 0' }
const rowTotal = { fontSize: '14px', color: '#0a0a0a', fontWeight: 600, margin: '10px 0' }
const rowMeta = { fontSize: '13px', color: '#71717a', margin: '8px 0' }
const hrInner = { borderColor: '#e5e7eb', margin: '4px 0' }
const hr = { borderColor: '#e5e7eb', margin: '32px 0 20px' }
const footer = { fontSize: '12px', color: '#9ca3af', lineHeight: '1.6', margin: 0, textAlign: 'center' as const }