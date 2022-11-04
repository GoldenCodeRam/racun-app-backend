import { Request, Response } from "express";

import { withPrismaClient } from "../../database/database.js";
import { API_ROUTES } from "../apiRoutes.js";
import { authorize, authorizeOnRole } from "../auth.js";

export function createHardwareApi(app: any) {
    app.get(
        API_ROUTES.getHardware,
        authorize,
        authorizeOnRole,
        async (request: Request, response: Response) => {
            withPrismaClient(async (prisma) => {
                const hardwareId = request.params["hardwareId"];
                const hardware = await prisma.hardware.findUnique({
                    where: {
                        id: parseInt(hardwareId),
                    },
                });
                response.send(hardware);
            });
        }
    );

    app.post(
        API_ROUTES.hardware,
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

                let hardware;
                let hardwareCount;

                // TODO: We should move this logic elsewhere.
                // This is not too good as we are mixing API functions and search
                // in the database. But for now is good.
                if (query.userSearch?.length > 0) {
                    hardwareCount = await prisma.hardware.count({
                        where: whereQuery,
                    });
                    hardware = await prisma.hardware.findMany({
                        where: whereQuery,
                        skip: query.skip,
                        take: query.take,
                    });
                } else {
                    hardwareCount = await prisma.zone.count();
                    hardware = await prisma.hardware.findMany({
                        skip: query.skip,
                        take: query.take,
                    });
                }

                response.send({
                    search: hardware,
                    searchCount: hardwareCount,
                });
            });
        }
    );
}
