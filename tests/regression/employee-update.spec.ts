import { test, expect } from '../../fixtures/employee.fixture';

import { PIMPage } from '../../pages/PIMPage';
import { EmployeeDetailsPage } from '../../pages/EmployeeDetailsPage';
import { EmployeeListPage } from '../../pages/EmployeeListPage';

import employeeData from '../../test-data/employee.json';

test('Update employee job details @regression', async ({ page, employee }) => {

    const pimPage = new PIMPage(page);
    const employeeDetailsPage = new EmployeeDetailsPage(page);
    const employeeListPage = new EmployeeListPage(page);

    // Navigate to Employee List
    await pimPage.navigateToPIM();
    await pimPage.navigateToEmployeeList();

    await expect(employeeListPage.employeeId).toBeVisible({
        timeout: 30000
    });

    // Search for the employee created by the fixture
    await employeeListPage.searchEmployee(employee.employeeId);

    const employeeRow =
        employeeListPage.getEmployeeRow(employee.employeeId);

    await expect(employeeRow).toBeVisible({
        timeout: 30000
    });

    // Open employee details
    const editButton =
        employeeListPage.getEditButton(employee.employeeId);

    await editButton.click();

    await expect(employeeDetailsPage.firstName).toBeVisible({
        timeout: 30000
    });

    // Navigate to Job tab
    await employeeDetailsPage.navigateToJob();

    await expect(employeeDetailsPage.jobDetailsHeading).toBeVisible({
        timeout: 30000
    });

    // Update Job Title and Employment Status
    await employeeDetailsPage.selectJobTitle(
        employeeData.jobTitle
    );

    await employeeDetailsPage.selectEmploymentStatus(
        employeeData.employmentStatus
    );

    await employeeDetailsPage.saveJobDetails();

    // Verify UI update
    await expect(employeeDetailsPage.successMessage).toBeVisible({
        timeout: 30000
    });

    await expect(employeeDetailsPage.jobTitle).toContainText(
        employeeData.jobTitle,
        { timeout: 30000 }
    );

    await expect(employeeDetailsPage.employmentStatus).toContainText(
        employeeData.employmentStatus,
        { timeout: 30000 }
    );
});