import { PrismaClient } from "@prisma/client";
import { DefaultSeeder } from "./seeder";
import { API_ROUTES, Method } from "../../src/routes/apiRoutes.js";

export class ApiSeeder implements DefaultSeeder {
    async seed(prisma: PrismaClient) {
        for (const apiRoute of Object.values(API_ROUTES)) {
            await prisma.api.create({
                data: {
                    route: apiRoute,
                },
            });
        }
    }
}
