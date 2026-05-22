import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './confirm-dialog.css'

type ConfirmDialogProps = {
  open: boolean
  title: string
  message: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  variant?: 'danger' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel()
    }

    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [open, loading, onCancel])

  if (!open) return null

  return createPortal(
    <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
      <button
        type="button"
        className="confirm-dialog__backdrop"
        onClick={loading ? undefined : onCancel}
        aria-label="Close dialog"
        tabIndex={-1}
      />
      <div className="confirm-dialog__panel">
        <div className="confirm-dialog__header">
          <h3 id="confirm-dialog-title" className="confirm-dialog__title">
            {title}
          </h3>
        </div>
        <div className="confirm-dialog__body">
          <p className="confirm-dialog__message">{message}</p>
          <div className="confirm-dialog__actions">
            <button
              type="button"
              className="btn btn--white"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className={`btn btn--green ${
                variant === 'danger' ? 'confirm-dialog__btn--danger' : ''
              }`}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? 'Please wait...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
