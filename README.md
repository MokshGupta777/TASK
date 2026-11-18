# QA Automation Assessment - MathGPT.ai & Framework Design

[![Playwright Tests](https://github.com/actions/workflows/playwright.yml/badge.svg)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Test Runner](https://img.shields.io/badge/Runner-Playwright-green.svg)](https://playwright.dev/)

This repository contains the complete deliverables for the **QA Automation Assessment (Round 1)**:
- **Task 1:** Comprehensive Automation Framework Design Document
- **Task 2:** Test Strategy, 14 Formatted Test Cases & Automated Playwright Tests for [MathGPT.ai](https://app.mathgpt.ai/login)
- **Task 3:** Guide to Setting Up a Test Automation Environment from Scratch
- **Video Scripts:** Word-for-word scripts and presentation guide for video recording submission

---

## 📁 Repository Structure

```
.
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions CI/CD Pipeline
├── pages/
│   └── LoginPage.ts             # Page Object Model for MathGPT Login
├── tests/
│   └── login.spec.ts            # Automated Playwright Test Suite (3 Test Cases)
├── docs/
│   ├── TASK1_FRAMEWORK_DESIGN.md       # Framework design architecture & answers
│   ├── TASK2_TEST_DESIGN_AND_CASES.md  # Test strategy & 14 comprehensive test cases
│   ├── TASK3_ENVIRONMENT_SETUP.md     # Setting up automation from scratch
│   └── VIDEO_SPEAKING_SCRIPTS.md      # Video recording presentation scripts
├── .env.example                 # Environment variables template
├── package.json                 # Project scripts and dependencies
├── playwright.config.ts         # Central Playwright engine configuration
├── tsconfig.json                # TypeScript compiler configuration
└── README.md                    # Project documentation
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18 or higher (v20+ LTS recommended)
- **Git**

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd <REPO_NAME>
npm install
```

### 3. Install Playwright Browsers
Download the required browser binaries (Chromium):
```bash
npx playwright install chromium
```

### 4. Running the Automated Tests
Run tests in headless mode:
```bash
npm test
```

Run tests with browser UI visible (Headed mode):
```bash
npm run test:headed
```

Run tests using interactive Playwright UI mode:
```bash
npm run test:ui
```

### 5. Viewing Test Reports
Generate and open the detailed HTML report:
```bash
npm run test:report
```

---

## 🧪 Automated Test Cases (Task 2)

All automated tests target the live application at `https://app.mathgpt.ai/login` using the Page Object Model:

1. **TC_01: Blank Form Validation**
   - Submits login without entering email/password.
   - Asserts inline error messages: `"Please enter your email address."` and `"Please enter your password."`.
2. **TC_02: Malformed Email Validation**
   - Inputs invalid format email (`invalid-user-format`).
   - Asserts validation error: `"Please enter a valid email address."`.
3. **TC_03: Authentication Rejection & Password Visibility Toggle**
   - Enters password and toggles `"Show"` / `"Hide"` button, verifying input attribute switches between `type="password"` and `type="text"`.
   - Submits invalid credentials and verifies the rejection banner: `"Invalid email or password. Please try again!"`.

---

## 📑 Assessment Documentation Links
- [Task 1 - Automation Framework Design](docs/TASK1_FRAMEWORK_DESIGN.md)
- [Task 2 - Test Design & 14 Test Cases](docs/TASK2_TEST_DESIGN_AND_CASES.md)
- [Task 3 - Test Environment Setup](docs/TASK3_ENVIRONMENT_SETUP.md)
- [Video Presentation Scripts](docs/VIDEO_SPEAKING_SCRIPTS.md)
