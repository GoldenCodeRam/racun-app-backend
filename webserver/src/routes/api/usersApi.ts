import { Request, Response } from "express";

import { withPrismaClient } from "../../database/database.js";
import { API_ROUTES } from "../apiRoutes.js";
import { authorize, authorizeOnRole } from "../auth.js";

export function createUsersApi(app: any) {
    app.get(
        API_ROUTES.currentUser,
        authorize,
        authorizeOnRole,
        async (request: Request, response: Response) => {
            response.send(request.user);
        }
    );

    app.get(
        API_ROUTES.getUser,
        authorize,
        authorizeOnRole,
        async (request: Request, response: Response) => {
            withPrismaClient(async (prisma) => {
                const userId = request.params["userId"];
                const user = await prisma.user.findUnique({
                    where: {
                        id: parseInt(userId),
                    },
                    include: {
                        role: true,
                    },
                });
                response.send(user);
            });
        }
    );

    app.post(
        API_ROUTES.users,
        authorize,
        authorizeOnRole,
        async (request: Request, response: Response) => {
            withPrismaClient(async (prisma) => {
                const query = request.body;
                const whereQuery = {
                    OR: [
                        {
                            firstName: {
                                contains: query.userSearch,
                            },
                        },
                        {
                            lastName: {
                                contains: query.userSearch,
                            },
                        },
                        {
                            email: {
                                contains: query.userSearch,
                            },
                        },
                    ],
                };

                let users;
                let userCount;

                // TODO: We should move this logic elsewhere.
                // This is not too good as we are mixing API functions and search
                // in the database. But for now is good.
                if (query.userSearch?.length > 0) {
                    userCount = await prisma.user.count({
                        where: whereQuery,
                    });
                    users = await prisma.user.findMany({
                        where: whereQuery,
                        include: {
                            role: true,
                        },
                        skip: query.skip,
                        take: query.take,
                    });
                } else {
                    userCount = await prisma.user.count();
                    users = await prisma.user.findMany({
                        include: {
                            role: true,
                        },
                        skip: query.skip,
                        take: query.take,
                    });
                }

                response.send({
                    search: users,
                    searchCount: userCount,
                });
            });
        }
    );
}
