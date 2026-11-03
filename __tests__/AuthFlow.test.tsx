import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthScreen } from '../src/screens/AuthScreen';
import { ForgotPasswordScreen } from '../src/screens/ForgotPasswordScreen';
import { SplashScreen } from '../src/screens/SplashScreen';
import {
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  BriefcaseIcon,
  MailIcon,
  PhoneIcon,
  LockIcon,
  CheckIcon,
} from '../src/components/Icons';

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

describe('Ridhi Ratnam Associates - Auth UI Suite', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(async () => {
    await ReactTestRenderer.act(async () => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  test('Icons render without errors', async () => {
    const tree = await renderWithProvider(
      <>
        <EyeIcon />
        <EyeOffIcon />
        <UserIcon />
        <BriefcaseIcon />
        <MailIcon />
        <PhoneIcon />
        <LockIcon />
        <CheckIcon />
      </>
    );
    expect(tree).toBeTruthy();
  });

  test('SplashScreen renders logo, company name, and tagline', async () => {
    const onFinish = jest.fn();
    const tree = await renderWithProvider(<SplashScreen onFinish={onFinish} />);
    const root = tree.root;

    const title = root.findAllByProps({ children: 'Ridhi Ratnam Associates' });
    expect(title.length).toBeGreaterThan(0);

    const tagline = root.findAllByProps({ children: 'YOUR FINANCIAL GROWTH PARTNER' });
    expect(tagline.length).toBeGreaterThan(0);
  });

  test('AuthScreen renders Sign In with required fields', async () => {
    const onNavigateToForgotPassword = jest.fn();
    const tree = await renderWithProvider(
      <AuthScreen
        initialMode="login"
        onNavigateToForgotPassword={onNavigateToForgotPassword}
      />
    );
    const root = tree.root;

    expect(root.findAllByProps({ children: 'Sign In' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Sign Up' }).length).toBeGreaterThan(0);

    const forgotPass = root.findAllByProps({ children: 'Forgot Password?' });
    expect(forgotPass.length).toBeGreaterThan(0);

    const continueBtn = root.findAllByProps({ children: 'Continue with Email' });
    expect(continueBtn.length).toBeGreaterThan(0);
  });

  test('AuthScreen in signup mode does NOT render investment goals (Mutual Funds, SIP, etc.)', async () => {
    const tree = await renderWithProvider(
      <AuthScreen
        initialMode="signup"
        onNavigateToForgotPassword={jest.fn()}
      />
    );
    const root = tree.root;

    expect(root.findAllByProps({ children: 'Mutual Funds' }).length).toBe(0);
    expect(root.findAllByProps({ children: 'SIP Growth' }).length).toBe(0);
    expect(root.findAllByProps({ children: 'Select Investment Goals' }).length).toBe(0);
  });

  test('ForgotPasswordScreen renders recovery methods and fields', async () => {
    const onLogin = jest.fn();
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <ForgotPasswordScreen onNavigateToLogin={onLogin} onBack={onBack} />
    );
    const root = tree.root;

    expect(root.findAllByProps({ children: 'Account Recovery' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Registered Email' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'SMS to Mobile' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Send Verification Code' }).length).toBeGreaterThan(0);
  });
});
