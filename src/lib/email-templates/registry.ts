import type { ComponentType } from 'react'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

import { template as purchaseConfirmation } from './purchase-confirmation'
import { template as redemptionConfirmation } from './redemption-confirmation'
import { template as leadConfirmation } from './lead-confirmation'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'purchase-confirmation': purchaseConfirmation,
  'redemption-confirmation': redemptionConfirmation,
  'lead-confirmation': leadConfirmation,
}
