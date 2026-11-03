import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PrivacyPolicyScreen } from '../src/screens/PrivacyPolicyScreen';
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

describe('Ridhi Ratnam Associates - Privacy Policy Screen', () => {
  test('Renders header, trust banner, quick highlights, and legal compliance sections', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <PrivacyPolicyScreen userRole="client" onBack={onBack} />
    );
    const root = tree.root;

    expect(root.findAllByProps({ children: 'Privacy Policy' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'LEGAL & REGULATORY GOVERNANCE' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'RBI DIGITAL LENDING & DPDP ACT 2023 COMPLIANT' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Zero Sale' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '256-Bit AES' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Consent-only' }).length).toBeGreaterThan(0);
  });

  test('Invokes onBack callback when the top back arrow button is tapped', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <PrivacyPolicyScreen userRole="client" onBack={onBack} />
    );
    const root = tree.root;

    const backButton = root.findByProps({ accessibilityLabel: 'Go back' });
    await ReactTestRenderer.act(async () => {
      backButton.props.onPress();
    });

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test('Acknowledge button updates state and calls onAccept', async () => {
    const onAccept = jest.fn();
    const tree = await renderWithProvider(
      <PrivacyPolicyScreen userRole="client" onBack={jest.fn()} onAccept={onAccept} />
    );
    const root = tree.root;

    const acceptBtn = root.findByProps({ testID: 'btn-acknowledge-privacy-policy' });
    expect(acceptBtn.props.title).toBe('I Acknowledge & Accept Policy');

    await ReactTestRenderer.act(async () => {
      acceptBtn.props.onPress();
    });

    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(acceptBtn.props.title).toBe('Policy Acknowledged ✓');
  });

  test('Renders grievance officer contact details for escalation', async () => {
    const tree = await renderWithProvider(
      <PrivacyPolicyScreen userRole="client" onBack={jest.fn()} />
    );
    const root = tree.root;

    expect(root.findAllByProps({ children: 'Chief Grievance Redressal Officer (CGRO)' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Mr. Vikramaditya Rathore' }).length).toBeGreaterThan(0);
  });

  test('ProfileScreen integrates Privacy Policy navigation button', async () => {
    const onNavigateToPrivacyPolicy = jest.fn();
    const tree = await renderWithProvider(
      <ProfileScreen
        viewerRole="client"
        onBack={jest.fn()}
        onSignOut={jest.fn()}
        onNavigateToPrivacyPolicy={onNavigateToPrivacyPolicy}
      />
    );
    const root = tree.root;

    const privacyPolicyBtn = root.findByProps({ testID: 'btn-open-privacy-policy' });
    expect(privacyPolicyBtn).toBeTruthy();

    await ReactTestRenderer.act(async () => {
      privacyPolicyBtn.props.onPress();
    });

    expect(onNavigateToPrivacyPolicy).toHaveBeenCalledTimes(1);
  });
});
