interface PricePillProps {
  priceCents: number
  suffix?: string
  variant?: 'default' | 'accent'
}

export default function PricePill({
  priceCents,
  suffix = '/ session',
  variant = 'default',
}: PricePillProps) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(priceCents / 100)

  return (
    <span
      className={`inline-flex items-baseline gap-1 font-semibold ${
        variant === 'accent' ? 'text-accent' : 'text-text-primary'
      }`}
    >
      <span className="text-base">{formatted}</span>
      {suffix && <span className="text-xs font-normal text-text-secondary">{suffix}</span>}
    </span>
  )
}
