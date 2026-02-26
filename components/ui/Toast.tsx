'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  addToast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const iconMap: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: XCircle,
  info: AlertCircle,
}

const colorMap: Record<ToastType, string> = {
  success: 'text-success',
  error: 'text-error',
  info: 'text-accent',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full"
      >
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type]
          return (
            <div
              key={toast.id}
              role="alert"
              className="card flex items-start gap-3 p-4 shadow-md animate-in slide-in-from-right-4"
            >
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${colorMap[toast.type]}`} />
              <p className="text-sm text-text-primary flex-1">{toast.message}</p>
              <button
                onClick={() => remove(toast.id)}
                className="text-text-secondary hover:text-text-primary"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
