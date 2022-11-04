import { createClientsApi } from "./api/clientsApi.js";
import { createPermissionsApi } from "./api/permissionsApi.js";
import { createRolesApi } from "./api/rolesApi.js";
import { createUsersApi } from "./api/usersApi.js";

export function configureApiModule(app: any) {
    createClientsApi(app);
    createRolesApi(app);
    createUsersApi(app);
    createPermissionsApi(app);
}
