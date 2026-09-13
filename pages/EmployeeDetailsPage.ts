import { expect, Locator, Page } from '@playwright/test';

export class EmployeeDetailsPage {
    page: Page;
    firstName: Locator;
    lastName: Locator;
    employeeId: Locator;
    personalDetailsHeading: Locator;
    jobTitle: Locator;
    employmentStatus: Locator;
    jobDetailsHeading: Locator;
    jobTab: Locator;
    saveButton: Locator;
    successMessage: Locator;
    formLoader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.firstName = page.locator('input[name="firstName"]');
        this.lastName = page.locator('input[name="lastName"]');

        this.employeeId = page.locator(
            '//label[text()="Employee Id"]/parent::div/following-sibling::div//input'
        );
        this.personalDetailsHeading = page.getByRole('heading', {
            name: 'Personal Details'
        });
        this.jobTab = page.getByRole('link', { name: 'Job', exact: true });
        this.jobDetailsHeading = page.getByRole('heading', { name: 'Job Details' });
        this.jobTitle = page
            .locator('.oxd-input-group')
            .filter({ hasText: 'Job Title' })
            .locator('.oxd-select-text');

        this.employmentStatus = page.locator('.oxd-input-group')
            .filter({ hasText: 'Employment Status' }).locator('.oxd-select-text');

            this.saveButton = page.getByRole('button', { name: 'Save' });
            this.successMessage = page.getByText('Successfully Updated', { exact: true });
            this.formLoader = page.locator('.oxd-form-loader');
    }
    async navigateToJob() {
        await this.jobTab.click();
    }

    async selectJobTitle(jobTitle: string) {
  
         await expect(this.formLoader).not.toBeVisible({
        timeout: 30000
    });

        await this.jobTitle.click();

        await this.page.getByText(jobTitle, { exact: true }).click();
    }

    async selectEmploymentStatus(employmentStatus: string) {

         await expect(this.formLoader).not.toBeVisible({
        timeout: 30000
    });

        await this.employmentStatus.click();

        await this.page.getByText(employmentStatus, { exact: true }).click();
    }

    async saveJobDetails() {
    await this.saveButton.click();
}
}