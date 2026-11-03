import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApplicationDetailScreen } from '../src/screens/ApplicationDetailScreen';
import { MOCK_LATEST_APPLICATIONS } from '../src/services/dashboardService';
import { LoanApplication } from '../src/types/dashboard';

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

describe('Ridhi Ratnam Associates - Dedicated Application Detail Screen', () => {
  const sampleApp: LoanApplication = MOCK_LATEST_APPLICATIONS[0]; // Amit Verma

  test('Renders header, client name, loan amount, and financial metrics strip', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <ApplicationDetailScreen
        application={sampleApp}
        viewerRole="agent"
        onBack={onBack}
      />
    );

    const root = tree.root;

    // Verify Application ID in header
    expect(root.findAllByProps({ children: sampleApp.id }).length).toBeGreaterThan(0);
    // Verify Client Name
    expect(root.findAllByProps({ children: sampleApp.clientName }).length).toBeGreaterThan(0);
    // Verify Formatted Sanction Amount
    expect(root.findAllByProps({ children: sampleApp.formattedAmount }).length).toBeGreaterThan(0);
    // Verify Interest Rate
    expect(root.findAllByProps({ children: sampleApp.interestRate }).length).toBeGreaterThan(0);
  });

  test('Displays uploaded client documents with verification status and allows document preview', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <ApplicationDetailScreen
        application={sampleApp}
        viewerRole="agent"
        onBack={onBack}
      />
    );

    const root = tree.root;

    // Document Verification Audit Header
    expect(root.findAllByProps({ children: 'Document Verification Audit' }).length).toBeGreaterThan(0);

    // Verify document names appear
    expect(root.findAllByProps({ children: 'Permanent Account Number (PAN) Card' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Aadhaar Card (e-KYC Offline XML)' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'HDFC Bank Statement (6 Months Operating)' }).length).toBeGreaterThan(0);

    // Verify Preview Document buttons exist
    const previewButtons = root.findAll((node: any) => {
      return (
        node.props?.children === 'Preview Document' &&
        node.type === 'Text'
      );
    });
    expect(previewButtons.length).toBeGreaterThan(0);

    // Trigger preview of first document via testID
    const docPreviewTouchable = root.findByProps({ testID: 'doc-preview-doc-1' });
    expect(docPreviewTouchable).toBeDefined();
    await ReactTestRenderer.act(async () => {
      docPreviewTouchable.props.onPress();
    });

    // Modal should now display DOCUMENT AUDIT PREVIEW
    expect(root.findAllByProps({ children: 'DOCUMENT AUDIT PREVIEW' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'DIGITALLY VERIFIED' }).length).toBeGreaterThan(0);
  });

  test('Switches to Deep Analysis tab and renders CIBIL Score, FOIR, and 6-point checklist', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <ApplicationDetailScreen
        application={sampleApp}
        viewerRole="agent"
        onBack={onBack}
      />
    );

    const root = tree.root;

    // Find "Deep Analysis" tab button via testID
    const analysisTab = root.findByProps({ testID: 'tab-analysis' });
    expect(analysisTab).toBeDefined();

    await ReactTestRenderer.act(async () => {
      analysisTab.props.onPress();
    });

    // Check CIBIL Bureau Rating and Score
    expect(root.findAllByProps({ children: 'CIBIL BUREAU RATING' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 785 }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Excellent' }).length).toBeGreaterThan(0);

    // Check Financial Ratios
    expect(root.findAllByProps({ children: 'Financial & Debt Capacity Ratios' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '36%' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '₹95,000' }).length).toBeGreaterThan(0);

    // Check 6-Point Checklist
    expect(root.findAllByProps({ children: '6-Point Underwriting Checklist' }).length).toBeGreaterThan(0);
    expect(
      root.findAllByProps({ children: 'Identity & Biometric Authentication' }).length
    ).toBeGreaterThan(0);
    expect(
      root.findAllByProps({ children: 'Bank Cash Flow & Inflow Continuity' }).length
    ).toBeGreaterThan(0);
  });

  test('Switches to Overview & Audit tab and displays client contact and assigned advisor', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <ApplicationDetailScreen
        application={sampleApp}
        viewerRole="agent"
        onBack={onBack}
      />
    );

    const root = tree.root;

    // Find "Overview & Audit" tab button via testID
    const overviewTab = root.findByProps({ testID: 'tab-overview' });
    expect(overviewTab).toBeDefined();

    await ReactTestRenderer.act(async () => {
      overviewTab.props.onPress();
    });

    // Check KYC card
    expect(root.findAllByProps({ children: 'Client Identification & KYC' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: sampleApp.clientPhone }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: sampleApp.clientEmail }).length).toBeGreaterThan(0);

    // Check Assigned Underwriter Advisor
    expect(root.findAllByProps({ children: 'Assigned Underwriting Advisor' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Rahul Sharma' }).length).toBeGreaterThan(0);
  });

  test('Renders agent underwriting controls (Sanction & Approve, Decline) in agent mode', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <ApplicationDetailScreen
        application={sampleApp}
        viewerRole="agent"
        onBack={onBack}
      />
    );

    const root = tree.root;

    // Agent actions present
    expect(root.findAllByProps({ children: 'Sanction & Approve Loan' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Decline' }).length).toBeGreaterThan(0);
  });

  test('Renders client download action in client mode', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <ApplicationDetailScreen
        application={sampleApp}
        viewerRole="client"
        onBack={onBack}
      />
    );

    const root = tree.root;

    // Client action present
    expect(
      root.findAllByProps({ children: 'Download Application Dossier' }).length
    ).toBeGreaterThan(0);
    // Sanction approval should NOT be present for client
    expect(root.findAllByProps({ children: 'Sanction & Approve Loan' }).length).toBe(0);
  });

  test('Back button calls onBack callback', async () => {
    const onBack = jest.fn();
    const tree = await renderWithProvider(
      <ApplicationDetailScreen
        application={sampleApp}
        viewerRole="agent"
        onBack={onBack}
      />
    );

    const root = tree.root;
    const backBtn = root.findByProps({ accessibilityLabel: 'Go back' });
    expect(backBtn).toBeDefined();

    await ReactTestRenderer.act(async () => {
      backBtn.props.onPress();
    });

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
