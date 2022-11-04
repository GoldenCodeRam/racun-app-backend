import { Request, Response } from "express";

import { withPrismaClient } from "../../database/database.js";
import { DEFAULT_ROLES } from "../../model/role.js";
import { API_ROUTES } from "../apiRoutes.js";
import { authorize, authorizeOnRole } from "../auth.js";

export function createRolesApi(app: any) {
    app.post(
        API_ROUTES.roles,
        authorize,
        authorizeOnRole,
        async (request: Request, response: Response) => {
            withPrismaClient(async (prisma) => {
                const role = await prisma.role.create({
                    data: {
                        name: request.body.roleName,
                    },
                });

                // This right here might be problematic in the future, as we are
                // creating the role and generating all the relationships with
                // the APIs, so if we have many roles or many APIs, this can be
                // troublesome. For now this I think is the correct way, as we
                // can have a lot of control over the permissions, but we have
                // to see later.
                for (const api of await prisma.api.findMany()) {
                    await prisma.apisOnRoles.create({
                        data: {
                            apiId: api.id,
                            roleId: role.id,
                        },
                    });
                }

                response.sendStatus(200);
            });
        }
    );

    app.get(
        API_ROUTES.roles,
        authorize,
        authorizeOnRole,
        async (request: Request, response: Response) => {
            withPrismaClient(async (prisma) => {
                const roles = await prisma.role.findMany({
                    where: {
                        id: {
                            not: DEFAULT_ROLES.superAdmin.id,
                        },
                    },
                });
                response.send(roles);
            });
        }
    );
}
