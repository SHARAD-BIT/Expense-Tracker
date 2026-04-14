# SpendWise — Agent Execution Guide

## Objective

Build a **frontend-only Expense Tracker mobile application** called **SpendWise** using **React Native + Expo + TypeScript**.

This document defines the complete execution plan from **Day 1 to Day 5** so any coding agent (Codex or similar) can work in a structured way without changing scope.

---

## Global Product Definition

### App Type

Frontend-only mobile app.

### Core Idea

A polished expense tracker app where users can:

* sign up / log in
* view a dashboard
* add, edit, delete transactions
* view analytics and budget insights
* interact with realistic UI states

### Important Scope Rule

This assignment is **frontend only**.

So:

* no real backend
* no real auth API
* no real cloud database
* no real payment integration
* no real OTP flow

Instead use:

* local mock data
* optional AsyncStorage/local persistence
* fake service layer
* simulated loading/errors

### Product Goal

The app should **feel like a complete real product** even though it is frontend-only.

---

## Core Stack

* React Native with Expo
* TypeScript
* React Navigation
* AsyncStorage
* React Hook Form
* Zod (optional but recommended)
* Functional components only

### Preferred Architecture

Use a scalable structure like:

```txt
src/
  assets/
  components/
    common/
    cards/
    forms/
    modals/
  screens/
    Splash/
    Onboarding/
    Auth/
    Dashboard/
    Transactions/
    Budget/
    Analytics/
    Profile/
  navigation/
  theme/
  constants/
  hooks/
  services/
  utils/
  types/
  data/
```

---

## Global UI Direction

The UI should feel:

* clean
* modern
* premium
* minimal but useful
* consistent in spacing and typography

### Recommended Design Language

* rounded cards
* soft shadows
* clear information hierarchy
* large dashboard summary cards
* bottom tab navigation
* good empty states
* clean input fields
* simple accent color

### Visual Consistency Rules

* one color system only
* one typography system only
* one spacing scale only
* avoid random sizes
* avoid inconsistent button styles

---

## Global Engineering Rules

### Must Follow

* Use TypeScript properly
* Write reusable components
* Keep logic separated from UI where possible
* Avoid hardcoding repeated values
* Keep imports clean
* Keep navigation predictable
* Use local mock/fake services instead of future backend assumptions

### Do Not Do

* do not add backend
* do not add unnecessary packages
* do not overengineer state management on Day 1
* do not create fake complexity
* do not use poor naming
* do not mix UI styles randomly
* do not leave broken placeholders

### State Strategy

Use simple local state first.
Only add lightweight structure where needed.
No need for Redux unless absolutely necessary.

---

# Delivery Plan by Day

---

# Day 1 — Foundation and Authentication Flow

## Main Goal

Set up the project foundation and create the complete entry flow:

* Splash
* Onboarding
* Login
* Signup
* Navigation structure

## Day 1 Tasks

### 1. Project setup

* initialize or clean Expo project
* configure TypeScript if needed
* set up folder structure
* add core dependencies
* create theme/constants files

### 2. Navigation setup

Create navigation flows for:

* Splash
* Onboarding
* Login
* Signup

#### Expected flow

* Splash opens first
* Splash auto navigates to Onboarding
* Onboarding can move next/skip
* Final onboarding CTA goes to Login
* Login links to Signup
* Signup links back to Login

### 3. Splash screen

Build a polished splash screen with:

* app logo or logo placeholder
* app name: SpendWise
* premium minimal layout
* timed navigation

### 4. Onboarding screens

Create 3 onboarding screens.

#### Slide 1

Track your daily expenses easily

#### Slide 2

Understand your spending with insights

#### Slide 3

Stay in control of your monthly budget

#### Include

* image/illustration placeholder area
* title
* subtitle
* pagination dots
* next button
* skip button
* get started on final slide

### 5. Login screen

Fields:

* email
* password

UI elements:

* heading
* subheading
* login button
* Google sign-in button UI only
* forgot password text UI only
* link to signup

Validation:

* required email
* valid email format
* required password

Submission action:

* no real auth
* just simulated loading then navigate to main app placeholder or log values

### 6. Signup screen

Fields:

* full name
* email
* password
* confirm password

Validation:

* all required
* valid email
* minimum password length
* password match check

UI elements:

* heading
* signup button
* Google signup button UI only
* link to login

## Day 1 Deliverables

* working navigation
* polished splash
* 3 onboarding slides
* login UI with validation
* signup UI with validation
* theme/constants setup
* reusable button/input components if possible

## Definition of Done

Day 1 is complete only if:

