import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
    message: string | null;
}

export function Toast({ message }: ToastProps) {
    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    className="fixed bottom-6 right-6 z-[120] bg-charcoal text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10"
                >
                    <span className="font-medium text-lg tracking-wide">{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
