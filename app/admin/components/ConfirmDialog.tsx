'use client'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  type = 'warning'
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const colors = {
    danger: {
      bg: 'bg-red-100',
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      bg: 'bg-yellow-100',
      icon: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    },
    info: {
      bg: 'bg-blue-100',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700'
    }
  }

  const colorScheme = colors[type]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-scaleIn">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 ${colorScheme.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
              <svg className={`w-6 h-6 ${colorScheme.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-5 py-2.5 text-sm font-semibold text-white ${colorScheme.button} rounded-lg transition-colors shadow-md`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}
