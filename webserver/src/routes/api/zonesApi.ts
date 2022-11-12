import { Request, Response } from "express";

import { withPrismaClient } from "../../database/database.js";
import { API_ROUTES } from "../apiRoutes.js";
import { authorize, authorizeOnRole } from "../auth.js";

export function createZonesApi(app: any) {
    app.get(
        API_ROUTES.zones.getZone,
        authorize,
        authorizeOnRole,
        async (request: Request, response: Response) => {
            withPrismaClient(async (prisma) => {
                const zoneId = request.params["zoneId"];
                const zone = await prisma.zone.findUnique({
                    where: {
                        id: parseInt(zoneId),
                    },
                });
                response.send(zone);
            });
        }
    );

    app.post(
        API_ROUTES.zones.zones,
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
                        {
                            code: {
                                contains: query.userSearch,
                            },
                        },
                    ],
                };

                let zones;
                let zoneCount;

                // TODO: We should move this logic elsewhere.
                // This is not too good as we are mixing API functions and search
                // in the database. But for now is good.
                if (query.userSearch?.length > 0) {
                    zoneCount = await prisma.zone.count({
                        where: whereQuery,
                    });
                    zones = await prisma.zone.findMany({
                        where: whereQuery,
                        skip: query.skip,
                        take: query.take,
                    });
                } else {
                    zoneCount = await prisma.zone.count();
                    zones = await prisma.zone.findMany({
                        skip: query.skip,
                        take: query.take,
                    });
                }

                response.send({
                    search: zones,
                    searchCount: zoneCount,
                });
            });
        }
    );
}
