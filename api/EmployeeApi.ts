import { APIRequestContext } from '@playwright/test';

type CreateEmployeeData = {
    firstName: string;
    middleName?: string;
    lastName: string;
    employeeId: string;
};

export class EmployeeApi {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async getEmployee(employeeId: string) {
        return await this.request.get(
            '/web/index.php/api/v2/pim/employees',
            {
                params: {
                    limit: 50,
                    offset: 0,
                    model: 'detailed',
                    employeeId
                }
            }
        );
    }

    async createEmployee(employee: CreateEmployeeData) {
        return await this.request.post(
            '/web/index.php/api/v2/pim/employees',
            {
                data: {
                    firstName: employee.firstName,
                    middleName: employee.middleName ?? '',
                    lastName: employee.lastName,
                    employeeId: employee.employeeId
                }
            }
        );
    }

    async deleteEmployee(empNumber: number) {
        return await this.request.delete(
            '/web/index.php/api/v2/pim/employees',
            {
                data: {
                    ids: [empNumber]
                }
            }
        );
    }

    async cleanupEmployee(employeeId: string, empNumber: number) {
        const lookup = await this.getEmployee(employeeId);
        if (!lookup.ok()) {
            throw new Error(`Employee cleanup lookup failed: ${lookup.status()}`);
        }

        const lookupBody = await lookup.json();
        if (!Array.isArray(lookupBody.data)) {
            throw new Error('Employee cleanup lookup returned invalid data');
        }
        if (lookupBody.data.length === 0) {
            return;
        }
        if (lookupBody.data.length !== 1) {
            throw new Error('Employee cleanup lookup was not unique');
        }

        const employee = lookupBody.data[0];
        if (employee.employeeId !== employeeId || employee.empNumber !== empNumber) {
            throw new Error('Employee cleanup refused: ownership did not match');
        }

        const deleteResponse = await this.deleteEmployee(empNumber);
        if (!deleteResponse.ok()) {
            throw new Error(`Employee cleanup deletion failed: ${deleteResponse.status()}`);
        }

        const verification = await this.getEmployee(employeeId);
        if (!verification.ok()) {
            throw new Error(`Employee cleanup verification failed: ${verification.status()}`);
        }

        const verificationBody = await verification.json();
        if (!Array.isArray(verificationBody.data) || verificationBody.data.length !== 0) {
            throw new Error('Employee remains after cleanup');
        }
    }

}
