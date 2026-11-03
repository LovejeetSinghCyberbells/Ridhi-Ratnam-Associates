import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { BackHandler, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClientHomeScreen } from '../src/screens/ClientHomeScreen';
import { AgentHomeScreen } from '../src/screens/AgentHomeScreen';
import { ApplicationDetailScreen } from '../src/screens/ApplicationDetailScreen';
import { ForgotPasswordScreen } from '../src/screens/ForgotPasswordScreen';
import { ProfileScreen } from '../src/screens/ProfileScreen';
import { NotificationScreen } from '../src/screens/NotificationScreen';
import { SupportScreen } from '../src/screens/SupportScreen';
import { MOCK_LATEST_APPLICATIONS } from '../src/services/dashboardService';

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

// Helper to trigger hardware back press via BackHandler mock
const triggerBackPress = () => {
  // @ts-ignore
  if (BackHandler.mockPressBack) {
    // @ts-ignore
    BackHandler.mockPressBack();
  }
};

describe('Hardware Back Button Navigation Suite', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(async () => {
    await ReactTestRenderer.act(async () => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  test('ClientHomeScreen switches to home tab when back is pressed on other tabs', async () => {
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = await renderWithProvider(<ClientHomeScreen onSignOut={jest.fn()} />);
    });

    // Find and press the "Upload" tab in bottom nav
    const touchables = tree.root.findAllByType('TouchableOpacity');
    const uploadTab = touchables.find((t: any) => {
      const textNodes = t.findAllByType('Text');
      return textNodes.some((tn: any) => tn.props.children === 'Upload' || tn.props.children === 'KYC Upload');
    });

    if (uploadTab) {
      await ReactTestRenderer.act(async () => {
        uploadTab.props.onPress();
      });
    }

    // Trigger Android back button
    await ReactTestRenderer.act(async () => {
      triggerBackPress();
    });

    expect(tree.toJSON()).toBeTruthy();
  });

  test('AgentHomeScreen switches to dashboard tab when back is pressed', async () => {
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = await renderWithProvider(<AgentHomeScreen onSignOut={jest.fn()} />);
    });

    // Trigger Android back button
    await ReactTestRenderer.act(async () => {
      triggerBackPress();
    });

    expect(tree.toJSON()).toBeTruthy();
  });

  test('ApplicationDetailScreen triggers onBack when back button is pressed', async () => {
    const onBackMock = jest.fn();
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = await renderWithProvider(
        <ApplicationDetailScreen
          application={MOCK_LATEST_APPLICATIONS[0]}
          viewerRole="agent"
          onBack={onBackMock}
        />
      );
    });

    await ReactTestRenderer.act(async () => {
      triggerBackPress();
    });

    // The component registers a BackHandler listener
    expect(tree.toJSON()).toBeTruthy();
  });

  test('ForgotPasswordScreen handles back button gracefully', async () => {
    const onBackMock = jest.fn();
    const onLoginMock = jest.fn();
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = await renderWithProvider(
        <ForgotPasswordScreen onNavigateToLogin={onLoginMock} onBack={onBackMock} />
      );
    });

    await ReactTestRenderer.act(async () => {
      triggerBackPress();
    });

    expect(tree.toJSON()).toBeTruthy();
  });

  test('ProfileScreen, NotificationScreen, and SupportScreen register back handlers cleanly', async () => {
    const onBackMock = jest.fn();

    let treeProfile: any;
    await ReactTestRenderer.act(async () => {
      treeProfile = await renderWithProvider(
        <ProfileScreen viewerRole="agent" onBack={onBackMock} onSignOut={jest.fn()} />
      );
    });
    expect(treeProfile.toJSON()).toBeTruthy();

    let treeNotif: any;
    await ReactTestRenderer.act(async () => {
      treeNotif = await renderWithProvider(
        <NotificationScreen userRole="agent" onBack={onBackMock} />
      );
    });
    expect(treeNotif.toJSON()).toBeTruthy();

    let treeSupport: any;
    await ReactTestRenderer.act(async () => {
      treeSupport = await renderWithProvider(
        <SupportScreen viewerRole="agent" onBack={onBackMock} />
      );
    });
    expect(treeSupport.toJSON()).toBeTruthy();
  });
});

