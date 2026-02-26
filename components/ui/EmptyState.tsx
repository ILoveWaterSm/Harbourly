import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-accent" aria-hidden="true" />
      </div>
      <h3 className="font-sora font-semibold text-text-primary text-lg mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm leading-relaxed mb-6">{description}</p>
      {action && (
        <>
          {action.href ? (
            <a href={action.href} className="btn-primary">
              {action.label}
            </a>
          ) : (
            <button onClick={action.onClick} className="btn-primary">
              {action.label}
            </button>
          )}
        </>
      )}
    </div>
  )
}
