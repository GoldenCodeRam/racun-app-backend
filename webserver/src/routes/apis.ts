import { ActionsApiEndpoint } from "./api/actionsApi.js";
import { ClientsApiEndpoint } from "./api/clientsApi.js";
import { HardwareApiEndpoint } from "./api/hardwareApi.js";
import { PermissionsApiEndpoint } from "./api/permissionsApi.js";
import { RolesApiEndpoint } from "./api/rolesApi.js";
import { UsersApiEndpoint } from "./api/usersApi.js";
import { ZonesApiEndpoint } from "./api/zonesApi.js";
import { ApiEndpoint } from "./apiEndpoint.js";

export const REGISTERED_APIS: ApiEndpoint[] = [
    new ClientsApiEndpoint(),
    new HardwareApiEndpoint(),
    new PermissionsApiEndpoint(),
    new RolesApiEndpoint(),
    new UsersApiEndpoint(),
    new ZonesApiEndpoint(),
    new ActionsApiEndpoint(),
];

export function configureApiModule(app: any) {
    for (const api of REGISTERED_APIS) {
        api.registerMethods(app);
    }
}
