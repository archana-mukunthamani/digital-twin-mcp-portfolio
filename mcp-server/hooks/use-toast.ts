import * as React from 'react'

// Stub implementation - not currently used in the application

type ToastProps = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement
  [key: string]: any
}

export function useToast() {
  return {
    toasts: [] as ToastProps[],
    toast: () => {},
    dismiss: () => {},
  }
}
