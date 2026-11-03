import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AgentHomeScreen } from '../src/screens/AgentHomeScreen';
import { DashboardHeader } from '../src/components/dashboard/DashboardHeader';
import { AgentInfoCard } from '../src/components/dashboard/AgentInfoCard';
import { StatCard } from '../src/components/dashboard/StatCard';
import { ApplicationCard } from '../src/components/dashboard/ApplicationCard';
import { MonthlyPerformanceCard } from '../src/components/dashboard/MonthlyPerformanceCard';
import { BottomNavBar } from '../src/components/dashboard/BottomNavBar';
import {
  MOCK_AGENT,
  MOCK_STATS,
  MOCK_LATEST_APPLICATIONS,
  MOCK_MONTHLY_PERFORMANCE,
} from '../src/services/dashboardService';

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

describe('Ridhi Ratnam Associates - Agent Dashboard Suite', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(async () => {
    await ReactTestRenderer.act(async () => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  test('DashboardHeader renders agent name, designation, and notification triggers', async () => {
    const onNotifications = jest.fn();
    const onProfile = jest.fn();

    const tree = await renderWithProvider(
      <DashboardHeader
        agent={MOCK_AGENT}
        unreadCount={2}
        onPressNotifications={onNotifications}
        onPressProfile={onProfile}
      />
    );
    const root = tree.root;

    expect(root.findAllByProps({ children: 'Welcome back,' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Rahul Sharma' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Financial Advisor' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'RS' }).length).toBeGreaterThan(0);
  });

  test('AgentInfoCard renders Agent ID, Branch, and Active Status', async () => {
    const tree = await renderWithProvider(<AgentInfoCard agent={MOCK_AGENT} />);
    const root = tree.root;

    expect(root.findAllByProps({ children: 'RRA-AG-1024' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Chandigarh Branch' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Active' }).length).toBeGreaterThan(0);
  });

  test('StatCard renders titles, numeric values, and styled borders', async () => {
    const tree = await renderWithProvider(
      <>
        <StatCard stat={MOCK_STATS[0]} />
        <StatCard stat={MOCK_STATS[1]} />
        <StatCard stat={MOCK_STATS[2]} />
        <StatCard stat={MOCK_STATS[3]} />
      </>
    );
    const root = tree.root;

    expect(root.findAllByProps({ children: 'Total Applications' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Pending Applications' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Approved Applications' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Rejected Applications' }).length).toBeGreaterThan(0);

    expect(root.findAllByProps({ children: '248' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '42' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '176' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '30' }).length).toBeGreaterThan(0);
  });

  test('ApplicationCard renders client name, ID, loan amount, and status badge', async () => {
    const onPress = jest.fn();
    const tree = await renderWithProvider(
      <ApplicationCard
        application={MOCK_LATEST_APPLICATIONS[0]}
        onPress={onPress}
      />
    );
    const root = tree.root;

    expect(root.findAllByProps({ children: 'Amit Verma' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'ID: RRA-2026-00124' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '₹5,00,000' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Pending' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '02 Nov 2026' }).length).toBeGreaterThan(0);
  });

  test('MonthlyPerformanceCard renders approval percentage and counter pills', async () => {
    const tree = await renderWithProvider(
      <MonthlyPerformanceCard performance={MOCK_MONTHLY_PERFORMANCE} />
    );
    const root = tree.root;

    expect(root.findAllByProps({ children: 'Monthly Performance' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: '71.1%' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 45 }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 32 }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 8 }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 5 }).length).toBeGreaterThan(0);
  });

  test('BottomNavBar renders all four navigation items', async () => {
    const onSelectTab = jest.fn();
    const tree = await renderWithProvider(
      <BottomNavBar currentTab="dashboard" onSelectTab={onSelectTab} />
    );
    const root = tree.root;

    expect(root.findAllByProps({ children: 'Dashboard' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Applications' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Work History' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Profile' }).length).toBeGreaterThan(0);
  });

  test('AgentHomeScreen renders the full integrated dashboard', async () => {
    const onSignOut = jest.fn();
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={initialMetrics}>
          <AgentHomeScreen onSignOut={onSignOut} />
        </SafeAreaProvider>
      );
    });

    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(1000);
    });

    const root = tree.root;
    expect(root.findAllByProps({ children: 'Welcome back,' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Rahul Sharma' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'RRA-AG-1024' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Latest Applications' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'View All' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Amit Verma' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Neha Sharma' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Karan Mehta' }).length).toBeGreaterThan(0);
    expect(root.findAllByProps({ children: 'Priya Singh' }).length).toBeGreaterThan(0);
  });

  test('Tapping on a listing item invokes onViewApplicationDetail callback to open detail screen', async () => {
    const onViewApplicationDetail = jest.fn();
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={initialMetrics}>
          <AgentHomeScreen
            onSignOut={jest.fn()}
            onViewApplicationDetail={onViewApplicationDetail}
          />
        </SafeAreaProvider>
      );
    });

    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(1000);
    });

    const root = tree.root;
    // Find the first ApplicationCard
    const applicationCards = root.findAllByProps({ testID: 'application-card-RRA-2026-00124' });
    expect(applicationCards.length).toBeGreaterThan(0);

    await ReactTestRenderer.act(async () => {
      applicationCards[0].props.onPress();
    });

    expect(onViewApplicationDetail).toHaveBeenCalledTimes(1);
    expect(onViewApplicationDetail).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'RRA-2026-00124',
        clientName: 'Amit Verma',
      })
    );
  });

  test('Tapping on a work history listing item invokes onViewApplicationDetail', async () => {
    const onViewApplicationDetail = jest.fn();
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={initialMetrics}>
          <AgentHomeScreen
            onSignOut={jest.fn()}
            onViewApplicationDetail={onViewApplicationDetail}
          />
        </SafeAreaProvider>
      );
    });

    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(1000);
    });

    const root = tree.root;

    // Switch to Work History tab
    const historyTabBtn = root.findByProps({ testID: 'tab-nav-history' });
    await ReactTestRenderer.act(async () => {
      historyTabBtn.props.onPress();
    });

    // Find history card
    const historyItem = root.findByProps({ testID: 'history-item-h-1' });
    expect(historyItem).toBeTruthy();

    await ReactTestRenderer.act(async () => {
      historyItem.props.onPress();
    });

    expect(onViewApplicationDetail).toHaveBeenCalledTimes(1);
    expect(onViewApplicationDetail).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'RRA-2026-00122',
      })
    );
  });
});
