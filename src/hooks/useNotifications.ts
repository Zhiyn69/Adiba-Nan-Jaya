import { useState, useEffect, useCallback } from 'react';

export type NotificationState = 'unsupported' | 'default' | 'granted' | 'denied' | 'loading';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}

const isSupported =
  typeof window !== 'undefined' &&
  'Notification' in window &&
  'serviceWorker' in navigator &&
  'PushManager' in window;

export function useNotifications() {
  const [state, setState] = useState<NotificationState>('loading');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!isSupported) {
      setState('unsupported');
      return;
    }
    const permission = Notification.permission as NotificationState;
    setState(permission);
    if (permission === 'granted') {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => setIsSubscribed(!!sub));
      });
    }
  }, []);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;
    try {
      setState('loading');
      await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      const reg = await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      setState(permission as NotificationState);
      if (permission !== 'granted') return false;

      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        const keyRes = await fetch('/api/push/vapid-public-key');
        if (!keyRes.ok) throw new Error('Gagal mengambil VAPID key');
        const { publicKey } = await keyRes.json();
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      const { endpoint, keys } = sub.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };

      const saveRes = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint, keys }),
      });
      if (!saveRes.ok) throw new Error('Gagal menyimpan langganan notifikasi');

      setIsSubscribed(true);
      return true;
    } catch (err) {
      console.error('Subscribe error:', err);
      setState(Notification.permission as NotificationState);
      return false;
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    if (!isSupported) return;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch('/api/push/unsubscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setIsSubscribed(false);
      setState('default');
    } catch (err) {
      console.error('Unsubscribe error:', err);
    }
  }, []);

  const sendOrderNotification = useCallback(
    async (notification: { title: string; body: string; tag?: string; url?: string }) => {
      if (!isSubscribed || !isSupported) return;
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (!sub) return;
        await fetch('/api/push/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint, notification }),
        });
      } catch (err) {
        console.error('Notify error:', err);
      }
    },
    [isSubscribed]
  );

  return { state, isSubscribed, subscribe, unsubscribe, sendOrderNotification };
}
