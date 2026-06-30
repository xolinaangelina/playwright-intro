class RegistrationPage {
  constructor(page) {
    this.page = page;
 
    this.signUpButton = page.locator('button:has-text("Sign up")');
    this.registrationLink = page.locator('a:has-text("Registration")');
 
    this.nameInput = page.locator('#signupName');
    this.lastNameInput = page.locator('#signupLastName');
    this.emailInput = page.locator('#signupEmail');
    this.passwordInput = page.locator('#signupPassword');
    this.repeatPasswordInput = page.locator('#signupRepeatPassword');
    this.registerButton = page.locator('button.btn-primary:has-text("Register")');
 
    this.nameError = page.locator('app-signup-form').getByText(/Name/).locator('xpath=following-sibling::div');
  }
 
 async open() {
  await this.page.goto('/');
  await this.signUpButton.click();
  await this.nameInput.waitFor({ state: 'visible' });
}
 
  async fillForm({ name, lastName, email, password, repeatPassword }) {
    if (name !== undefined) await this.nameInput.fill(name);
    if (lastName !== undefined) await this.lastNameInput.fill(lastName);
    if (email !== undefined) await this.emailInput.fill(email);
    if (password !== undefined) await this.passwordInput.fill(password);
    if (repeatPassword !== undefined) await this.repeatPasswordInput.fill(repeatPassword);
  }
 
  async submit() {
    await this.registerButton.click();
  }
 
  async register(userData) {
    await this.fillForm(userData);
    await this.submit();
  }
 
  fieldError(labelText) {
    return this.page
      .locator('div.form-group', { has: this.page.locator(`label:has-text("${labelText}")`) })
      .locator('div.invalid-feedback, .text-danger, small, div')
      .last();
  }
}
 
module.exports = { RegistrationPage };