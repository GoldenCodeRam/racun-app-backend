import { Request, Response } from "express";

import { withPrismaClient } from "../../database/database.js";
import { API_ROUTES } from "../apiRoutes.js";
import { authorize, authorizeOnRole } from "../auth.js";

export function createClientsApi(app: any) {
    app.get(
        API_ROUTES.clients.clients,
        authorize,
        authorizeOnRole,
        async (request: Request, response: Response) => {
            withPrismaClient(async (prisma) => {
                response.send(await prisma.client.findMany());
            });
        }
    );

    app.get(
        API_ROUTES.clients.count,
        authorize,
        authorizeOnRole,
        async (request: Request, response: Response) => {
            withPrismaClient(async (prisma) => {
                response.send(await prisma.client.count());
            });
        }
    );

    app.get(
        API_ROUTES.clients.getClient,
        authorize,
        authorizeOnRole,
        async (request: Request, response: Response) => {
            withPrismaClient(async (prisma) => {
                const clientId = request.params["clientId"];
                const client = await prisma.client.findUnique({
                    where: {
                        id: parseInt(clientId),
                    },
                });
                response.send(client);
            });
        }
    );

    /**
     * Get clients with a search and pagination.
     */
    app.post(
        API_ROUTES.clients.clients,
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
                            document: {
                                contains: query.userSearch,
                            },
                        },
                    ],
                };

                let clients;
                let clientCount;

                // TODO: Refactor this method as is the same from the usersApi.

                // TODO: We should move this logic elsewhere.
                // This is not too good as we are mixing API functions and search
                // in the database. But for now is good.
                if (query.userSearch?.length > 0) {
                    clientCount = await prisma.client.count({
                        where: whereQuery,
                    });
                    clients = await prisma.client.findMany({
                        where: whereQuery,
                        skip: query.skip,
                        take: query.take,
                    });
                } else {
                    clientCount = await prisma.client.count();
                    clients = await prisma.client.findMany({
                        skip: query.skip,
                        take: query.take,
                    });
                }

                response.send({
                    search: clients,
                    searchCount: clientCount,
                });
            });
        }
    );
}
