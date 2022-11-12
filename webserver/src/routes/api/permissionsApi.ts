import { Request, Response } from "express";

import { withPrismaClient } from "../../database/database.js";
import { API_ROUTES } from "../apiRoutes.js";
import { authorize, authorizeOnRole } from "../auth.js";

export function createPermissionsApi(app: any) {
    app.get(
        `${API_ROUTES.permissions.permissionsRoleId}`,
        authorize,
        authorizeOnRole,
        async (request: Request, response: Response) => {
            withPrismaClient(async (prisma) => {
                const apisOnRoles = await prisma.apisOnRoles.findMany({
                    where: {
                        roleId: parseInt(request.params.roleId),
                    },
                    include: {
                        api: true,
                    },
                });
                response.send(apisOnRoles);
            });
        }
    );
}
