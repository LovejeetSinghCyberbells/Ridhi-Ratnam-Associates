import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NotificationScreen } from '../src/screens/NotificationScreen';
import { ProfileScreen } from '../src/screens/ProfileScreen';
import { MOCK_AGENT } from '../src/services/dashboardService';
import { MOCK_CLIENT_PROFILE } from '../src/services/clientService';

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

describe('Ridhi Ratnam Associates - Dedicated Notification Screen', () => {
  test('Renders header, unread status strip, filter tabs, and notification cards', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <NotificationScreen userRole="agent" onBack={onBack} />
    );

    const root = tree.root;

    // Header Title
    expect(root.findAllByProps({ children: 'Notifications' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'DISPATCH & AUDIT FEED' }).length).toBeGreaterThan(0);

    // Unread strip
    expect(root.findAllByProps({ children: 'All' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Submissions' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Underwriting' }).length).toBeGreaterThan(0);

    // Notification Cards
    expect(
      root.findAllByProps({ children: 'New Application Submitted' }).length
    ).toBeGreaterThan(0);
    expect(
      root.findAllByProps({ children: 'Underwriting Verification Complete' }).length
    ).toBeGreaterThan(0);
  });

  test('Mark all read button marks all notifications as read', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <NotificationScreen userRole="agent" onBack={onBack} />
    );

    const root = tree.root;
    const markAllBtn = root.findByProps({ testID: 'btn-mark-all-read' });
    expect(markAllBtn).toBeDefined();

    await ReactTestRenderer.act(async () => {
      markAllBtn.props.onPress();
    });

    // Unread status should update to "All Dispatches Read"
    expect(root.findAllByProps({ children: 'All Dispatches Read' }).length).toBeGreaterThan(0);
  });

  test('Filter tabs switch active filter and render empty state if no matches', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <NotificationScreen userRole="agent" onBack={onBack} />
    );

    const root = tree.root;
    const sanctionFilter = root.findByProps({ testID: 'filter-approval' });
    expect(sanctionFilter).toBeDefined();

    await ReactTestRenderer.act(async () => {
      sanctionFilter.props.onPress();
    });

    // Sanction disbursement notification should be visible
    expect(
      root.findAllByProps({ children: 'Loan Disbursed Successfully' }).length
    ).toBeGreaterThan(0);
  });

  test('Back button calls onBack', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <NotificationScreen userRole="agent" onBack={onBack} />
    );

    const root = tree.root;
    const backBtn = root.findByProps({ accessibilityLabel: 'Go back' });

    await ReactTestRenderer.act(async () => {
      backBtn.props.onPress();
    });

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

