import { Request, Response } from "express";
import { logMotion } from "../../audit/audit.js";

import { withPrismaClient } from "../../database/database.js";
import { DEFAULT_ROLES } from "../../model/role.js";
import { API_ROUTES } from "../apiRoutes.js";
import { authorize, authorizeOnRole } from "../auth.js";

export function createRolesApi(app: any) {
    app.post(
        API_ROUTES.createRole,
        authorize,
        authorizeOnRole,
        logMotion,
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

    app.post(
        API_ROUTES.roles,
        authorize,
        authorizeOnRole,
        async (request: Request, response: Response) => {
            withPrismaClient(async (prisma) => {
                const query = request.body;
                const whereQuery = {
                    OR: [
                        {
                            name: {
                                contains: query.userSearch,
                            },
                        },
                    ],
                };

                let roles;
                let roleCount;

                // TODO: We should move this logic elsewhere.
                // This is not too good as we are mixing API functions and search
                // in the database. But for now is good.
                if (query.userSearch?.length > 0) {
                    roleCount = await prisma.role.count({
                        where: whereQuery,
                    });
                    roles = await prisma.role.findMany({
                        where: whereQuery,
                        skip: query.skip,
                        take: query.take,
                    });
                } else {
                    roleCount = await prisma.role.count();
                    roles = await prisma.role.findMany({
                        skip: query.skip,
                        take: query.take,
                    });
                }

                response.send({
                    search: roles,
                    searchCount: roleCount,
                });
            });
        }
    );

    app.get(
        API_ROUTES.getRole,
        authorize,
        authorizeOnRole,
        async (request: Request, response: Response) => {
            withPrismaClient(async (prisma) => {
                const roleId = request.params["roleId"];
                const role = await prisma.role.findUnique({
                    where: {
                        id: parseInt(roleId),
                    },
                });
                response.send(role);
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
