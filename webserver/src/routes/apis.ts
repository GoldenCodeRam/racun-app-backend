import { RolesApiEndpoint } from "./api/rolesApi.js";
import { UsersApiEndpoint } from "./api/usersApi.js";
import { ApiEndpoint } from "./apiEndpoint.js";

export const REGISTERED_APIS: ApiEndpoint[] = [
    new UsersApiEndpoint(),
    new RolesApiEndpoint(),
];

export function configureApiModule(app: any) {
    for (const api of REGISTERED_APIS) {
        api.registerMethods(app);
    }
}
