import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  ThemeDialogProvider,
  showThemeAlert,
  themeAlert,
  useThemeDialog,
} from '../src/components/ThemeDialog';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const TestComponent = () => {
  const { showDialog } = useThemeDialog();

  return (
    <View>
      <TouchableOpacity
        testID="trigger-success-alert"
        onPress={() =>
          themeAlert(
            'Sanction Approved',
            'Your loan application RRA-2026-00124 has been sanctioned.'
          )
        }
      >
        <Text>Trigger Success</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="trigger-destructive-alert"
        onPress={() =>
          themeAlert(
            'Sign Out Confirmation',
            'Are you sure you want to sign out from your Ridhi Ratnam Associates session?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', style: 'destructive', onPress: jest.fn() },
            ]
          )
        }
      >
        <Text>Trigger Destructive</Text>
      </TouchableOpacity>
    </View>
  );
};

const renderDialogApp = async () => {
  let tree: any;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={initialMetrics}>
        <ThemeDialogProvider>
          <TestComponent />
        </ThemeDialogProvider>
      </SafeAreaProvider>
    );
  });
  return tree;
};

describe('Ridhi Ratnam Associates - Themed Dialog System', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Renders themed dialog with verified badge and success styling on positive events', async () => {
    const tree = await renderDialogApp();
    const root = tree.root;

    const triggerBtn = root.findByProps({ testID: 'trigger-success-alert' });
    await ReactTestRenderer.act(async () => {
      triggerBtn.props.onPress();
    });

    // Check custom themed dialog elements
    expect(root.findAllByProps({ children: 'Sanction Approved' }).length).toBeGreaterThan(0);
    expect(
      root.findAllByProps({
        children: 'Your loan application RRA-2026-00124 has been sanctioned.',
      }).length
    ).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'VERIFIED RECORD' }).length).toBeGreaterThan(0);
  });

  test('Renders themed dialog with security confirmation badge and destructive action button on sign out', async () => {
    const tree = await renderDialogApp();
    const root = tree.root;

    const triggerBtn = root.findByProps({ testID: 'trigger-destructive-alert' });
    await ReactTestRenderer.act(async () => {
      triggerBtn.props.onPress();
    });

    // Check custom destructive themed dialog
    expect(root.findAllByProps({ children: 'Sign Out Confirmation' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'SECURITY CONFIRMATION' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Cancel' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Sign Out' }).length).toBeGreaterThan(0);

    // Dismiss by tapping Cancel
    const cancelBtn = root.findByProps({ testID: 'dialog-btn-0' });
    await ReactTestRenderer.act(async () => {
      cancelBtn.props.onPress();
    });
  });

  test('Direct showThemeAlert call renders custom dialog', async () => {
    const tree = await renderDialogApp();
    const root = tree.root;

    await ReactTestRenderer.act(async () => {
      showThemeAlert({
        title: 'Priority Helpdesk',
        message: 'Connecting you to 1800 123 4567.',
        badge: 'PRIORITY HELPLINE',
        type: 'phone',
        buttons: [{ text: 'Dial Hotline' }],
      });
    });

    expect(root.findAllByProps({ children: 'Priority Helpdesk' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'PRIORITY HELPLINE' }).length).toBeGreaterThan(0);
  });
});

