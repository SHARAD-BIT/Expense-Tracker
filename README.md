# SpendWise

SpendWise is a frontend-only expense tracker mobile app built with Expo, React Native, and TypeScript. It is designed to feel like a polished product demo with realistic flows for onboarding, authentication, dashboard review, transaction CRUD, analytics, budget tracking, and profile settings.

> This submission is a frontend-only implementation, prepared according to HR confirmation. Backend/API functionality has been simulated using local mock data and local persistence.
>
> Google Sign-In in this project is real on the client side, but backend token verification and server-issued sessions are not implemented in this submission.

## Features

- Splash, onboarding, login, and signup flows
- Real client-side Google Sign-In for development builds / EAS builds
- Bottom-tab app shell with Home, Transactions, Add, Analytics, and Profile
- Dashboard with balance, income, expenses, monthly summary, and recent activity
- Transaction list with search and category filtering
- Transaction detail, add, edit, and delete flows
- Local persistence using AsyncStorage
- Budget overview with progress and remaining balance
- Analytics with category breakdown and insight cards
- Profile/settings UI with local logout flow
- Loading, empty, and error states for a more realistic product feel

## Tech Stack

- Expo
- React Native
- TypeScript
- React Navigation
- React Hook Form
- Zod
- AsyncStorage

## Project Structure

```txt
src/
  assets/
  components/
    cards/
    common/
    forms/
    modals/
  constants/
  data/
  hooks/
  navigation/
  screens/
  services/
  theme/
  types/
  utils/
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Android/iOS simulator or physical device
- Expo development build or EAS build for testing Google Sign-In

### Install

```bash
npm install
```

Copy the example environment file and fill in the Google / app identifiers:
Create a `.env` file based on `.env.example`, then fill in the Google / app identifiers.

## Run the App

For general UI work:

```bash
npm run start
```

For Google Sign-In testing, use a development build instead of Expo Go:

```bash
npm run start:dev-client
```

## Validation

Run the TypeScript check:

```bash
npm run typecheck
```

## Local Data Behavior

- Email/password authentication is simulated locally
- Google Sign-In is real on the client side in native development builds
- A local authenticated session is stored after successful sign-in
- Transactions are stored in AsyncStorage
- Dashboard, transactions, analytics, and budget views update from local state
- No backend, API, or cloud database is used

## APK / Build Note

This project is Expo-managed and includes `expo-dev-client` plus a basic `eas.json` for development and Android build readiness.

Development build example:

```bash
npx eas-cli build --profile development -p android
```

Example preview APK build:

```bash
npx eas-cli build -p android --profile preview
```

Example production Android App Bundle build:

```bash
npx eas-cli build -p android --profile production
```

EAS builds require an Expo account and the usual Android signing/setup on the Expo side.

## Submission Notes

- Frontend-only scope was intentionally preserved
- No backend verification or server-side session exchange was added
- The project is organized for clean handoff and GitHub review
- The UI and flows were optimized for recruiter/interviewer demo quality
- Google Sign-In requires native configuration values from `.env` and a development build / EAS build
