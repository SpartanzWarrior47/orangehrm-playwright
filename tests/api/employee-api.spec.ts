import { test, expect } from '@playwright/test';
import { EmployeeApi } from '../../api/EmployeeApi';

test('Create and delete employee through API without profile picture', async ({ page }) => {
    const employeeApi = new EmployeeApi(page.context().request);

    const employeeId = `API${Date.now().toString().slice(-6)}`;

    // Create employee
    const createResponse = await employeeApi.createEmployee({
        firstName: 'Api',
        lastName: 'Test',
        employeeId
    });

    // console.log('Status:', createResponse.status());
    // console.log('Response:', await createResponse.json());

    expect(createResponse.status()).toBe(200);
    const createResponseBody = await createResponse.json();
    const empNumber = createResponseBody.data.empNumber;
    expect(createResponseBody.data.employeeId).toBe(employeeId);

    // Delete employee
    const deleteResponse = await employeeApi.deleteEmployee(empNumber);

    expect(deleteResponse.status()).toBe(200);

    // Verify deletion
    const getResponse = await employeeApi.getEmployee(employeeId);

    expect(getResponse.status()).toBe(200);

    const getResponseBody = await getResponse.json();

    expect(getResponseBody.data).toHaveLength(0);
});