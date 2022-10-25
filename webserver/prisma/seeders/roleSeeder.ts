import { PrismaClient } from "@prisma/client";
import { DEFAULT_ROLES } from "../../src/model/role.js";
import { DefaultSeeder } from "./seeder.js";

export class RoleSeeder implements DefaultSeeder {
    async seed(prisma: PrismaClient) {
        for (const role of Object.values(DEFAULT_ROLES)) {
            await prisma.role.upsert({
                where: { id: role.id },
                update: {},
                create: {
                    id: role.id,
                    name: role.name,
                },
            });
        }
    }
}
