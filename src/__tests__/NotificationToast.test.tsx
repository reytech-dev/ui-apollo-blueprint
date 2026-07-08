import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { NotificationToast } from '../components/NotificationToast';
import { useNotificationStore } from '../stores/notification.store';

describe('notificationStore', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: [] });
  });

  it('adds a notification', () => {
    useNotificationStore.getState().addNotification('success', 'Test message');

    const state = useNotificationStore.getState();
    expect(state.notifications).toHaveLength(1);
    expect(state.notifications[0]).toMatchObject({ type: 'success', message: 'Test message' });
    expect(state.notifications[0].id).toBeDefined();
  });

  it('removes a notification by id', () => {
    useNotificationStore.getState().addNotification('error', 'Error one');
    useNotificationStore.getState().addNotification('info', 'Info two');

    const { notifications } = useNotificationStore.getState();
    expect(notifications).toHaveLength(2);

    useNotificationStore.getState().removeNotification(notifications[0].id);
    const updated = useNotificationStore.getState();
    expect(updated.notifications).toHaveLength(1);
    expect(updated.notifications[0].message).toBe('Info two');
  });

  it('clears all notifications', () => {
    useNotificationStore.getState().addNotification('success', 'One');
    useNotificationStore.getState().addNotification('error', 'Two');

    useNotificationStore.getState().clearAll();
    expect(useNotificationStore.getState().notifications).toHaveLength(0);
  });
});

describe('NotificationToast', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: [] });
  });

  it('renders nothing when there are no notifications', () => {
    const { container } = render(<NotificationToast />);
    expect(container.innerHTML).toBe('');
  });

  it('renders notifications from the store', () => {
    useNotificationStore.getState().addNotification('success', 'Book created successfully');

    render(<NotificationToast />);

    expect(screen.getByText('Book created successfully')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders multiple notifications', () => {
    useNotificationStore.getState().addNotification('success', 'First');
    useNotificationStore.getState().addNotification('error', 'Second');

    render(<NotificationToast />);

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getAllByRole('alert')).toHaveLength(2);
  });

  it('dismisses notification on click', async () => {
    const user = userEvent.setup();
    useNotificationStore.getState().addNotification('success', 'Dismiss me');

    render(<NotificationToast />);

    await user.click(screen.getByLabelText('Dismiss'));

    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
  });
});
