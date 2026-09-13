import { Locator, Page } from '@playwright/test';
export class LoginPage {
page:Page;
username:Locator;
password:Locator;
loginButton: Locator;
constructor(page: Page) {
this.page=page; 
this.username = page.getByPlaceholder('Username');
this.password = page.locator('input[name="password"]');
this.loginButton = page.locator('button[type="submit"]');
}
async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
}
}