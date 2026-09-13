import { APIRequestContext } from '@playwright/test';
export class ApiHelper {
    request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async getEmployee(employeeId: string) {
    return await this.request.get(
        `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&employeeId=${employeeId}`
    );
}
}