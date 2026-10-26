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
        let ownedEmployee: Employee | undefined;
        let primaryFailure: unknown;
        let testFailed = false;

        try {
            const createResponse = await employeeApi.createEmployee({
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                employeeId
            });

            let responseBody: any;
            if (createResponse.ok()) {
                responseBody = await createResponse.json();
                const data = responseBody?.data;
                if (
                    data?.employeeId === employeeId &&
                    Number.isSafeInteger(data.empNumber) &&
                    data.empNumber > 0
                ) {
                    ownedEmployee = {
                        employeeId,
                        empNumber: data.empNumber,
                        firstName: data.firstName,
                        lastName: data.lastName
                    };
                }
            }

            if (createResponse.status() !== 200) {
                console.log('Employee ID:', employeeId);
                console.log('Create status:', createResponse.status());
                console.log('Create response:', await createResponse.text());
            }

            expect(createResponse.status()).toBe(200);
            responseBody ??= await createResponse.json();
            expect(responseBody.data.employeeId).toBe(employeeId);
            expect(ownedEmployee).toBeDefined();

            await page.goto('/');
            await use(ownedEmployee!);
        } catch (error) {
            primaryFailure = error;
            testFailed = true;
            throw error;
        } finally {
            if (ownedEmployee) {
                try {
                    await employeeApi.cleanupEmployee(
                        ownedEmployee.employeeId,
                        ownedEmployee.empNumber
                    );
                } catch (cleanupError) {
                    if (testFailed) {
                        throw new AggregateError(
                            [primaryFailure, cleanupError],
                            'Test and employee cleanup both failed'
                        );
                    }
                    throw cleanupError;
                }
            }
        }
    }
});

export { expect } from '@playwright/test';