* app launches without crash
* all Day 1 screens are connected
* forms validate properly
* no dead navigation path exists
* UI already looks assignment-worthy

---

# Day 2 — Main App Shell and Dashboard

## Main Goal

Build the authenticated app shell and main usage experience.

## Day 2 Tasks

### 1. Main app navigation

Create post-auth navigation using bottom tabs.

#### Tabs suggested

* Home
* Transactions
* Add
* Analytics
* Profile

### 2. Dashboard screen

Create a strong first impression screen.

#### Include

* greeting/user header
* total balance card
* total income card
* total expenses card
* monthly summary section
* recent transactions preview
* category summary cards

### 3. Transaction list screen

Create a screen for all transactions.

#### Include

* search bar
* category filter UI
* transaction cards/list rows
* income vs expense visual distinction
* section title and counts

### 4. Transaction detail screen

When a transaction is tapped, show details.

#### Include

* title
* amount
* category
* date
* notes
* transaction type
* edit button
* delete button

### 5. Mock data layer

Create initial mock data files.

Examples:

* categories list
* transactions array
* user profile dummy data

## Day 2 Deliverables

* post-login app shell
* bottom tab navigation
* dashboard with summary cards
* transaction list screen
* transaction detail screen
* mock data wired into UI

## Definition of Done

Day 2 is complete only if:

* login flow can land in main app
* dashboard shows realistic data
* transactions render from local data
* tapping a transaction opens details
* navigation feels stable and clear

---

# Day 3 — CRUD Forms and Local Persistence

## Main Goal

Implement realistic create, edit, and delete flows for transactions.

## Day 3 Tasks

### 1. Add transaction screen

Create a complete form.

Fields:

* title
* amount
* category
* transaction type (income/expense)
* date
* notes

Validation:

* title required
* amount required and numeric
* category required
* type required
* date required

### 2. Edit transaction screen

* prefill form with selected transaction data
* allow updates
* save changes back to local state/storage

### 3. Delete transaction flow

* add confirmation modal
* confirm delete
* remove from list/detail/dashboard

### 4. Local persistence

Use AsyncStorage so transactions remain after app reload.

#### Persistence tasks

* save transactions
* load transactions at app start or screen mount
* handle empty initial state cleanly

### 5. Fake service layer

Create service files to keep future expansion clean.

Example:

* authService.ts
* transactionService.ts

Even though frontend-only, service functions should wrap local logic like:

* getTransactions
* addTransaction
* updateTransaction
* deleteTransaction

### 6. Loading/error simulations

Add realistic app behavior.

Examples:

* save button loading state
* fetch loading state
* optional simulated failure cases

## Day 3 Deliverables

* Add Transaction screen
* Edit Transaction screen
* Delete confirmation
* AsyncStorage integration
* local service layer
* loading states for submit/read actions

## Definition of Done

Day 3 is complete only if:

* transactions can be created
* transactions can be edited
* transactions can be deleted
* dashboard/list/detail update correctly
* data persists after app reload

---

# Day 4 — Budget, Analytics, Empty States, and UX Polish

## Main Goal

Make the product feel complete and intelligent.

## Day 4 Tasks

### 1. Budget screen

Create monthly budget tracking UI.

#### Include

* set monthly budget field or default mock budget
* total spent this month
* remaining balance
* progress bar
* budget status card

### 2. Analytics screen

Show spending insights.

#### Include

* category breakdown
* weekly or monthly spending summary
* highest expense category
* recent pattern/insight cards
* chart or chart-like UI

Real charts are optional if they slow development.
A polished visual summary is enough.

### 3. Profile/settings screen

Create a simple polished profile/settings screen.

#### Include

* user card
* email display
* app settings placeholders
* dark mode row UI only if needed
* logout button

### 4. Empty states

Create proper empty states for:

* no transactions
* no analytics data
* no recent activity
* no search results

### 5. Error states

Create polished error messages and fallback cards.

Examples:

* failed save
* failed data load simulation
* validation error

### 6. UX refinement

Improve:

* spacing
* button consistency
* form labels
* keyboard handling
* scroll behavior
* safe area layout
* icon usage

## Day 4 Deliverables

* budget screen
* analytics screen
* profile/settings screen
* empty states
* error states
* stronger UX polish

## Definition of Done

Day 4 is complete only if:

* app looks complete beyond CRUD
* there are no visually broken or empty awkward screens
* every main section feels product-ready
* user can understand value instantly from UI

---

# Day 5 — Final Polish, Testing, README, APK Prep

## Main Goal

Prepare the app for submission.

## Day 5 Tasks

### 1. Full app QA pass

