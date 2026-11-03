import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TermsAndConditionsScreen } from '../src/screens/TermsAndConditionsScreen';
import { ThemeProvider } from '../src/theme/ThemeContext';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

describe('TermsAndConditionsScreen', () => {
  const renderScreen = async (props = {}) => {
    let tree: any;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={initialMetrics}>
          <ThemeProvider>
            <TermsAndConditionsScreen onBack={jest.fn()} {...props} />
          </ThemeProvider>
        </SafeAreaProvider>
      );
    });
    return tree;
  };

  test('renders top header with title and regulatory badge', async () => {
    const tree = await renderScreen();
    const root = tree.root;

    expect(root.findAllByProps({ children: 'Terms & Conditions' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'LEGAL & REGULATORY GOVERNANCE' }).length).toBeGreaterThan(0);
  });

  test('calls onBack when back button is pressed', async () => {
    const onBackMock = jest.fn();
    const tree = await renderScreen({ onBack: onBackMock });
    const root = tree.root;

    const backBtn = root.findByProps({ testID: 'btn-terms-back' });
    await act(async () => {
      backBtn.props.onPress();
    });

    expect(onBackMock).toHaveBeenCalledTimes(1);
  });

  test('renders trust banner and core legal sections', async () => {
    const tree = await renderScreen();
    const root = tree.root;

    expect(
      root.findAllByProps({ children: 'Scope of Intermediation & Advisory Facilities' }).length
    ).toBeGreaterThan(0);
    expect(
      root.findAllByProps({ children: 'Applicant Eligibility & KYC Verification' }).length
    ).toBeGreaterThan(0);
    expect(
      root.findAllByProps({ children: 'Sanction Terms & Key Fact Statement (KFS)' }).length
    ).toBeGreaterThan(0);
    expect(
      root.findAllByProps({ children: 'Repayments, NACH Mandates & Penalties' }).length
    ).toBeGreaterThan(0);
    expect(
      root.findAllByProps({ children: 'Foreclosure & Pre-Payment Regulations' }).length
    ).toBeGreaterThan(0);
    expect(
      root.findAllByProps({ children: 'Governing Law & Legal Jurisdiction' }).length
    ).toBeGreaterThan(0);
  });

  test('renders escalation desk details', async () => {
    const tree = await renderScreen();
    const root = tree.root;

    expect(
      root.findAllByProps({ children: 'Legal Affairs & Compliance Desk' }).length
    ).toBeGreaterThan(0);
    expect(
      root.findAllByProps({ children: 'legal@ridhiratnam.com' }).length
    ).toBeGreaterThan(0);
  });

  test('handles accept terms button interaction', async () => {
    const onAcceptMock = jest.fn();
    const tree = await renderScreen({ onAccept: onAcceptMock });
    const root = tree.root;

    const acceptBtn = root.findByProps({ testID: 'btn-accept-terms' });
    expect(acceptBtn.props.title).toBe('I Acknowledge & Accept Terms');

    await act(async () => {
      acceptBtn.props.onPress();
    });

    expect(onAcceptMock).toHaveBeenCalledTimes(1);
    expect(acceptBtn.props.title).toBe('Terms Acknowledged ✓');
  });
});

