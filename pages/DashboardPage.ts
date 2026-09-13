import { Locator, Page } from '@playwright/test';

export class DashboardPage {
    page: Page;
    dashboardHeading: Locator;
    userDropdown: Locator;
logoutLink: Locator;
 constructor (page: Page){
    this.page=page;
    this.dashboardHeading=page.getByRole('heading',{name:'Dashboard'});
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
this.logoutLink = page.getByRole('menuitem', { name: 'Logout' });
 }

 async logout() {
    await this.userDropdown.click();
    await this.logoutLink.click();
}

}