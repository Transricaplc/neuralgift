import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE_NAME = 'NeuralGift'

interface LeadProps {
  name?: string
  company?: string
  teamSize?: string
}

const LeadConfirmationEmail = ({
  name = 'there',
  company,
  teamSize,
}: LeadProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`We got your demo request${company ? ` for ${company}` : ''}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thanks, {name}.</Heading>
        <Text style={text}>
          We received your demo request{company ? <> for <strong>{company}</strong></> : null}.
          A real person from the {SITE_NAME} team will reply within one business day with
          available times and a short overview of the dashboard.
        </Text>
        {(company || teamSize) && (
          <Section style={metaBox}>
            {company ? <Text style={metaRow}><strong>Company:</strong> {company}</Text> : null}
            {teamSize ? <Text style={metaRow}><strong>Team size:</strong> {teamSize}</Text> : null}
          </Section>
        )}
        <Text style={text}>
          In the meantime, feel free to reply to this email with any questions —
          pricing, integrations, security, or how the redemption flow works for your team.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          — The {SITE_NAME} team
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: LeadConfirmationEmail,
  subject: (data: Record<string, any>) =>
    `We got your ${SITE_NAME} demo request${data?.company ? ` — ${data.company}` : ''}`,
  displayName: 'Lead confirmation',
  previewData: {
    name: 'Jane',
    company: 'Acme Inc.',
    teamSize: '11–50',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: '"DM Sans", Arial, sans-serif' }
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '26px', fontWeight: 700, color: '#0a0a0a', margin: '0 0 16px', fontFamily: '"Sora", Arial, sans-serif' }
const text = { fontSize: '15px', color: '#3f3f46', lineHeight: '1.6', margin: '0 0 16px' }
const metaBox = { background: '#f9fafb', borderLeft: '3px solid #fbbf24', padding: '14px 18px', borderRadius: '6px', margin: '20px 0' }
const metaRow = { fontSize: '13px', color: '#3f3f46', margin: '4px 0' }
const hr = { borderColor: '#e5e7eb', margin: '32px 0 20px' }
const footer = { fontSize: '12px', color: '#9ca3af', lineHeight: '1.6', margin: 0, textAlign: 'center' as const }
