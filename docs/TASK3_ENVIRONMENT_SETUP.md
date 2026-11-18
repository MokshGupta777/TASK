# Task 3: Test Automation Environment Setup From Scratch

## Overview & Experience Summary
Setting up a robust, scalable test automation framework from scratch involves careful selection of tools, directory architecture, runtime isolation, dependency management, and CI/CD integration. 

Here is the exact step-by-step blueprint used to build this enterprise-grade Playwright + TypeScript framework from ground zero.

---

## 1. Toolchain & Tech Stack Selection

| Component | Selected Technology | Purpose & Rationale |
| :--- | :--- | :--- |
| **Runtime** | Node.js (v20+ LTS) | Stable, cross-platform engine with native ESM/CJS support. |
| **Test Runner & Engine** | Playwright (`@playwright/test`) | Built-in auto-waiting, multi-tab/multi-window handling, API request mocking, trace recordings. |
| **Language** | TypeScript (`typescript`) | Strict typing, auto-complete, catching locator and object errors at compile time. |
| **Configuration** | `dotenv` | Seamless switching between environments (`.env.local`, `.env.staging`, `.env.prod`). |
| **Reporting** | Playwright HTML + Trace Viewer | Deep visual inspection, DOM timeline, network logs, and failure screenshots. |
| **CI/CD** | GitHub Actions Workflow | Automated execution on every Pull Request and nightly regressions. |

---

## 2. Step-by-Step Setup Process

### Step 1: Initialize Project & Dependency Management
```bash
# Initialize Node.js package
npm init -y

# Install core test runner and TypeScript dependencies
npm install -D @playwright/test typescript @types/node dotenv

# Install browser binaries (Chromium, Firefox, WebKit)
npx playwright install chromium
```

### Step 2: Configure TypeScript (`tsconfig.json`)
Set up strict typing, module resolution, and path aliases for clean imports:
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node", "@playwright/test"]
  },
  "include": ["**/*.ts"]
}
```

### Step 3: Implement Centralized Playwright Configuration (`playwright.config.ts`)
- Configured dynamic base URLs via environment variables (`process.env.BASE_URL`).
- Enabled parallel execution (`fullyParallel: true`).
- Configured failure artifacts: automatic screenshots on failure (`screenshot: 'only-on-failure'`), video retention (`video: 'retain-on-failure'`), and traces (`trace: 'on-first-retry'`).
- Multi-browser cross-platform matrix configuration (Chrome, Firefox, Safari).

### Step 4: Page Object Model (POM) Design Architecture
Created a modular directory structure ensuring strict separation of concerns:
```
├── pages/
│   └── LoginPage.ts       # Encapsulates selectors, locators, and UI interactions
├── tests/
│   └── login.spec.ts      # Pure test specifications, user journeys, assertions
├── docs/                  # Architecture and technical documentation
├── playwright.config.ts   # Core engine settings
└── package.json           # Scripts & dependencies
```

### Step 5: Environment & Secret Management
Created `.env.example` template to prevent sensitive credentials and API keys from leaking into version control while allowing team members and CI runners to inject them securely.

---

## 3. Continuous Integration & Pipeline Automation (GitHub Actions)

Created `.github/workflows/playwright.yml` to automate execution:
```yaml
name: Playwright Regression Tests

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    timeout-minutes: 30
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 20
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps chromium
    - name: Run Playwright tests
      run: npm test
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 14
```

---

## 4. Key Implementation Decisions & Best Practices

1. **Auto-Waiting over Arbitrary Sleeps:**
   - Strict ban on hardcoded `sleep` or `page.waitForTimeout()` in production tests. Playwright's locator assertions auto-poll until conditions are met.
2. **Resilient Selectors:**
   - Prioritized user-facing semantic locators (`getByRole`, `has-text`, attribute names) rather than fragile auto-generated dynamic CSS classes.
3. **Artifact Isolation on Failure:**
   - Videos and trace files are only retained when a test fails, optimizing disk space and CI execution speed.
