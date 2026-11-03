# Ridhi Ratnam Associates

Ridhi Ratnam Associates (RRA) is a React Native KYC and verification portal for clients and verification agents. It provides a polished mobile experience for submitting identity documents, reviewing application status, managing KYC history, and processing submissions.

The repository currently uses realistic mock data and an in-memory service layer. It is designed for UI demonstration, workflow prototyping, and React Native development without requiring a backend.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [Application Flow](#application-flow)
- [Demo Accounts](#demo-accounts)
- [Technology Stack](#technology-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Data and Mock Services](#data-and-mock-services)
- [Testing](#testing)
- [Android Build](#android-build)
- [iOS Build](#ios-build)
- [Troubleshooting](#troubleshooting)
- [Known Limitations](#known-limitations)
- [Configuration Reference](#configuration-reference)
- [Contributing](#contributing)
- [License](#license)

## Overview

RRA organizes the KYC process into two separate experiences:

- **Clients** can register, sign in, upload identity and supporting documents, submit KYC applications, track verification progress, view history, and manage profile and support information.
- **Verification agents** can review submission statistics, search applications, inspect document details, approve or reject requests, add remarks, and review their verification history.

The app has a custom light theme, safe-area-aware layout, Android hardware back navigation, animated splash screen, accessibility labels, reusable UI components, and a centralized application navigator.

## Key Features

### Client features

- Splash screen with branded animation
- Login and client registration
- Password validation and forgot-password workflow
- Client dashboard with verification status
- KYC document upload form
- Aadhaar, PAN, address proof, and photograph workflows
- Submission status progression:
  - Submitted
  - Document verification
  - Application review
  - Final decision
- Recent and complete submission history
- Status, rejection, document, and advisor information
- Profile details and assigned agent information
- Notifications, support, privacy, terms, and sign-out actions

### Agent features

- Agent login
- Total, pending, approved, and rejected submission statistics
- Latest KYC submissions dashboard
- Searchable submission list with status filters
- Application and document detail view
- Individual document verification
- Approval and rejection actions
- Rejection reasons and reviewer remarks
- Verified submission history
- Agent profile, branch, designation, and activity summary

### Shared features

- Two-role interface
- Custom bottom navigation for each role
- Theme provider and reusable design tokens
- Input validation and inline form errors
- Loading and empty-state presentation
- Modal notification, alert, profile, and detail components
- Android back handling and double-tap exit behavior
- Privacy policy and terms acknowledgement screens
- Jest and React Test Renderer coverage

## User Roles

### Client

Clients use the client portal to upload documents and track verification. Sample client access:

```text
Email:    amit.client@ridhiratnam.demo
Password: Client@123
```

Client identifier options also include the demo ID `RRA-CL-1001` or the demo mobile number `+91 9876543210`.

### Agent

Agents use the verification dashboard to process submissions. Sample agent access:

```text
Email/ID: rahul.agent@ridhiratnam.demo or RRA-AG-1024
Password: Agent@123
```

Identifiers containing `agent` are also routed through the mock agent authentication path.

## Application Flow

1. The app opens on the animated splash screen.
2. The user selects the sign-in or registration workflow.
3. Mock authentication resolves a client or agent account.
4. The user enters the role-specific dashboard.
5. Clients can upload documents and submit or resubmit KYC requests.
6. Agents can search submissions and open an application detail view.
7. Agents can mark documents or applications as approved or rejected.
8. Status, history, notifications, and profile screens reflect the in-memory state.
9. Sign-out returns the user to authentication.

## Demo Accounts

| Role | Identifier | Password |
| --- | --- | --- |
| Agent | `rahul.agent@ridhiratnam.demo` | `Agent@123` |
| Agent | `RRA-AG-1024` | `Agent@123` |
| Client | `amit.client@ridhiratnam.demo` | `Client@123` |
| Client | `RRA-CL-1001` | `Client@123` |
| Client | `+91 9876543210` | `Client@123` |

These credentials are demonstration credentials only. They are not suitable for production authentication.

## Technology Stack

| Area | Technology |
| --- | --- |
| UI framework | React Native 0.88.1 |
| Language | TypeScript 6 |
| Runtime library | React 19.3 |
| Navigation | Custom screen-state navigator |
| Styling | React Native StyleSheet |
| Safe areas | `react-native-safe-area-context` |
| Android build | Gradle |
| iOS build | Xcode and CocoaPods |
| Testing | Jest 29 and react-test-renderer |
| JavaScript tooling | Metro and Babel |
| Linting | ESLint |

## Requirements

### All platforms

- Node.js `>= 22.11.0`
- npm
- Git

### Android

- JDK 17
- Android Studio
- Android SDK
- Android SDK Platform and Build Tools matching the project Gradle configuration
- An Android emulator or USB-connected device

### iOS

- macOS
- Xcode and Xcode Command Line Tools
- CocoaPods
- Ruby and Bundler
- An iOS simulator or provisioned device

Use the official React Native environment setup for your operating system:

<https://reactnative.dev/docs/set-up-your-environment>

## Installation

Clone the repository and install JavaScript dependencies:

```bash
git clone https://github.com/LovejeetSinghCyberbells/Ridhi-Ratnam-Associates.git
cd Ridhi-Ratnam-Associates
npm install
```

For a clean installation from the committed lock file:

```bash
npm ci
```

### iOS dependencies

Install Ruby gems and CocoaPods dependencies from the repository root:

```bash
bundle install
cd ios
bundle exec pod install
cd ..
```

## Running the App

Start Metro in a terminal:

```bash
npm start
```

To start Metro without reusing its cached state:

```bash
npm start -- --reset-cache
```

### Run on Android

With an emulator running or device connected:

```bash
npm run android
```

Alternatively, open `android/` in Android Studio, wait for Gradle synchronization, and run the `app` configuration.

### Run on iOS

Install CocoaPods first, then run:

```bash
npm run ios
```

To open the native workspace in Xcode:

```bash
open ios/RidhiRatnamAssociates.xcworkspace
```

Run the `RidhiRatnamAssociates` scheme on a simulator or device.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Metro bundler |
| `npm run android` | Build and launch the Android app |
| `npm run ios` | Build and launch the iOS app |
| `npm test` | Run the Jest suite without file watching |
| `npm run lint` | Run ESLint across the project |

Useful targeted test commands:

```bash
npm test -- --runInBand
npm test -- __tests__/AuthFlow.test.tsx
npm test -- __tests__/ClientDashboard.test.tsx
npm test -- __tests__/AgentDashboard.test.tsx
```

## Project Structure

```text
.
├── App.tsx                     # Root provider composition
├── index.js                    # React Native application entry
├── app.json                    # App display name and package identity
├── package.json                # npm scripts and dependencies
├── jest.config.js              # Jest configuration
├── metro.config.js             # Metro bundler configuration
├── babel.config.js             # Babel configuration
├── tsconfig.json               # TypeScript configuration
├── assets/
│   └── images/
│       └── logo.png            # Application logo
├── src/
│   ├── components/             # Reusable UI and dashboard components
│   │   ├── client/             # Client cards, forms, and navigation
│   │   └── dashboard/          # Agent dashboard components
│   ├── constants/              # Shared app configuration and lists
│   ├── navigation/
│   │   └── Navigator.tsx       # Screen state and back navigation
│   ├── screens/                # Authentication and application screens
│   ├── services/               # Mock API and in-memory repositories
│   ├── theme/                  # Theme provider and design colors
│   └── types/                  # Shared TypeScript domain models
├── __tests__/                  # Jest UI and navigation tests
├── android/                    # Native Android project
└── ios/                        # Native iOS project
```

## Architecture

The app uses a lightweight custom screen-state navigator rather than React Navigation. `AppNavigator` owns the active screen, role, selected application, detail viewer role, and screen history.

```text
App
├── SafeAreaProvider
├── ThemeProvider
├── ThemeDialogProvider
└── AppNavigator
    ├── Splash
    ├── Authentication
    ├── Forgot Password
    ├── Agent Dashboard
    ├── Client Dashboard
    ├── Application Detail
    ├── Notifications
    ├── Profile
    ├── Support
    ├── Notification Settings
    ├── Privacy Policy
    └── Terms and Conditions
```

The service modules return domain objects and promises so components can later be connected to REST, GraphQL, or another backend with minimal structural changes. The currently implemented state lives in JavaScript memory.

## Data and Mock Services

| Service | Responsibility |
| --- | --- |
| `kycService.ts` | Demo accounts, KYC repository, authentication, submission, approval, rejection, and history |
| `clientService.ts` | Client profile, statistics, applications, and status data |
| `dashboardService.ts` | Agent profile, dashboard statistics, applications, documents, performance, and notifications |

Current mock behavior includes:

- In-memory registration and login accounts
- In-memory KYC submission storage
- Document upload metadata without real file transfer
- Approval and rejection history updates
- Resubmission behavior
- Simulated asynchronous service responses
- Static sample applications and deep-analysis reports

Important: restarting the app, reloading Metro, or remounting the JavaScript runtime resets in-memory data. No real database, authentication provider, cloud storage, email service, SMS provider, or signing service is currently connected.

## Testing

Run the complete suite:

```bash
npm test
```

The existing suite covers authentication, agent and client dashboards, application details, notifications, profile, support, policy, terms, navigation back handling, theme dialog behavior, and accessibility-oriented rendering.

Run tests from the first test failure is recommended during debugging:

```bash
npm test -- --runInBand
```

ESLint can be run with:

```bash
npm run lint
```

## Android Build

The native Android project is located in `android/`.

Run a debug build:

```bash
cd android
./gradlew assembleDebug
```

The generated APK is normally written under:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

To run unit or connected Android tests available in the native project:

```bash
cd android
./gradlew test
```

## iOS Build

The native project and workspace are located in `ios/`.

After dependencies are installed:

```bash
cd ios
bundle exec pod install
open RidhiRatnamAssociates.xcworkspace
```

Build and archive the app from the `RidhiRatnamAssociates` scheme in Xcode. Configure the signing team, bundle identifier, provisioning profile, and release certificates in the target settings before distributing the app.

## Troubleshooting

### Metro cache issues

```bash
npm start -- --reset-cache
```

### Node modules or native dependency mismatch

```bash
rm -rf node_modules
npm ci
npm start -- --reset-cache
```

### Android build or Gradle issue

```bash
cd android
./gradlew clean
cd ..
npm run android
```

### CocoaPods issue

```bash
cd ios
bundle exec pod install --repo-update
cd ..
npm run ios
```

### Port already in use

Stop the existing Metro process, then restart Metro. On macOS and Linux, the active Metro port can be inspected with:

```bash
lsof -nP -iTCP:8081 -sTCP:LISTEN
```

Terminate only the process you identify as the old Metro instance.

### Android device not found

Confirm that USB debugging is enabled and check:

```bash
adb devices
```

Start an emulator from Android Studio or launch an existing AVD.

### iOS simulator not found or stale

Confirm that Xcode simulators are installed:

```bash
xcrun simctl list devices
```

Then run `npm run ios` again or select a simulator from Xcode.

## Known Limitations

- Authentication is simulated and not production-secured.
- No real backend, API endpoint, or database is configured.
- Client registration only exists for the running JavaScript session.
- Uploaded files use metadata and filenames; real file storage is not implemented.
- Approval and rejection actions mutate an in-memory store only.
- Government identifiers shown in mock data must never be treated as live personal data.
- No real payments, credit bureau, OTP, e-signature, or disbursement integration is included.
- Notification delivery is local mock content rather than push notification infrastructure.
- KYC approval logic is a demonstration and is not suitable for regulatory or financial decisions without formal validation and backend controls.

## Configuration Reference

The shared app configuration is defined in `src/constants/app.ts`:

```text
APP_CONFIG.NAME               Application name
APP_CONFIG.TAGLINE            Brand tagline
APP_CONFIG.SUPPORT_PHONE      Support phone number
APP_CONFIG.SUPPORT_EMAIL      Client support email
APP_CONFIG.AGENT_SUPPORT_EMAIL Agent support email
APP_CONFIG.OFFICIAL_WEBSITE   Public website
APP_CONFIG.DEFAULT_BRANCH     Default customer branch
APP_CONFIG.CURRENCY_SYMBOL    Currency symbol
APP_CONFIG.DEFAULT_INTEREST_RATE Default displayed rate
```

App display configuration is defined in `app.json`. Native package and application identifiers should be updated consistently in the Android and iOS projects before publishing.

## Contributing

1. Create a feature branch from the current default branch.
2. Follow the existing TypeScript, component, service, and StyleSheet conventions.
3. Keep mock data and domain types consistent across services and screens.
4. Add or update focused Jest tests for behavior changes.
5. Run:

   ```bash
   npm run lint
   npm test -- --runInBand
   ```

6. Review the native Android and iOS behavior for changes that affect navigation, safe areas, permissions, or device APIs.
7. Open a pull request with a clear summary and testing evidence.

## License

No license file is currently included in this repository. All rights and distribution terms should be confirmed with the project owner before publishing or redistributing the application.
