import { PrismaClient } from "@prisma/client";
import { DefaultSeeder } from "./seeder";

import { REGISTERED_APIS } from "../../src/routes/apis";

export class ApiSeeder implements DefaultSeeder {
    async seed(prisma: PrismaClient) {
        for (const api of REGISTERED_APIS) {
            await prisma.api.create({
                data: {
                    name: api.name,
                },
            });
        }
    }
}