Check:

* screen navigation
* input validation
* no broken button
* no dead links
* no layout break on smaller screens
* no obvious styling inconsistencies

### 2. UI polish pass

Fix:

* spacing issues
* alignment issues
* inconsistent icon/text size
* poor empty states
* rough shadows/colors
* weak CTA labels

### 3. Code cleanup

* remove dead code
* remove debug logs where unnecessary
* clean file names
* clean imports
* ensure no duplicate logic

### 4. README creation

Write a strong README with:

* project name
* app overview
* features
* tech stack
* setup instructions
* run instructions
* APK/build note
* note that submission is frontend-only as confirmed by HR

### 5. Submission assets

Prepare:

* GitHub-ready codebase
* proper folder naming
* screenshots if possible
* APK build process using Expo

### 6. Final validation checklist

* app opens correctly
* forms work
* CRUD works
* local persistence works
* dashboard updates properly
* analytics/budget are visible
* polished enough for review

## Day 5 Deliverables

* final cleaned app
* final README
* build-ready project
* GitHub-ready structure
* submission-ready state

## Definition of Done

Day 5 is complete only if:

* project is demoable end-to-end
* no major broken flow remains
* code is presentable for recruiter/interviewer review
* README clearly explains the app

---

# Detailed Feature Inventory

## Authentication Module

* Splash
* Onboarding
* Login
* Signup
* fake login transition

## Dashboard Module

* summary cards
* recent transactions
* quick insight widgets

## Transactions Module

* list all transactions
* detail screen
* add transaction
* edit transaction
* delete transaction
* search/filter

## Budget Module

* budget overview
* spent/remaining amount
* progress state

## Analytics Module

* category-based expense overview
* monthly or weekly summary
* insight cards

## Profile Module

* user info
* settings placeholders
* logout UI

---

# Suggested Data Model

## Transaction

```ts
{
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes?: string;
}
```

## User

```ts
{
  id: string;
  fullName: string;
  email: string;
}
```

## Budget

```ts
{
  monthlyBudget: number;
  month: string;
}
```

---

# Suggested Categories

Expense categories:

* Food
* Transport
* Shopping
* Bills
* Entertainment
* Health
* Travel
* Rent
* Other

Income categories:

* Salary
* Freelance
* Bonus
* Refund
* Other

---

# Reusable Components to Build

## High Priority

* AppButton
* AppInput
* ScreenWrapper
* SectionHeader
* TransactionCard
* SummaryCard
* EmptyState
* ConfirmationModal

## Medium Priority

* CategoryChip
* StatCard
* BudgetProgressCard
* SearchBar
* FilterRow

---

# Quality Bar

The app should look like:

* a real product demo
* not a tutorial app
* not a college rough prototype
* not a random collection of screens

It should feel coherent.

---

# What Will Impress Reviewers Most

* polished onboarding and auth UI
* professional dashboard
* smooth CRUD flow
* proper validation
* local persistence working
* strong visual consistency
* realistic empty/loading states
* clean project structure
* good README

---

# What Not to Waste Time On

* real backend setup
* advanced animations that block progress
* complex charts if basic summary UI works
* overcomplicated state libraries
* too many extra screens
* advanced auth flow beyond UI

---

# Submission Strategy

## Minimum strong submission

Must include:

* polished UI
* main flows complete
* CRUD complete
* local persistence
* README
* GitHub-ready code

## README note to include

Mention clearly:

> This submission is a frontend-only implementation, prepared according to HR confirmation. Backend/API functionality has been simulated using local mock data and local persistence.

---

# Agent Instruction Block

Any coding agent working on this project must follow these rules:

1. Stay within frontend-only scope
2. Do not add backend code
3. Prefer reusable components over repeated code
4. Prefer maintainability over flashy hacks
5. Keep UI polished and consistent
6. Complete one day’s scope cleanly before moving to the next
7. Do not break existing flows while adding new features
8. Use fake/local service abstractions where future backend would exist
9. Ensure forms, validation, and loading states are believable
10. Keep the project submission-ready at all times

---

# Final Execution Summary

## Day 1

Setup + Splash + Onboarding + Login/Signup

## Day 2

Dashboard + Main tabs + Transactions list + Transaction details

## Day 3

Add/Edit/Delete + AsyncStorage + service layer + loading states

## Day 4

Budget + Analytics + Profile + empty/error states + UX polish

## Day 5

Testing + cleanup + README + submission prep

---

# Final Note

Primary objective is not technical complexity.
Primary objective is to submit a **clean, polished, frontend-only mobile app** that looks complete, reliable, and professionally structured.
