export const API_ROUTES = {
    clients: {
        clients: "/api/clients",
        getClient: "/api/clients/:clientId",
        count: "/api/clients/count",
    },
    roles: {
        roles: "/api/roles",
        createRole: "/api/roles/create",
        roleId: "/api/roles/:roleId",
        count: "/api/roles/count",
    },
    zones: {
        zones: "/api/zones",
        getZone: "/api/zones/:zoneId",
        count: "/api/zones/count",
    },
    permissions: {
        permissions: "/api/permissions",
        permissionsRoleId: "/api/permissions/:roleId",
    },
    hardware: {
        hardware: "/api/hardware",
        getHardware: "/api/hardware/:hardwareId",
        count: "/api/hardware/count",
    },
    users: {
        users: "/api/users",
        userId: "/api/users/:userId",
        count: "/api/users/count",
    },

    // This one is used to get the information of the current logged user.
    currentUser: "/api/currentUser",
};
