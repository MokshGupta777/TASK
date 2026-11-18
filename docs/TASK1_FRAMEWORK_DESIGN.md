# Task 1: Automation Framework Design

## Scenario Overview
A high-growth e-commerce/web application featuring:
- User Authentication (Login / SSO / MFA)
- Product Search & Catalog Browsing
- Shopping Cart & Checkout Funnel
- Secure Payment Processing (Stripe / PayPal / 3DS)

Target Growth: High scalability required over the next 12+ months (expanding test volume, multiple geographical locales, API + UI coverage, and CI/CD pipelines).

---

## 1. Programming Language & Automation Tools Choice

### Tool Selection: Playwright with TypeScript
- **Why Playwright?**
  - **Auto-Waiting & Resilience:** Eliminates flaky tests by natively waiting for actionability (visible, enabled, stable) before executing clicks/inputs.
  - **Multi-Browser & Cross-Platform:** Single API controls Chromium, Firefox, WebKit (Safari), and mobile emulations natively without WebDriver discrepancies.
  - **Execution Speed & Parallelism:** Operates via WebSocket DevTools protocol directly with the browser engine, offering 3x faster execution compared to legacy Selenium.
  - **Built-in Network Interception & API Testing:** Direct API mocking and request routing allows testing edge scenarios (e.g., payment gateway failure, network timeouts) without hitting real banking APIs.
  - **Browser Contexts:** Isolated, lightweight browser contexts enable instant stateless tests without spinning up heavy separate browser processes.

- **Why TypeScript?**
  - **Compile-time Type Safety:** Catch selector typos, undefined fixtures, and payload errors before test execution.
  - **Refactoring Agility:** As the application evolves rapidly over the year, changing page models or locator contracts propagates type warnings across all test specs instantly.
  - **Enhanced IDE Auto-completion:** Speeds up authoring for the entire QA team.

---

## 2. Design Pattern: Page Object Model (POM) + Component Architecture

To prevent code duplication and locator maintenance nightmares as the app scales, we implement a hybrid **Page Object Model (POM) with Component Object Pattern**:

```
src/
├── pages/
│   ├── BasePage.ts            # Common actions (navigation, alert waits, toasts)
│   ├── LoginPage.ts           # Login inputs, submit, validation messages
│   ├── ProductCatalogPage.ts  # Search filters, sorting, product card lists
│   ├── CartPage.ts            # Item quantity, voucher codes, subtotal
│   └── CheckoutPage.ts        # Shipping address, payment integration
├── components/
│   ├── HeaderComponent.ts     # Global search bar, cart badge, profile dropdown
│   ├── PaymentModal.ts        # Payment iframe / credit card input component
│   └── NotificationToast.ts   # Error & success alerts
```

### Architectural Benefits:
- **Separation of Concerns:** Test scripts (`*.spec.ts`) only define business user flows and assertions; locators and UI interactions are encapsulated in Page Objects.
- **Single Point of Modification:** If a checkout locator changes, updating it in `CheckoutPage.ts` fixes all 50+ checkout-related tests immediately.
- **DRY Components:** Global components like the search bar or shopping cart drawer are instantiated across multiple pages without redefining locators.

---

## 3. Test Data Management Strategy

As test volume grows, hardcoded static credentials cause race conditions in parallel test runs. We implement a **3-tier data management approach**:

1. **Static Test Data (`test-data/`):**
   - JSON/TypeScript files for deterministic boundary tests (e.g., invalid email formats, expired credit card numbers, edge-case postal codes).
2. **Dynamic / Synthetic Data Generation:**
   - Using libraries like `@faker-js/faker` to generate unique emails, names, and billing addresses on the fly for registration and checkout to avoid unique-constraint collisions.
3. **API-driven Data Seeding & Teardown (Fixtures):**
   - Before running checkout tests, use Playwright's `request` fixture to hit backend REST/GraphQL APIs (e.g., `POST /api/cart/seed`) to instantly generate a cart with items, rather than UI-clicking through catalog pages. This cuts test execution time by 80%.

---

## 4. Configuration & Multi-Environment Management

Centralized configuration driven by environment variables using `dotenv` and `playwright.config.ts`:

- **Environments Supported:** `local`, `dev`, `staging`, `prod`
- **Dynamic Configuration:**
  - `ENV=staging npx playwright test`
  - Loads `.env.staging` holding environment URLs, service endpoints, and mock credentials.
- **Config Matrix:**
  - Headless/Headed toggles, viewport dimensions, timeouts, base URLs, retry policies (e.g., 2 retries in CI, 0 retries locally), and trace attachments (`trace: 'on-first-retry'`).

---

## 5. Reporting, Logging, and Observability

1. **Rich HTML & Trace Reports:**
   - Playwright HTML Reporter provides step-by-step execution trees, DOM snapshots, and video recordings.
   - **Playwright Trace Viewer:** Inspect DOM states, network calls, and console logs at any millisecond of execution.
2. **Enterprise Allure Reports:**
   - Integrated `allure-playwright` plugin to generate historical pass/fail trends, severity breakdowns, and flaky test tracking over time.
3. **Structured Logging:**
   - Custom logger (Winston/Pino) configured to log page actions, network API latency, and authentication token lifecycles with correlation IDs.

---

## 6. Maintainability, Scalability & CI/CD Strategy

1. **Parallel Sharding:**
   - Run tests concurrently across browser contexts locally. In CI (GitHub Actions / GitLab CI), enable sharding (`--shard=1/4`, `--shard=2/4`) to distribute execution across 4 parallel runners, reducing suite runtime from 40 minutes to under 10 minutes.
2. **Test Independence (Atomic Tests):**
   - Every test is self-contained: it initializes its own state and cleans up after itself. No test relies on the output of a prior test.
3. **Mocking External Payment Gateways:**
   - Use Playwright route interception (`page.route('**/v1/charges', ...)`) to mock Stripe/PayPal webhooks and failure modes (e.g., card declined, 3DS authentication challenge, gateway timeout) safely without charging real or sandbox limits.
4. **Automated CI/CD Quality Gates:**
   - Trigger Smoke Suite on every Pull Request (blocking merge on failure).
   - Trigger Full Regression Suite on nightly builds and staging deployments.
