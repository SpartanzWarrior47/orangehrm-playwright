import { test, expect } from '@playwright/test';
import { ApiHelper } from '../utils/apiHelper';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PIMPage } from '../pages/PIMPage';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { EmployeeDetailsPage } from '../pages/EmployeeDetailsPage';
import { EmployeeListPage } from '../pages/EmployeeListPage';
import employee from '../test-data/employee.json';


test('Verify OrangeHRM employee lifecycle', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const pimPage = new PIMPage(page);
    const addEmployeePage = new AddEmployeePage(page);
    const employeeDetailsPage = new EmployeeDetailsPage(page);
    const employeeListPage = new EmployeeListPage(page);
    const apiHelper = new ApiHelper(page.context().request);

    // Generate a unique Employee ID to avoid collisions across browser runs.
    const employeeId = `${employee.employeeId}${Date.now()
        .toString()
        .slice(-4)}`;
    await page.goto('/');

    await loginPage.login('Admin', 'admin123');

    await expect(dashboardPage.dashboardHeading).toBeVisible();
    await pimPage.navigateToPIM();
    await pimPage.navigateToAddEmployee();

    await expect(addEmployeePage.firstName).toBeVisible({
        timeout: 30000
    });
    //Add Employee
    await addEmployeePage.addEmployee(
        employee.firstName,
        employee.lastName,
        employeeId,
        employee.profilePicture
    );

    await expect(addEmployeePage.successMessage).toBeVisible({
        timeout: 30000
    });

    await expect(employeeDetailsPage.firstName).toBeVisible({
        timeout: 30000
    });
    //Verify Employee is created
    await expect(employeeDetailsPage.firstName).toHaveValue(employee.firstName);
    await expect(employeeDetailsPage.lastName).toHaveValue(employee.lastName);
    await expect(employeeDetailsPage.employeeId).toHaveValue(employeeId);
    // API validation confirms the employee was created in the backend.
    const response = await apiHelper.getEmployee(employeeId);
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.data).toHaveLength(1);
    expect(responseBody.data[0].employeeId).toBe(employeeId);
    expect(responseBody.data[0].firstName).toBe(employee.firstName);
    expect(responseBody.data[0].lastName).toBe(employee.lastName);



    // Now go back to Employee List
    await pimPage.navigateToEmployeeList();
    await expect(employeeListPage.employeeId).toBeVisible({
        timeout: 30000
    });

    //Search Employee using EmployeeId
    await employeeListPage.searchEmployee(employeeId);
    const employeeRow = employeeListPage.getEmployeeRow(employeeId);

    await expect(employeeRow).toBeVisible({
        timeout: 30000
    });
    //Verify Row Details
    await expect(employeeRow).toContainText(employeeId);
    await expect(employeeRow).toContainText(employee.firstName);
    await expect(employeeRow).toContainText(employee.lastName);
    const editButton = employeeListPage.getEditButton(employeeId);

    await editButton.click();
    await expect(employeeDetailsPage.firstName).toBeVisible({
        timeout: 30000
    });

    await employeeDetailsPage.navigateToJob();

    await expect(employeeDetailsPage.jobDetailsHeading).toBeVisible({
        timeout: 30000
    });

    await expect(employeeDetailsPage.jobTitle).toBeVisible({
        timeout: 30000
    });

    // Update Job Title and Employment Status fields
    await employeeDetailsPage.selectJobTitle(employee.jobTitle);

    await employeeDetailsPage.selectEmploymentStatus(employee.employmentStatus);

    await employeeDetailsPage.saveJobDetails();
    await expect(employeeDetailsPage.successMessage).toBeVisible({
        timeout: 60000
    });

    // Verify Updated fields 
    await expect(employeeDetailsPage.jobTitle).toContainText(
        employee.jobTitle,
        { timeout: 30000 }
    );

    await expect(employeeDetailsPage.employmentStatus).toContainText(
        employee.employmentStatus,
        { timeout: 30000 }
    );
    // API validation confirms the employee Job Title and Employee status was updated in the backend.
    const jobResponse = await apiHelper.getEmployee(employeeId);

    expect(jobResponse.status()).toBe(200);

    const jobResponseBody = await jobResponse.json();

    expect(jobResponseBody.data[0].jobTitle.title).toBe(employee.jobTitle);
    expect(jobResponseBody.data[0].empStatus.name).toBe(employee.employmentStatus);

    // Now go back to Employee List
    await pimPage.navigateToEmployeeList();
    await expect(employeeListPage.employeeId).toBeVisible({
        timeout: 30000
    });
    await employeeListPage.searchEmployee(employeeId);


    await expect(employeeRow).toBeVisible({
        timeout: 30000
    });
    // Delete Employee
    await employeeListPage.deleteEmployee(employeeId);
    await expect(employeeListPage.successMessage).toBeVisible({
        timeout: 30000
    });
    await expect(employeeListPage.employeeId).toBeVisible({
        timeout: 30000
    });
    await employeeListPage.searchEmployee(employeeId);
    //Verify Employee is deleted
    await expect(
        employeeListPage.getEmployeeRow(employeeId)
    ).not.toBeVisible({
        timeout: 30000
    });

    // API validation - employee should no longer exist
    const deleteResponse = await apiHelper.getEmployee(employeeId);

    expect(deleteResponse.status()).toBe(200);

    const deleteResponseBody = await deleteResponse.json();

    expect(deleteResponseBody.data).toHaveLength(0);

    await dashboardPage.logout();


    await expect(page).toHaveURL(/\/auth\/login/, {
        timeout: 30000
    });





    await expect(loginPage.username).toBeVisible({
        timeout: 30000
    });


    // Verify session is invalidated . Verify that a protected page redirects to login after logout.

    await page.goto(
        '/web/index.php/pim/viewEmployeeList', {
        waitUntil: 'domcontentloaded',
        timeout: 60000
    });

    //     await expect(page).toHaveURL(/\/auth\/login/, {
    //     timeout: 60000
    // });
    await expect(loginPage.username).toBeVisible({
        timeout: 60000
    });
});