import { test, expect } from '@playwright/test';
import { EmployeeApi } from '../../api/EmployeeApi';

test('Create and delete employee through API without profile picture', async ({ page }) => {
    const employeeApi = new EmployeeApi(page.context().request);

    const employeeId = `API${Date.now().toString().slice(-6)}`;
    let ownedEmpNumber: number | undefined;
    let primaryFailure: unknown;
    let testFailed = false;

    try {

        // Create employee
        const createResponse = await employeeApi.createEmployee({
            firstName: 'Api',
            lastName: 'Test',
            employeeId
        });

        let createResponseBody: any;
        if (createResponse.ok()) {
            createResponseBody = await createResponse.json();
            const createdData = createResponseBody?.data;
            if (
                createdData?.employeeId === employeeId &&
                Number.isSafeInteger(createdData.empNumber) &&
                createdData.empNumber > 0
            ) {
                ownedEmpNumber = createdData.empNumber;
            }
        }

        // console.log('Status:', createResponse.status());
        // console.log('Response:', await createResponse.json());

        expect(createResponse.status()).toBe(200);
        createResponseBody ??= await createResponse.json();
        const empNumber = createResponseBody.data.empNumber;
        expect(createResponseBody.data.employeeId).toBe(employeeId);
        expect(ownedEmpNumber).toBeDefined();

        // Delete employee
        const deleteResponse = await employeeApi.deleteEmployee(empNumber);

        expect(deleteResponse.status()).toBe(200);

        // Verify deletion
        const getResponse = await employeeApi.getEmployee(employeeId);

        expect(getResponse.status()).toBe(200);

        const getResponseBody = await getResponse.json();

        expect(getResponseBody.data).toHaveLength(0);
    } catch (error) {
        primaryFailure = error;
        testFailed = true;
        throw error;
    } finally {
        if (ownedEmpNumber !== undefined) {
            try {
                await employeeApi.cleanupEmployee(employeeId, ownedEmpNumber);
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
});
