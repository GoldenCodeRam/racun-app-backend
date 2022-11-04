import { createClientsApi } from "./api/clientsApi.js";
import { createHardwareApi } from "./api/hardwareApi.js";
import { createPermissionsApi } from "./api/permissionsApi.js";
import { createRolesApi } from "./api/rolesApi.js";
import { createUsersApi } from "./api/usersApi.js";
import { createZonesApi } from "./api/zonesApi.js";

export function configureApiModule(app: any) {
    createClientsApi(app);
    createRolesApi(app);
    createUsersApi(app);
    createPermissionsApi(app);
    createZonesApi(app);
    createHardwareApi(app);
}
