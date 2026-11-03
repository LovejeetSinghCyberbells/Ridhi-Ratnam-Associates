import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  BackHandler,
  Platform,
  ToastAndroid,
} from 'react-native';
import { colors } from '../theme';
import { SplashScreen } from '../screens/SplashScreen';
import { AuthScreen, AuthMode } from '../screens/AuthScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { AgentHomeScreen } from '../screens/AgentHomeScreen';
import { ClientHomeScreen } from '../screens/ClientHomeScreen';
import { ApplicationDetailScreen } from '../screens/ApplicationDetailScreen';
import { NotificationScreen } from '../screens/NotificationScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SupportScreen } from '../screens/SupportScreen';
import { NotificationSettingsScreen } from '../screens/NotificationSettingsScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';
import { TermsAndConditionsScreen } from '../screens/TermsAndConditionsScreen';
import { LoanApplication } from '../types/dashboard';
import { ClientLoanApplication } from '../types/client';
import { MOCK_LATEST_APPLICATIONS, MOCK_ALL_APPLICATIONS } from '../services/dashboardService';

export type ScreenState =
  | 'splash'
  | 'auth'
  | 'forgot-password'
  | 'agent-dashboard'
  | 'client-dashboard'
  | 'application-detail'
  | 'notifications'
  | 'profile'
  | 'support'
  | 'notification-settings'
  | 'privacy-policy'
  | 'terms-conditions';

