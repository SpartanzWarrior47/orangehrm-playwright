import { randomUUID } from 'node:crypto';
import { test as base, expect } from '@playwright/test';
import { EmployeeApi } from '../api/EmployeeApi';
import employeeData from '../test-data/employee.json';

type Employee = {
    employeeId: string;
    empNumber: number;
    firstName: string;
    lastName: string;
};

type EmployeeFixtures = {
    employee: Employee;
};

//employee = fixture
export const test = base.extend<EmployeeFixtures>({
    employee: async ({ page }, use) => {



        const employeeApi = new EmployeeApi(page.context().request);
        const employeeId =
            `${employeeData.employeeId}${randomUUID().slice(0, 6)}`;

        const createResponse = await employeeApi.createEmployee({
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            employeeId
        });

        if (createResponse.status() !== 200) {
            console.log('Employee ID:', employeeId);
            console.log('Create status:', createResponse.status());
            console.log('Create response:', await createResponse.text());
        }

        expect(createResponse.status()).toBe(200);
        const responseBody = await createResponse.json();

        expect(responseBody.data.employeeId).toBe(employeeId);


        // --------------------
        // Prepare Employee Data from response
        // --------------------

        const createdEmployee: Employee = {
            employeeId: responseBody.data.employeeId,
            empNumber: responseBody.data.empNumber,
            firstName: responseBody.data.firstName,
            lastName: responseBody.data.lastName
        };

        // --------------------
        // Give the employee information to the test
        // Test runs here
        // --------------------
        await page.goto('/');
        await use(createdEmployee);

        // --------------------
        // Teardown / Cleanup
        // --------------------

        const response = await employeeApi.getEmployee(
            createdEmployee.employeeId
        );

        if (response.ok()) {
            const responseBody = await response.json();

            if (responseBody.data?.length > 0) {
                await employeeApi.deleteEmployee(
                    createdEmployee.empNumber
                );
            }
        }
    }
});

export { expect } from '@playwright/test';