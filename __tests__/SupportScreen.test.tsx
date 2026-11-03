import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { SupportScreen } from '../src/screens/SupportScreen';
import { SupportCard } from '../src/components/client/SupportCard';

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

describe('Ridhi Ratnam Associates - Dedicated Support & Help Center Screen', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Renders header, quick call button, and assigned relationship manager', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <SupportScreen viewerRole="client" onBack={onBack} />
    );
    const root = tree.root;

    // Header Titles
    expect(root.findAllByProps({ children: 'Help & Support Desk' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'CUSTOMER CARE & ADVISORY' }).length).toBeGreaterThan(0);

    // Assigned Loan Officer
    expect(root.findAllByProps({ children: 'Dedicated Loan Officer' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Rahul Sharma' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Toll-Free Helpline: 1800 123 4567' }).length).toBeGreaterThan(0);
  });

  test('Renders Agent Partner Operations Desk when viewerRole is agent', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <SupportScreen viewerRole="agent" onBack={onBack} />
    );
    const root = tree.root;

    expect(root.findAllByProps({ children: 'Regional Branch Director' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Sanjay Malhotra' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Agent Operations: 1800 419 7434' }).length).toBeGreaterThan(0);
  });

  test('Navigates between tabs: Contact Desk, Tickets, FAQs, and Grievance', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <SupportScreen viewerRole="client" onBack={onBack} />
    );
    const root = tree.root;

    // Switch to Tickets tab
    const ticketTabBtn = root.findByProps({ testID: 'tab-support-ticket' });
    expect(ticketTabBtn).toBeDefined();

    await ReactTestRenderer.act(async () => {
      ticketTabBtn.props.onPress();
    });

    // Check Ticket creation form exists
    expect(root.findAllByProps({ children: 'Raise a Support Ticket' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'TKT-2026-8941' }).length).toBeGreaterThan(0);

    // Switch to FAQ tab
    const faqTabBtn = root.findByProps({ testID: 'tab-support-faq' });
    await ReactTestRenderer.act(async () => {
      faqTabBtn.props.onPress();
    });

    expect(root.findAllByProps({ children: 'Frequently Asked Questions' }).length).toBeGreaterThan(0);

    // Switch to Grievance tab
    const grievanceTabBtn = root.findByProps({ testID: 'tab-support-grievance' });
    await ReactTestRenderer.act(async () => {
      grievanceTabBtn.props.onPress();
    });

    expect(root.findAllByProps({ children: 'RBI Fair Practices & Grievance Policy' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '3-Tier Redressal Escalation Matrix' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Principal Nodal Grievance Officer' }).length).toBeGreaterThan(0);
  });

  test('SupportCard invokes onPressContactSupport when provided', async () => {
    const onPressContactSupport = jest.fn();
    const tree = await renderWithProvider(
      <SupportCard onPressContactSupport={onPressContactSupport} />
    );
    const root = tree.root;

    const contactBtn = root.findByProps({ title: 'Contact Advisor Support' });
    expect(contactBtn).toBeDefined();

    await ReactTestRenderer.act(async () => {
      contactBtn.props.onPress();
    });

    expect(onPressContactSupport).toHaveBeenCalledTimes(1);
  });
});
