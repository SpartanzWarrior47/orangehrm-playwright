import { Locator, Page } from '@playwright/test';

export class EmployeeListPage {
    page: Page;
    employeeId: Locator;
    searchButton: Locator;
    confirmDeleteButton: Locator;
    successMessage: Locator;
    employeeListHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        this.employeeId = page.locator(
            '//label[text()="Employee Id"]/parent::div/following-sibling::div//input'
        );
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.confirmDeleteButton = page.getByRole('button', {
    name: 'Yes, Delete'
});
this.successMessage = page.getByText('Successfully Deleted', { exact: true });
this.employeeListHeading = page.getByRole('heading', {
    name: 'Employee Information'
});
      
    }
    async searchEmployee(employeeId: string) {
    await this.employeeId.fill(employeeId);
    await this.searchButton.click();
}
 getEmployeeRow(employeeId: string) {
    return this.page.getByRole('row').filter({
        hasText: employeeId
    });
}
getEditButton(employeeId: string) {
    return this.getEmployeeRow(employeeId).locator('button').first();
}

async deleteEmployee(employeeId: string) {
    const employeeRow = this.getEmployeeRow(employeeId);

    await employeeRow.locator('button').filter({
        has: this.page.locator('.bi-trash')
    }).click();
      await this.confirmDeleteButton.click();
}
}