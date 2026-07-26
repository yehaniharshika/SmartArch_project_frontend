import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

/**
 * Reusable Yes/No confirmation modal — replaces window.confirm()
 * so destructive actions (like deleting a floor plan) match the
 * app's own visual language instead of the browser's native dialog.
 */
export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Yes, delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px]"
            onClick={onCancel}
          />

          {/* Dialog card */}
          <motion.div
            className="relative bg-white rounded-md shadow-xl border border-stone-200 w-full max-w-sm p-6"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-start gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={16} className="text-red-600" />
              </div>
              <div className="space-y-1 pt-0.5">
                <p
                  className="text-stone-900 font-medium"
                  style={{ fontFamily: "'Saira', sans-serif" }}
                >
                  {title}
                </p>
                <p
                  className="text-sm text-stone-500 leading-relaxed"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  {message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={onCancel}
                className="btn-secondary px-4 py-2 text-sm"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm rounded-sm bg-red-600 text-white
                           hover:bg-red-700 transition-colors duration-150 font-medium"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}