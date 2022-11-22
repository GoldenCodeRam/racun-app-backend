import { ActionsApiEndpoint } from "./api/actionsApi";
import { ClientsApiEndpoint } from "./api/clientsApi";
import { ContractsApiEndpoint } from "./api/contractsApi";
import { HardwareApiEndpoint } from "./api/hardwareApi";
import { InvoicesApiEndpoint } from "./api/invoicesApi";
import { PermissionsApiEndpoint } from "./api/permissionsApi";
import { PlacesApiEndpoint } from "./api/placesApi";
import { RolesApiEndpoint } from "./api/rolesApi";
import { ServicesApiEndpoint } from "./api/servicesApi";
import { UsersApiEndpoint } from "./api/usersApi";
import { ZonesApiEndpoint } from "./api/zonesApi";
import { ApiEndpoint } from "./apiEndpoint";

export const REGISTERED_APIS: ApiEndpoint[] = [
    new ClientsApiEndpoint(),
    new HardwareApiEndpoint(),
    new PermissionsApiEndpoint(),
    new RolesApiEndpoint(),
    new UsersApiEndpoint(),
    new ZonesApiEndpoint(),
    new ActionsApiEndpoint(),
    new ServicesApiEndpoint(),
    new PlacesApiEndpoint(),
    new ContractsApiEndpoint(),
    new InvoicesApiEndpoint(),
];

export function configureApiModule(app: any) {
    for (const api of REGISTERED_APIS) {
        api.registerMethods(app);
    }
}
