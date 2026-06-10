import { ShieldCheck, Lock, Camera, UserCheck, Smartphone, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface TrustSignal {
  icon: LucideIcon
  label: string
  body: string
}

export const trustSignals: TrustSignal[] = [
  {
    icon: ShieldCheck,
    label: 'DBS Checked Staff',
    body: 'Every cleaner is background-checked and vetted before their first shift on your site.',
  },
  {
    icon: Lock,
    label: 'Fully Insured',
    body: 'Public liability cover in place. You are protected from day one, no exceptions.',
  },
  {
    icon: Camera,
    label: 'Photo Proof on Every Visit',
    body: 'Timestamped, zone-by-zone photo evidence submitted after every single clean, not just on request.',
  },
  {
    icon: UserCheck,
    label: 'Dedicated Supervisor',
    body: 'One named supervisor reviews all evidence and resolves issues before they reach you.',
  },
  {
    icon: Smartphone,
    label: 'In-House CRM App',
    body: 'Live dashboard, complaint tracking, evidence feed, and weekly reports, all in one place built for your site.',
  },
  {
    icon: FileText,
    label: 'Transparent Monthly Billing',
    body: 'Invoices match visit logs exactly. See what was done, when, and by whom, every time.',
  },
]
