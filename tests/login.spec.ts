import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('MathGPT Login Page Test Suite', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('TC_01: Should display required validation messages when submitting empty form', async () => {
    // Attempt to submit login without entering email or password
    await loginPage.loginButton.click();

    // Verify both email and password validation messages are visible
    await expect(loginPage.emptyEmailError).toBeVisible({ timeout: 5000 });
    await expect(loginPage.emptyPasswordError).toBeVisible({ timeout: 5000 });
  });

  test('TC_02: Should display invalid email format validation message for malformed email', async () => {
    // Fill malformed email without valid domain syntax
    await loginPage.emailInput.fill('invalid-user-format');
    await loginPage.loginButton.click();

    // Verify inline email format error message
    await expect(loginPage.invalidEmailError).toBeVisible({ timeout: 5000 });
  });

  test('TC_03: Should display error message for non-existent credentials and verify password mask toggle', async () => {
    const dummyPassword = 'SecretPassword123!';

    // Verify password field is masked initially
    await loginPage.passwordInput.fill(dummyPassword);
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    // Toggle to reveal password
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');

    // Toggle back to mask password
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    // Submit with invalid non-existent account credentials
    await loginPage.emailInput.fill('qa_automation_candidate@invalidmail.com');
    await loginPage.loginButton.click();

    // Verify authentication rejection banner
    await expect(loginPage.invalidCredentialsError).toBeVisible({ timeout: 10000 });
  });
});
