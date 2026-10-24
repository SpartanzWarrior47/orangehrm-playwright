import { test, expect } from '../../fixtures/employee.fixture';

import { PIMPage } from '../../pages/PIMPage';
import { EmployeeListPage } from '../../pages/EmployeeListPage';

test('Delete employee @regression', async ({ page, employee }) => {

    const pimPage = new PIMPage(page);
    const employeeListPage = new EmployeeListPage(page);
    await pimPage.navigateToPIM();
    await pimPage.navigateToEmployeeList();

    await expect(employeeListPage.employeeId).toBeVisible({
        timeout: 30000
    });

    await employeeListPage.searchEmployee(employee.employeeId);

    const employeeRow =
        employeeListPage.getEmployeeRow(employee.employeeId);

    await expect(employeeRow).toBeVisible({
        timeout: 30000
    });

    await employeeListPage.deleteEmployee(employee.employeeId);

    await expect(employeeListPage.successMessage).toBeVisible({
        timeout: 30000
    });

    await employeeListPage.searchEmployee(employee.employeeId);

    await expect(
        employeeListPage.getEmployeeRow(employee.employeeId)
    ).not.toBeVisible({
        timeout: 30000
    });
});