import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly googleLoginButton: Locator;
  readonly showPasswordToggle: Locator;
  readonly forgotPasswordButton: Locator;
  readonly signUpButton: Locator;
  readonly instructorLink: Locator;

  // Validation & Error message locators
  readonly emptyEmailError: Locator;
  readonly emptyPasswordError: Locator;
  readonly invalidEmailError: Locator;
  readonly invalidCredentialsError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]:has-text("Log in as a Student")').first();
    this.googleLoginButton = page.locator('button:has-text("Log in as a Student with Google")').first();
    this.showPasswordToggle = page.locator('button:has-text("Show"), button:has-text("Hide")').first();
    this.forgotPasswordButton = page.locator('button:has-text("Forgot password?")');
    this.signUpButton = page.locator('button:has-text("Sign up")');
    this.instructorLink = page.locator('a:has-text("click here")');

    this.emptyEmailError = page.locator('text=Please enter your email address.');
    this.emptyPasswordError = page.locator('text=Please enter your password.');
    this.invalidEmailError = page.locator('text=Please enter a valid email address.');
    this.invalidCredentialsError = page.locator('text=Invalid email or password. Please try again!');
  }

  /**
   * Navigate to the MathGPT login page
   */
  async navigate(): Promise<void> {
    await this.page.goto('/login');
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.emailInput).toBeVisible({ timeout: 15000 });
  }

  /**
   * Perform login action with given email and password
   */
  async login(email?: string, password?: string): Promise<void> {
    if (email !== undefined) {
      await this.emailInput.fill(email);
    }
    if (password !== undefined) {
      await this.passwordInput.fill(password);
    }
    await this.loginButton.click();
  }

  /**
   * Toggle password visibility between Show and Hide
   */
  async togglePasswordVisibility(): Promise<void> {
    await this.showPasswordToggle.click();
  }

  /**
   * Click instructor login switch link
   */
  async switchToInstructorLogin(): Promise<void> {
    await this.instructorLink.click();
  }
}
