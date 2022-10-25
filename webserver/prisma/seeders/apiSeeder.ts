import { PrismaClient } from "@prisma/client";
import { DefaultSeeder } from "./seeder";
import { API_ROUTES } from "../../src/routes/apiRoutes.js";

export class APISeeder implements DefaultSeeder {
    async seed(prisma: PrismaClient) {
        for (const route of API_ROUTES) {
            await prisma.aPI.create({
                data: {
                    route: route,
                },
            });
        }
    }
}
