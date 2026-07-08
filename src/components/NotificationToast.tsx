import { useEffect } from 'react';
import { useNotificationStore } from '../stores/notification.store';

export function NotificationToast() {
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  useEffect(() => {
    notifications.forEach((n) => {
      const timer = setTimeout(() => removeNotification(n.id), 4000);
      return () => clearTimeout(timer);
    });
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        zIndex: 1000,
      }}
    >
      {notifications.map((n) => (
        <div
          key={n.id}
          role="alert"
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '4px',
            minWidth: '250px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#fff',
            backgroundColor:
              n.type === 'success' ? '#2e7d32' : n.type === 'error' ? '#c62828' : '#1565c0',
          }}
        >
          <span>{n.message}</span>
          <button
            onClick={() => removeNotification(n.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0 0 0 0.5rem',
            }}
            aria-label="Dismiss"
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}
