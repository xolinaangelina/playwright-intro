const { test, expect } = require('@playwright/test');
const { RegistrationPage } = require('../pages/RegistrationPage');
 
// Helper: generate a unique email with the required "aqa" prefix
function generateEmail() {
  return `aqa-${Date.now()}@test.com`;
}
 
const validPassword = 'Password1';
 
test.describe('Registration form', () => {
  let registrationPage;
 
  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.open();
  });
 
  test('positive: successful registration with valid data', async ({ page }) => {
    const email = generateEmail();
 
    await registrationPage.register({
      name: 'Angelina',
      lastName: 'Staran',
      email,
      password: validPassword,
      repeatPassword: validPassword,
    });
 
    // After successful registration the modal should close
    // and a "Sign In" / logged-in state should appear, or a success modal.
    await expect(registrationPage.registerButton).not.toBeVisible({ timeout: 10000 });
  });
 
  test('negative: empty Name field shows "Name is required"', async ({ page }) => {
    await registrationPage.fillForm({
      name: '',
      lastName: 'Staran',
      email: generateEmail(),
      password: validPassword,
      repeatPassword: validPassword,
    });
    await registrationPage.nameInput.click();
    await registrationPage.lastNameInput.click(); // blur Name field
 
    await expect(page.getByText('Name required')).toBeVisible();
    await expect(registrationPage.registerButton).toBeDisabled();
  });
 
  test('negative: Name field with invalid characters/digits shows "Name is invalid"', async ({ page }) => {
    await registrationPage.fillForm({
      name: 'Angel1na123',
      lastName: 'Staran',
      email: generateEmail(),
      password: validPassword,
      repeatPassword: validPassword,
    });
    await registrationPage.lastNameInput.click(); // blur Name field
 
    await expect(page.getByText(/Name is invalid/i)).toBeVisible();
    await expect(registrationPage.registerButton).toBeDisabled();
  });
 
  test('negative: Name field shorter than 2 characters shows length error', async ({ page }) => {
    await registrationPage.fillForm({
      name: 'A',
      lastName: 'Staran',
      email: generateEmail(),
      password: validPassword,
      repeatPassword: validPassword,
    });
    await registrationPage.lastNameInput.click(); // blur Name field
 
    await expect(page.getByText(/Name has to be from 2 to 20 characters long/i)).toBeVisible();
    await expect(registrationPage.registerButton).toBeDisabled();
  });
 
  test('negative: invalid email format shows "Email is incorrect"', async ({ page }) => {
    await registrationPage.fillForm({
      name: 'Angelina',
      lastName: 'Staran',
      email: 'aqa-invalid-email',
      password: validPassword,
      repeatPassword: validPassword,
    });
    await registrationPage.passwordInput.click(); // blur Email field
 
    await expect(page.getByText(/Email is incorrect/i)).toBeVisible();
    await expect(registrationPage.registerButton).toBeDisabled();
  });
 
  test('negative: password shorter than 8 characters shows password rule error', async ({ page }) => {
    await registrationPage.fillForm({
      name: 'Angelina',
      lastName: 'Staran',
      email: generateEmail(),
      password: 'Pass1',
      repeatPassword: 'Pass1',
    });
    await registrationPage.repeatPasswordInput.click(); // blur Password field
 
    await expect(
      page.getByText(/Password has to be from 8 to 15 characters long/i)
    ).toBeVisible();
    await expect(registrationPage.registerButton).toBeDisabled();
  });
 
  test('negative: passwords do not match shows "Passwords do not match"', async ({ page }) => {
    await registrationPage.fillForm({
      name: 'Angelina',
      lastName: 'Staran',
      email: generateEmail(),
      password: validPassword,
      repeatPassword: 'DifferentPass1',
    });
    await registrationPage.repeatPasswordInput.click(); // blur Re-enter password field
    await registrationPage.nameInput.click();
 
    await expect(page.getByText(/Passwords do not match/i)).toBeVisible();
    await expect(registrationPage.registerButton).toBeDisabled();
  });
 
  test('negative: Register button is disabled when all fields are empty', async ({ page }) => {
    await expect(registrationPage.registerButton).toBeDisabled();
  });
});