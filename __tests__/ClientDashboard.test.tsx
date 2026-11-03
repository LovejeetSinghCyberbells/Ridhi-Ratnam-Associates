import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClientHomeScreen } from '../src/screens/ClientHomeScreen';
import { ClientHeader } from '../src/components/client/ClientHeader';
import { ApplyBannerCard } from '../src/components/client/ApplyBannerCard';
import { CurrentApplicationCard } from '../src/components/client/CurrentApplicationCard';
import { ClientStatCards } from '../src/components/client/ClientStatCards';
import { RecentApplicationsSection } from '../src/components/client/RecentApplicationsSection';
import { SupportCard } from '../src/components/client/SupportCard';
import { ClientBottomNav } from '../src/components/client/ClientBottomNav';
import { LoanApplicationForm } from '../src/components/client/LoanApplicationForm';
import {
  MOCK_CLIENT_PROFILE,
  MOCK_CLIENT_STATS,
  MOCK_CLIENT_APPLICATIONS,
} from '../src/services/clientService';

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

describe('Ridhi Ratnam Associates - Client Dashboard Suite', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(async () => {
    await ReactTestRenderer.act(async () => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  test('ClientHeader renders greeting, client name, and welcome subtitle', async () => {
    const onNotifs = jest.fn();
    const onProfile = jest.fn();

    const tree = await renderWithProvider(
      <ClientHeader
        client={MOCK_CLIENT_PROFILE}
        unreadCount={1}
        onPressNotifications={onNotifs}
        onPressProfile={onProfile}
      />
    );
    const root = tree.root;

    expect(root.findAllByProps({ children: 'Good Morning,' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Amit Verma' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Welcome to Ridhi Ratnam Associates' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'AV' }).length).toBeGreaterThan(0);
  });

  test('ApplyBannerCard renders financial support heading and Apply CTA', async () => {
    const onApply = jest.fn();
    const tree = await renderWithProvider(<ApplyBannerCard onPressApply={onApply} />);
    const root = tree.root;

    expect(root.findAllByProps({ children: 'Looking for Financial Support?' }).length).toBeGreaterThan(0);
    expect(
      root.findAllByProps({
        children: 'Explore loan options and submit your application with Ridhi Ratnam Associates.',
      }).length
    ).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Apply for Loan' }).length).toBeGreaterThan(0);
  });

  test('CurrentApplicationCard renders active application details and 4-step progress tracker', async () => {
    const onView = jest.fn();
    const onApply = jest.fn();

    const tree = await renderWithProvider(
      <CurrentApplicationCard
        application={MOCK_CLIENT_APPLICATIONS[0]}
        onViewApplication={onView}
        onApplyNew={onApply}
      />
    );
    const root = tree.root;

    expect(root.findAllByProps({ children: 'ID: RRA-2026-00124' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '₹5,00,000' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '02 Nov 2026' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Under Review' }).length).toBeGreaterThan(0);

    // 4 milestone labels
    expect(root.findAllByProps({ children: 'Application Submitted' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Document Verification' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Application Review' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Final Decision' }).length).toBeGreaterThan(0);

    // View Application button
    expect(root.findAllByProps({ children: 'View Application' }).length).toBeGreaterThan(0);
  });

  test('ClientStatCards renders Total (4), Approved (2), and Pending (1)', async () => {
    const tree = await renderWithProvider(<ClientStatCards stats={MOCK_CLIENT_STATS} />);
    const root = tree.root;

    expect(root.findAllByProps({ children: 4 }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 2 }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 1 }).length).toBeGreaterThan(0);

    expect(root.findAllByProps({ children: 'Total Apps' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Approved' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Pending' }).length).toBeGreaterThan(0);
  });

  test('RecentApplicationsSection renders 3 cards with View All button', async () => {
    const onViewAll = jest.fn();
    const onSelect = jest.fn();

    const tree = await renderWithProvider(
      <RecentApplicationsSection
        applications={MOCK_CLIENT_APPLICATIONS.slice(0, 3)}
        onViewAll={onViewAll}
        onSelectApplication={onSelect}
      />
    );
    const root = tree.root;

    expect(root.findAllByProps({ children: 'Recent Applications' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'View All' }).length).toBeGreaterThan(0);

    // Application 1
    expect(root.findAllByProps({ children: 'ID: RRA-2026-00124' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '₹5,00,000' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Under Review' }).length).toBeGreaterThan(0);

    // Application 2
    expect(root.findAllByProps({ children: 'ID: RRA-2026-00098' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '₹3,00,000' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Approved' }).length).toBeGreaterThan(0);

    // Application 3
    expect(root.findAllByProps({ children: 'ID: RRA-2026-00075' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '₹2,00,000' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Rejected' }).length).toBeGreaterThan(0);
  });

  test('SupportCard renders assistance title, phone, and email channels', async () => {
    const tree = await renderWithProvider(<SupportCard />);
    const root = tree.root;

    expect(root.findAllByProps({ children: 'Need Assistance?' }).length).toBeGreaterThan(0);
    expect(
      root.findAllByProps({
        children: 'Our team is here to help you with your application.',
      }).length
    ).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '1800 234 5678' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'support@ridhiratnam.com' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Contact Advisor Support' }).length).toBeGreaterThan(0);
  });

  test('ClientBottomNav renders Home, Apply, History, Profile tabs', async () => {
    const onSelectTab = jest.fn();
    const tree = await renderWithProvider(
      <ClientBottomNav currentTab="home" onSelectTab={onSelectTab} />
    );
    const root = tree.root;

    expect(root.findAllByProps({ children: 'Home' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Apply' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'History' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Profile' }).length).toBeGreaterThan(0);
  });

  test('ClientHomeScreen renders full integrated dashboard with client data', async () => {
    const onSignOut = jest.fn();
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={initialMetrics}>
          <ClientHomeScreen onSignOut={onSignOut} />
        </SafeAreaProvider>
      );
    });

    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(1000);
    });

    const root = tree.root;
    expect(root.findAllByProps({ children: 'Good Morning,' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Amit Verma' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Looking for Financial Support?' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Your Application' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Recent Applications' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Need Assistance?' }).length).toBeGreaterThan(0);
  });

  test('LoanApplicationForm renders real-world KYC, PAN, Aadhaar, and 6-doc attachment registry', async () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();

    const tree = await renderWithProvider(
      <LoanApplicationForm onSubmitSuccess={onSubmit} onCancel={onCancel} />
    );

    const root = tree.root;

    // Form title & sections
    expect(root.findAllByProps({ children: 'Apply for a Loan' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '1. Facility & Loan Requirements' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '2. Applicant KYC & Business Profile' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '3. Mandatory Document Attachments' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '4. Regulatory Consents & Declarations' }).length).toBeGreaterThan(0);

    // KYC Inputs
    expect(root.findByProps({ testID: 'input-applicant-name' })).toBeDefined();
    expect(root.findByProps({ testID: 'input-pan-number' })).toBeDefined();
    expect(root.findByProps({ testID: 'input-aadhaar-number' })).toBeDefined();
    expect(root.findByProps({ testID: 'input-monthly-income' })).toBeDefined();

    // Document attachments
    expect(
      root.findAllByProps({ children: 'Permanent Account Number (PAN) Card' }).length
    ).toBeGreaterThan(0);
    expect(
      root.findAllByProps({ children: 'Aadhaar Card (e-KYC Offline XML)' }).length
    ).toBeGreaterThan(0);
    expect(
      root.findAllByProps({ children: 'Operating Bank Statement (6 Months PDF)' }).length
    ).toBeGreaterThan(0);
    expect(
      root.findAllByProps({ children: 'ITR-4 & Computation of Income (FY 2025-26)' }).length
    ).toBeGreaterThan(0);
  });

  test('LoanApplicationForm submits complete dossier with attached documents and deep analysis', async () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();

    const tree = await renderWithProvider(
      <LoanApplicationForm onSubmitSuccess={onSubmit} onCancel={onCancel} />
    );

    const root = tree.root;

    // Submit button
    const submitBtn = root.findByProps({ testID: 'btn-submit-loan-application' });
    expect(submitBtn).toBeDefined();

    await ReactTestRenderer.act(async () => {
      submitBtn.props.onPress();
    });

    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(1100);
    });

    // Verify onSubmitSuccess was called with documents and deepAnalysis
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        applicantName: 'Amit Verma',
        panNumber: 'ABCDE1234F',
        status: 'Under Review',
        documents: expect.arrayContaining([
          expect.objectContaining({ name: 'Permanent Account Number (PAN) Card' }),
          expect.objectContaining({ name: 'Operating Bank Statement (6 Months PDF)' }),
        ]),
        deepAnalysis: expect.objectContaining({
          cibilScore: 780,
          cibilGrade: 'Excellent',
        }),
      })
    );
  });
});

