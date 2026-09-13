import { expect, Locator, Page } from '@playwright/test';

export class AddEmployeePage {
    page: Page;
    firstName: Locator;
    lastName: Locator;
    employeeId: Locator;
    profilePicture: Locator;
    saveButton: Locator;
    successMessage: Locator;
    addEmployeeHeading: Locator;
    

    constructor(page: Page) {
        this.page = page;

        this.firstName = page.locator('input[name="firstName"]');
        this.lastName = page.locator('input[name="lastName"]');
        this.employeeId = page.locator(
            '//label[text()="Employee Id"]/parent::div/following-sibling::div//input'
        );
        this.profilePicture = page.locator('input[type="file"]');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.successMessage = page.getByText('Successfully Saved', { exact: true });
        this.addEmployeeHeading = page.getByRole('heading', { name: 'Add Employee' });
    
    }

    async uploadProfilePicture(filePath: string) {
        await this.profilePicture.setInputFiles(filePath);
    }

    async addEmployee(
        firstName: string,
        lastName: string,
        employeeId: string,
        filePath: string
    ) {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.employeeId.fill(employeeId);
        await this.uploadProfilePicture(filePath);

       

        await this.saveButton.click();
    }
}