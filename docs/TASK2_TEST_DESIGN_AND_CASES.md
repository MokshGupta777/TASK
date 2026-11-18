# Task 2: Test Strategy & Comprehensive Test Cases for MathGPT.ai Login

**Target Under Test:** `https://app.mathgpt.ai/login`  
**Application Architecture:** Single Page Application (SPA / React) with role-based authentication (`Student` & `Instructor`), OAuth2 Google SSO, and client + server-side validation.

---

## 1. Test Structure & Organization

Our testing process is structured using a risk-based and layered test hierarchy:
```
           ┌─────────────────────────────┐
           │      Security & Session     │ (SQLi, XSS, Brute force, Token expiry)
           ├─────────────────────────────┤
           │   Integrations & OAuth2     │ (Google SSO, Role switching, Forgot PW)
           ├─────────────────────────────┤
           │  Functional / Auth Flows    │ (Valid creds, Invalid creds, Mask toggle)
           ├─────────────────────────────┤
           │  Client-side Validations    │ (Empty inputs, Malformed email formats)
           ├─────────────────────────────┤
           │   UI / UX & Accessibility   │ (Tab navigation, Focus states, Screen-readers)
           └─────────────────────────────┘
```

### Process Methodology:
1. **Requirements & UI Discovery:** Analyzed DOM attributes, input placeholders, button states, and backend network endpoints.
2. **Equivalence Partitioning & Boundary Value Analysis (EP/BVA):** Partitioned email and password inputs into valid formats, missing domains, whitespace padding, and empty strings.
3. **Negative & Abuse Case Modeling:** Modeled attack surfaces including SQL injection strings, rate limiting, and session hijacking.
4. **Automation Prioritization:** Selected high-impact, repeatable validation and core auth scenarios for the automated Playwright regression suite.

---

## 2. Comprehensive Test Cases Table

| TC ID | Test Scenario / Description | Category | Preconditions | Test Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_01** | Verify validation when submitting blank login fields | Validation | User on `/login` | 1. Leave Email blank.<br>2. Leave Password blank.<br>3. Click "Log in as a Student". | Error messages: `"Please enter your email address."` and `"Please enter your password."` appear. | High (Automated) |
| **TC_02** | Verify email field validation with invalid/malformed email format | Validation | User on `/login` | 1. Enter `testuser` or `test@` into Email.<br>2. Click "Log in as a Student". | Validation message `"Please enter a valid email address."` appears. | High (Automated) |
| **TC_03** | Verify authentication rejection with unregistered credentials and password mask toggle | Functional / Security | User on `/login` | 1. Enter valid format password.<br>2. Click "Show" / "Hide" button.<br>3. Enter un-registered email & password.<br>4. Submit form. | 1. Password input switches between `type="text"` and `type="password"`.<br>2. Alert banner `"Invalid email or password. Please try again!"` is displayed. | Critical (Automated) |
| **TC_04** | Verify successful student login with valid credentials | Functional (Positive) | Active registered student user exists | 1. Enter valid registered email.<br>2. Enter correct password.<br>3. Click "Log in as a Student". | User is authenticated and redirected to student dashboard (`/dashboard` or `/chat`). Session token stored in storage. | Critical |
| **TC_05** | Verify case-insensitivity of email address | Functional | Registered user `User@domain.com` | 1. Enter email in uppercase/lowercase.<br>2. Enter correct password.<br>3. Submit. | Login succeeds regardless of email letter casing. | Medium |
| **TC_06** | Verify password field trims/preserves leading and trailing spaces | Functional / Security | User on `/login` | 1. Enter password with spaces.<br>2. Observe whether spaces are hashed verbatim. | Password spaces should not be arbitrarily stripped without matching auth scheme. | Medium |
| **TC_07** | Verify "Forgot password?" modal/redirection flow | Functional | User on `/login` | 1. Click "Forgot password?" button.<br>2. Enter registered email.<br>3. Submit reset request. | Password reset modal opens; success confirmation `"Reset link sent"` displays. | High |
| **TC_08** | Verify Google SSO authentication ("Log in as a Student with Google") | Integration | Active Google Account | 1. Click "Log in as a Student with Google".<br>2. Select Google account in OAuth pop-up. | OAuth consent completes and redirects user into authenticated student session. | High |
| **TC_09** | Verify role switching link to Instructor Login | Functional / Navigation | User on `/login` | 1. Click link `"click here"` next to instructor prompt. | Browser navigates to `https://app.mathgpt.ai/login?role=educator`, page heading displays `"Educator log in"`. | Medium |
| **TC_10** | Verify navigation to Student Registration ("Sign up") | Navigation | User on `/login` | 1. Click `"Sign up"` button. | Page redirects to sign-up view (`/signup?role=selection`). | Medium |
| **TC_11** | Verify brute-force attack prevention / Rate Limiting | Security | User on `/login` | 1. Submit incorrect password 5+ times in rapid succession. | Account temporarily locked or CAPTCHA/rate-limiting message (`reached_rate_limit`) triggered. | High |
| **TC_12** | Verify SQL Injection & XSS payload resilience | Security | User on `/login` | 1. Enter `' OR '1'='1` in email.<br>2. Enter `<script>alert(1)</script>` in password.<br>3. Submit. | Sanitized cleanly; no database leakage or script execution. Generic auth error shown. | High |
| **TC_13** | Verify session persistence across page refreshes | Session | User logged in | 1. Authenticate successfully.<br>2. Refresh page or open in new tab. | User remains logged in without re-authenticating. | High |
| **TC_14** | Verify keyboard navigation & accessibility (a11y) | Accessibility | User on `/login` | 1. Use `Tab` key to traverse elements.<br>2. Press `Enter` on focused submit button. | Focus rings visible on active inputs; form submits on `Enter` key. | Medium |

---

## 3. Automated Test Scenarios (Playwright)

Out of the comprehensive test matrix, the following **3 key scenarios** have been fully automated using Page Object Model in TypeScript:
1. **TC_01 (Empty Form Validation):** Ensures form does not submit empty inputs and shows mandatory field errors.
2. **TC_02 (Email Format Validation):** Ensures client-side email format regex triggers without unwanted network roundtrips.
3. **TC_03 (Authentication Error & Password Mask Toggle):** Validates password visibility switching ("Show"/"Hide") and ensures backend returns appropriate error toast for invalid credentials.
