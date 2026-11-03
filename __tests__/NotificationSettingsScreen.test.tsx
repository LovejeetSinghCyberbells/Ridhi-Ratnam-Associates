import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NotificationSettingsScreen,
  NotificationPreferences,
} from '../src/screens/NotificationSettingsScreen';
import { ProfileScreen } from '../src/screens/ProfileScreen';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderWithProvider = async (component: React.ReactElement) => {
  let tree: any;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={initialMetrics}>
        {component}
      </SafeAreaProvider>
    );
  });
  return tree;
};

describe('Ridhi Ratnam Associates - Notification Settings Internal Screen', () => {
  test('Renders standard black header, subtitle badge, and main sections', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <NotificationSettingsScreen userRole="client" onBack={onBack} />
    );

    const root = tree.root;

    // Header & Badges
    expect(root.findAllByProps({ children: 'Notification Settings' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'COMMUNICATION PREFERENCES' }).length).toBeGreaterThan(0);

    // Section Titles
    expect(root.findAllByProps({ children: 'LOAN & UNDERWRITING ALERTS' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'DISPATCH CHANNELS' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'REPAYMENT & COMPLIANCE REMINDERS' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'DISPATCH CADENCE & QUIET HOURS' }).length).toBeGreaterThan(0);

    // Setting Row Labels
    expect(root.findAllByProps({ children: 'Application Status Milestones' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Disbursement & Sanction Notices' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Document Verification Alerts' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Mobile Push Notifications' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'SMS Transactional Alerts' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Email Underwriting Digest' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'EMI Due Date Reminders' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Mandate Balance Warnings' }).length).toBeGreaterThan(0);
  });

  test('Toggles individual alert switches correctly', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <NotificationSettingsScreen userRole="client" onBack={onBack} />
    );

    const root = tree.root;

    // Push Notifications Switch
    const pushSwitch = root.findByProps({ testID: 'switch-push-channel' });
    expect(pushSwitch.props.value).toBe(true);

    await ReactTestRenderer.act(async () => {
      pushSwitch.props.onValueChange(false);
    });
    expect(pushSwitch.props.value).toBe(false);

    // WhatsApp Switch
    const waSwitch = root.findByProps({ testID: 'switch-whatsapp-channel' });
    expect(waSwitch.props.value).toBe(false);

    await ReactTestRenderer.act(async () => {
      waSwitch.props.onValueChange(true);
    });
    expect(waSwitch.props.value).toBe(true);
  });

  test('Switches alert frequency cadence between Instant, Daily Digest, and Priority', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <NotificationSettingsScreen userRole="client" onBack={onBack} />
    );

    const root = tree.root;
    const dailyBtn = root.findByProps({ testID: 'frequency-btn-daily' });
    expect(dailyBtn).toBeDefined();

    await ReactTestRenderer.act(async () => {
      dailyBtn.props.onPress();
    });

    const priorityBtn = root.findByProps({ testID: 'frequency-btn-priority' });
    await ReactTestRenderer.act(async () => {
      priorityBtn.props.onPress();
    });

    expect(priorityBtn).toBeDefined();
  });

  test('Saves preferences and invokes onSavePreferences callback', async () => {
    jest.useFakeTimers();
    const onBack = jest.fn();
    const onSave = jest.fn();
    const tree = await renderWithProvider(
      <NotificationSettingsScreen
        userRole="client"
        onBack={onBack}
        onSavePreferences={onSave}
      />
    );

    const root = tree.root;
    const saveBtn = root.findByProps({ testID: 'btn-save-notification-settings' });
    expect(saveBtn).toBeDefined();

    await ReactTestRenderer.act(async () => {
      saveBtn.props.onPress();
    });

    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        applicationStatusUpdates: true,
        disbursementNotices: true,
        pushNotifications: true,
        smsAlerts: true,
      })
    );

    jest.useRealTimers();
  });

  test('Back button calls onBack callback', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <NotificationSettingsScreen userRole="client" onBack={onBack} />
    );

    const root = tree.root;
    const backBtn = root.findByProps({ accessibilityLabel: 'Go back' });

    await ReactTestRenderer.act(async () => {
      backBtn.props.onPress();
    });

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test('ProfileScreen opens notification settings when Notifications row is tapped', async () => {
    const onBack = jest.fn();
    const onSignOut = jest.fn();
    const onNavigateToNotificationSettings = jest.fn();

    const tree = await renderWithProvider(
      <ProfileScreen
        viewerRole="client"
        onBack={onBack}
        onSignOut={onSignOut}
        onNavigateToNotificationSettings={onNavigateToNotificationSettings}
      />
    );

    const root = tree.root;
    const notifRow = root.findByProps({ testID: 'btn-open-notification-settings' });
    expect(notifRow).toBeDefined();

    await ReactTestRenderer.act(async () => {
      notifRow.props.onPress();
    });

    expect(onNavigateToNotificationSettings).toHaveBeenCalledTimes(1);
  });
});

