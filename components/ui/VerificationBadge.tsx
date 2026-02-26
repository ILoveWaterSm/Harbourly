import { ShieldCheck, ShieldAlert, Shield, Clock } from 'lucide-react'

type VerificationStatus = 'VERIFIED' | 'PENDING' | 'UNVERIFIED' | 'REJECTED' | 'NEEDS_MORE_INFO'

interface VerificationBadgeProps {
  status: VerificationStatus
  size?: 'sm' | 'md'
}

const statusConfig: Record<
  VerificationStatus,
  { icon: React.ElementType; label: string; className: string }
> = {
  VERIFIED: {
    icon: ShieldCheck,
    label: 'Verified Coach',
    className: 'text-success bg-success/10',
  },
  PENDING: {
    icon: Clock,
    label: 'Verification Pending',
    className: 'text-yellow-600 bg-yellow-50',
  },
  UNVERIFIED: {
    icon: Shield,
    label: 'Unverified',
    className: 'text-text-secondary bg-border/40',
  },
  REJECTED: {
    icon: ShieldAlert,
    label: 'Verification Rejected',
    className: 'text-error bg-error/10',
  },
  NEEDS_MORE_INFO: {
    icon: ShieldAlert,
    label: 'More Info Needed',
    className: 'text-yellow-600 bg-yellow-50',
  },
}

export default function VerificationBadge({
  status,
  size = 'sm',
}: VerificationBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.UNVERIFIED
  const Icon = config.icon
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${config.className} ${textSize}`}
      title={config.label}
    >
      <Icon className={iconSize} aria-hidden="true" />
      {config.label}
    </span>
  )
}