export const AppNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('splash');
  const [authInitialMode, setAuthInitialMode] = useState<AuthMode>('login');
  const [activeRole, setActiveRole] = useState<'agent' | 'client'>('agent');
  const [selectedApplicationForDetail, setSelectedApplicationForDetail] = useState<LoanApplication | null>(null);
  const [detailViewerRole, setDetailViewerRole] = useState<'agent' | 'client'>('agent');
  const [screenHistory, setScreenHistory] = useState<ScreenState[]>([]);
  const lastBackPressRef = useRef<number>(0);

  const navigateTo = (nextScreen: ScreenState, mode?: AuthMode) => {
    if (nextScreen === currentScreen && mode === authInitialMode) return;

    if (mode) {
      setAuthInitialMode(mode);
    }

    if (nextScreen === 'splash' || nextScreen === 'auth') {
      setScreenHistory([]);
    } else if (nextScreen === 'agent-dashboard' || nextScreen === 'client-dashboard') {
      // Returning or entering root dashboard clears sub-screen stack
      setScreenHistory([]);
    } else {
      setScreenHistory((prev) => [...prev, currentScreen]);
    }

    setCurrentScreen(nextScreen);
  };

  const goBack = useCallback(() => {
    if (screenHistory.length > 0) {
      const prevScreen = screenHistory[screenHistory.length - 1];
      setScreenHistory((prev) => prev.slice(0, prev.length - 1));
      setCurrentScreen(prevScreen);
      return true;
    }

    // Fallback if history is empty but on a non-root screen:
    if (
      currentScreen === 'application-detail' ||
      currentScreen === 'notifications' ||
      currentScreen === 'profile' ||
      currentScreen === 'support'
    ) {
      setCurrentScreen(activeRole === 'agent' ? 'agent-dashboard' : 'client-dashboard');
      return true;
    }

    if (
      currentScreen === 'notification-settings' ||
      currentScreen === 'privacy-policy' ||
      currentScreen === 'terms-conditions'
    ) {
      setCurrentScreen('profile');
      return true;
    }

    if (currentScreen === 'forgot-password') {
      setCurrentScreen('auth');
      return true;
    }

    return false;
  }, [screenHistory, currentScreen, activeRole]);

  const handleSignOut = () => {
    setSelectedApplicationForDetail(null);
    setScreenHistory([]);
    navigateTo('auth', 'login');
  };

  useEffect(() => {
    const onHardwareBack = () => {
      // 1. If on sub-screens, navigate back
      if (
        currentScreen !== 'splash' &&
        currentScreen !== 'auth' &&
        currentScreen !== 'agent-dashboard' &&
        currentScreen !== 'client-dashboard'
      ) {
        return goBack();
      }

      // 2. If on root screens (dashboard or auth login), double-tap to exit
      if (
        currentScreen === 'agent-dashboard' ||
        currentScreen === 'client-dashboard' ||
        currentScreen === 'auth'
      ) {
        const now = Date.now();
        if (now - lastBackPressRef.current < 2000) {
          BackHandler.exitApp();
          return true;
        }
        lastBackPressRef.current = now;
        if (Platform.OS === 'android') {
          ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
        }
        return true;
      }

      return false;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => backSubscription.remove();
  }, [currentScreen, goBack]);

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen
            onFinish={() => navigateTo('auth', 'login')}
          />
        );
      case 'auth':
        return (
          <AuthScreen
            initialMode={authInitialMode}
            onNavigateToForgotPassword={() => navigateTo('forgot-password')}
            onLoginSuccess={(role) => {
              setActiveRole(role);
              navigateTo(role === 'agent' ? 'agent-dashboard' : 'client-dashboard');
            }}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordScreen
            onNavigateToLogin={() => navigateTo('auth', 'login')}
            onBack={goBack}
          />
        );
      case 'client-dashboard':
        return (
          <ClientHomeScreen
            onSignOut={handleSignOut}
            onViewApplicationDetail={(cApp: any) => {
              const converted: LoanApplication = {
                id: cApp.id,
                clientName: cApp.clientName || 'Amit Verma',
                clientInitials: cApp.clientInitials || 'AV',
                clientPhone: cApp.clientPhone || '+91 9876543210',
                clientEmail: cApp.clientEmail || 'amit.client@ridhiratnam.demo',
                loanType: cApp.loanType || `${cApp.documents?.length || 4} KYC Documents`,
                loanAmount: cApp.amount || 0,
                formattedAmount: cApp.formattedAmount || `${cApp.documents?.length || 4} Docs`,
                submissionDate: cApp.submissionDate || '02 Nov 2026',
                status: (cApp.status === 'Submitted' || cApp.status === 'PENDING' ? 'Pending' : cApp.status) as any,
                tenureMonths: cApp.tenureMonths || 36,
                interestRate: cApp.interestRate || 'N/A (KYC Verification)',
                emiAmount: cApp.emiAmount,
                notes: cApp.notes || cApp.agentRemarks,
                rejectionReason: cApp.rejectionReason,
                requestedDocuments: cApp.requestedDocuments,
                agentAssigned: cApp.agentAssigned || {
                  name: 'Rahul Sharma',
                  id: 'RRA-AG-1024',
                  phone: '+91 9876543210',
                  branch: 'Chandigarh Branch',
                },
                documents: cApp.documents || [],
                deepAnalysis: cApp.deepAnalysis,
              };
              setSelectedApplicationForDetail(converted);
              setDetailViewerRole('client');
              navigateTo('application-detail');
            }}
            onNavigateToNotifications={() => {
              setActiveRole('client');
              navigateTo('notifications');
            }}
            onNavigateToProfile={() => {
              setActiveRole('client');
              navigateTo('profile');
            }}
            onNavigateToSupport={() => {
              setActiveRole('client');
              navigateTo('support');
            }}
          />
        );
      case 'agent-dashboard':
        return (
          <AgentHomeScreen
            onSignOut={handleSignOut}
            onViewApplicationDetail={(app: any) => {
              const converted: LoanApplication = {
                id: app.id,
                clientName: app.clientName || 'Amit Verma',
                clientInitials: app.clientInitials || 'AV',
                clientPhone: app.clientPhone || '+91 9876543210',
                clientEmail: app.clientEmail || 'amit.client@ridhiratnam.demo',
                loanType: app.loanType || `${app.documents?.length || 4} KYC Documents`,
                loanAmount: app.amount || 0,
                formattedAmount: app.formattedAmount || `${app.documents?.length || 4} Docs`,
                submissionDate: app.submissionDate || '02 Nov 2026',
                status: (app.status === 'Submitted' || app.status === 'PENDING' ? 'Pending' : app.status) as any,
                notes: app.notes || app.agentRemarks,
                rejectionReason: app.rejectionReason,
                requestedDocuments: app.requestedDocuments,
                agentAssigned: app.agentAssigned || {
                  name: 'Rahul Sharma',
                  id: 'RRA-AG-1024',
                  phone: '+91 9876543210',
                  branch: 'Chandigarh Branch',
                },
                documents: app.documents || [],
                deepAnalysis: app.deepAnalysis,
              };
              setSelectedApplicationForDetail(converted);
              setDetailViewerRole('agent');
              navigateTo('application-detail');
            }}
            onNavigateToNotifications={() => {
              setActiveRole('agent');
              navigateTo('notifications');
            }}
            onNavigateToProfile={() => {
              setActiveRole('agent');
              navigateTo('profile');
            }}
            onNavigateToSupport={() => {
              setActiveRole('agent');
              navigateTo('support');
            }}
          />
        );
      case 'application-detail':
        return (
          <ApplicationDetailScreen
            application={selectedApplicationForDetail || MOCK_LATEST_APPLICATIONS[0]}
            viewerRole={detailViewerRole}
            onBack={goBack}
            onStatusChange={(updatedApp) => {
              setSelectedApplicationForDetail(updatedApp);
            }}
          />
        );
      case 'notifications':
        return (
          <NotificationScreen
            userRole={activeRole}
            onBack={goBack}
            onSelectApplicationId={(appId) => {
              const app =
                MOCK_LATEST_APPLICATIONS.find((a) => a.id === appId) ||
                MOCK_ALL_APPLICATIONS.find((a) => a.id === appId);
              if (app) {
                setSelectedApplicationForDetail(app);
                setDetailViewerRole(activeRole);
                navigateTo('application-detail');
              }
            }}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            viewerRole={activeRole}
            onBack={goBack}
            onSignOut={handleSignOut}
            onNavigateToSupport={() => navigateTo('support')}
            onNavigateToNotificationSettings={() => navigateTo('notification-settings')}
            onNavigateToPrivacyPolicy={() => navigateTo('privacy-policy')}
            onNavigateToTermsAndConditions={() => navigateTo('terms-conditions')}
          />
        );
      case 'support':
        return (
          <SupportScreen
            viewerRole={activeRole}
            onBack={goBack}
          />
        );
      case 'notification-settings':
        return (
          <NotificationSettingsScreen
            userRole={activeRole}
            onBack={goBack}
          />
        );
      case 'privacy-policy':
        return (
          <PrivacyPolicyScreen
            userRole={activeRole}
            onBack={goBack}
          />
        );
      case 'terms-conditions':
        return (
          <TermsAndConditionsScreen
            userRole={activeRole}
            onBack={goBack}
          />
        );
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Screen Container */}
      <View style={styles.screenContainer}>
        {renderCurrentScreen()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
});
