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

}