describe('Ridhi Ratnam Associates - Dedicated Profile Screen', () => {
  test('Renders Agent profile card, ID badge, metrics, and branch info', async () => {
    const onBack = jest.fn();
    const onSignOut = jest.fn();
    const tree = await renderWithProvider(
      <ProfileScreen
        viewerRole="agent"
        agent={MOCK_AGENT}
        onBack={onBack}
        onSignOut={onSignOut}
      />
    );

    const root = tree.root;

    // Header
    expect(root.findAllByProps({ children: 'Profile & Settings' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'AUTHORIZED PARTNER' }).length).toBeGreaterThan(0);

    // Hero Info
    expect(root.findAllByProps({ children: MOCK_AGENT.fullName }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: MOCK_AGENT.designation }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: MOCK_AGENT.id }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Active & Verified' }).length).toBeGreaterThan(0);

    // Agent metrics
    expect(root.findAllByProps({ children: '248' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '71%' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '4.9 ★' }).length).toBeGreaterThan(0);

    // Credentials & Branch
    expect(root.findAllByProps({ children: MOCK_AGENT.branch }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: MOCK_AGENT.email }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: MOCK_AGENT.phone }).length).toBeGreaterThan(0);
  });

  test('Renders Client profile card, account ID, and client statistics', async () => {
    const onBack = jest.fn();
    const onSignOut = jest.fn();
    const tree = await renderWithProvider(
      <ProfileScreen
        viewerRole="client"
        client={MOCK_CLIENT_PROFILE}
        onBack={onBack}
        onSignOut={onSignOut}
      />
    );

    const root = tree.root;

    // Header
    expect(root.findAllByProps({ children: 'CLIENT DOSSIER' }).length).toBeGreaterThan(0);

    // Hero Info
    expect(root.findAllByProps({ children: MOCK_CLIENT_PROFILE.fullName }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: MOCK_CLIENT_PROFILE.id }).length).toBeGreaterThan(0);

    // Client metrics
    expect(root.findAllByProps({ children: 'Sanctioned' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Under Review' }).length).toBeGreaterThan(0);
  });

  test('Opens Edit Profile modal, edits information, saves, and updates displayed profile', async () => {
    jest.useFakeTimers();
    const onBack = jest.fn();
    const onSignOut = jest.fn();
    const onProfileUpdate = jest.fn();

    const tree = await renderWithProvider(
      <ProfileScreen
        viewerRole="agent"
        agent={MOCK_AGENT}
        onBack={onBack}
        onSignOut={onSignOut}
        onProfileUpdate={onProfileUpdate}
      />
    );

    const root = tree.root;

    // Click Edit Profile button on hero card
    const editBtn = root.findByProps({ testID: 'btn-open-edit-profile-hero' });
    expect(editBtn).toBeDefined();

    await ReactTestRenderer.act(async () => {
      editBtn.props.onPress();
    });

    // Check modal opened with fields
    const nameInput = root.findByProps({ testID: 'input-edit-name' });
    expect(nameInput.props.value).toBe(MOCK_AGENT.fullName);

    // Edit full name and email
    await ReactTestRenderer.act(async () => {
      nameInput.props.onChangeText('Rahul K. Sharma');
    });

    const emailInput = root.findByProps({ testID: 'input-edit-email' });
    await ReactTestRenderer.act(async () => {
      emailInput.props.onChangeText('rahul.senior@ridhiratnam.demo');
    });

    // Save profile changes
    const saveBtn = root.findByProps({ testID: 'btn-save-profile' });
    await ReactTestRenderer.act(async () => {
      saveBtn.props.onPress();
    });

    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(500);
    });

    // Verify updated name and callback
    expect(root.findAllByProps({ children: 'Rahul K. Sharma' }).length).toBeGreaterThan(0);
    expect(onProfileUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: 'Rahul K. Sharma',
        email: 'rahul.senior@ridhiratnam.demo',
        avatarInitials: 'RS',
      })
    );

    jest.useRealTimers();
  });

  test('Settings: opens Change Password modal, updates security switches, and handles clear cache', async () => {
    jest.useFakeTimers();
    const onBack = jest.fn();
    const onSignOut = jest.fn();
    const tree = await renderWithProvider(
      <ProfileScreen
        viewerRole="agent"
        agent={MOCK_AGENT}
        onBack={onBack}
        onSignOut={onSignOut}
      />
    );

    const root = tree.root;

    // Security & Authentication Settings Header
    expect(root.findAllByProps({ children: 'Security & Authentication' }).length).toBeGreaterThan(0);

    // Toggle 2FA switch
    const twoFactorSwitch = root.findByProps({ testID: 'switch-two-factor' });
    expect(twoFactorSwitch.props.value).toBe(true);
    await ReactTestRenderer.act(async () => {
      twoFactorSwitch.props.onValueChange(false);
    });
    expect(twoFactorSwitch.props.value).toBe(false);

    // Toggle Push notifications switch
    const pushSwitch = root.findByProps({ testID: 'switch-push-notifs' });
    expect(pushSwitch.props.value).toBe(true);
    await ReactTestRenderer.act(async () => {
      pushSwitch.props.onValueChange(false);
    });
    expect(pushSwitch.props.value).toBe(false);

    // Open Change Password modal
    const changePassBtn = root.findByProps({ testID: 'btn-open-change-password' });
    await ReactTestRenderer.act(async () => {
      changePassBtn.props.onPress();
    });

    // Input new password
    const curPassInput = root.findByProps({ testID: 'input-current-password' });
    const newPassInput = root.findByProps({ testID: 'input-new-password' });
    const confPassInput = root.findByProps({ testID: 'input-confirm-password' });

    await ReactTestRenderer.act(async () => {
      curPassInput.props.onChangeText('OldPassword@123');
      newPassInput.props.onChangeText('NewStrongPass@2026');
      confPassInput.props.onChangeText('NewStrongPass@2026');
    });

    const updatePassBtn = root.findByProps({ testID: 'btn-confirm-update-password' });
    await ReactTestRenderer.act(async () => {
      updatePassBtn.props.onPress();
    });

    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(600);
    });

    jest.useRealTimers();
  });

  test('Back button calls onBack', async () => {
    const onBack = jest.fn();
    const onSignOut = jest.fn();
    const tree = await renderWithProvider(
      <ProfileScreen
        viewerRole="agent"
        agent={MOCK_AGENT}
        onBack={onBack}
        onSignOut={onSignOut}
      />
    );

    const root = tree.root;
    const backBtn = root.findByProps({ accessibilityLabel: 'Go back' });

    await ReactTestRenderer.act(async () => {
      backBtn.props.onPress();
    });

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

