import { Bell, BellOff, BellRing } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

type Props = {
  isDark: boolean;
};

export default function NotificationBell({ isDark }: Props) {
  const { state, isSubscribed, subscribe, unsubscribe } = useNotifications();

  if (state === 'unsupported') return null;

  const handleToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  const label = isSubscribed
    ? 'Nonaktifkan notifikasi'
    : state === 'denied'
      ? 'Notifikasi diblokir — ubah izin di browser'
      : state === 'loading'
        ? 'Memuat...'
        : 'Aktifkan notifikasi desktop & HP';

  const Icon =
    state === 'loading'
      ? Bell
      : state === 'denied'
        ? BellOff
        : isSubscribed
          ? BellRing
          : Bell;

  return (
    <button
      onClick={handleToggle}
      disabled={state === 'loading' || state === 'denied'}
      title={label}
      aria-label={label}
      className={`relative p-2 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        isSubscribed
          ? isDark
            ? 'text-emerald-400 hover:bg-emerald-500/10'
            : 'text-emerald-600 hover:bg-emerald-50'
          : isDark
            ? 'text-slate-300 hover:bg-slate-800'
            : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon className={`w-5 h-5 ${state === 'loading' ? 'animate-pulse' : ''}`} />
      {isSubscribed && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
      )}
    </button>
  );
}
