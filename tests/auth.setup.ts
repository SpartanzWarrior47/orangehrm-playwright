import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

setup('authenticate', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await loginPage.login(
        process.env.ORANGEHRM_USERNAME!,
        process.env.ORANGEHRM_PASSWORD!
    );

    await expect(dashboardPage.dashboardHeading).toBeVisible();

    const browserName = testInfo.project.name.replace('setup-', '');

    const authFile = path.resolve(
        `playwright/.auth/${browserName}.json`
    );

    await page.context().storageState({
        path: authFile
    });
});