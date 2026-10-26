import { expect, Locator, Page } from '@playwright/test';

export class PIMPage {
    page: Page;
    pimMenu: Locator;
    addEmployee: Locator;
    employeeList: Locator;
    employeeInformationHeading: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pimMenu = page.getByRole('link', {
            name: /^(PIM|个人信息管理系统)$/
        });
        this.addEmployee = page.getByRole('link', {
            name: /^(Add Employee|添加员工)$/
        });
        this.employeeList = page.getByRole('link', {
            name: /^(Employee List|员工列表)$/
        });
        this.employeeInformationHeading = page.getByRole('heading', {
            name: 'Employee Information'
        });
    }


    async navigateToPIM() {
        await this.pimMenu.click();
        await expect(this.addEmployee).toBeVisible({
            timeout: 30000
        });
    }

    async navigateToAddEmployee() {
        await this.addEmployee.click();
    }

    async navigateToEmployeeList() {
        await this.navigateToPIM();
        await this.employeeList.click();
        await expect(this.page).toHaveURL(/\/pim\/viewEmployeeList/);
    }
}