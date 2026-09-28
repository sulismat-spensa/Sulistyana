import React, { useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Bell, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast, dismissToast } = useLMS();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, dismissToast]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'deadline':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'grade':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'quiz':
        return <Bell className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mt-0.5 shrink-0">{getIcon()}</div>
        <div className="flex-1 pr-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            {toast.title}
          </h4>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {toast.message}
          </p>
        </div>
        <button
          onClick={dismissToast}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
