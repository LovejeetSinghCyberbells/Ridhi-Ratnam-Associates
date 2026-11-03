/**
 * Ridhi Ratnam Associates - Financial Growth Partner
 * Theme: Modern Dark & Pastel Pill Architecture
 */

import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/Navigator';
import { ThemeDialogProvider } from './src/components/ThemeDialog';
import { ThemeProvider, useAppTheme, colors } from './src/theme';

function AppContent(): React.JSX.Element {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemeDialogProvider>
          <AppContent />
        </ThemeDialogProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
