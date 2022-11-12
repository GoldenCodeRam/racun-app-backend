import { UsersApiEndpoint } from "./api/usersApi.js";
import { ApiEndpoint } from "./apiEndpoint.js";

export const REGISTERED_APIS: ApiEndpoint[] = [new UsersApiEndpoint()];

export function configureApiModule(app: any) {
    for (const api of REGISTERED_APIS) {
        api.registerMethods(app);
    }
}
