export type Route = {
    url: string;
};

export enum Method {
    GET,
    POST,
    DELETE,
}

export function getMethodFromString(str: string): Method {
    const sanitizedString = str.toLowerCase();
    switch (sanitizedString) {
        case "get":
            return Method.GET;
        case "post":
            return Method.POST;
        case "delete":
            return Method.DELETE;
        default:
            throw new Error("Method not defined!");
    }
}

export const API_ROUTES = {
    clients: "/api/clients",
    getClient: "/api/clients/:clientId",

    roles: "/api/roles",
    createRole: "/api/roles/create",

    zones: "/api/zones",
    getZone: "/api/zones/:zoneId",

    permissions: "/api/permissions",
    permissionsRoleId: "/api/permissions/:roleId",

    hardware: "/api/hardware",
    getHardware: "/api/hardware/:hardwareId",

    users: "/api/users",
    getUser: "/api/users/:userId",

    // This one is used to get the information of the current logged user.
    currentUser: "/api/current-user",
};
