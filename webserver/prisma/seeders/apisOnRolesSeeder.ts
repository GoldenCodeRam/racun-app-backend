import { PrismaClient, Prisma } from "@prisma/client";

import { DEFAULT_ROLES } from "../../src/model/role.js";
import { RoleSeeder } from "./roleSeeder.js";
import { DefaultSeeder } from "./seeder.js";

export class APIsOnRolesSeeder implements DefaultSeeder {
    constructor(private roleSeeder: RoleSeeder) {}

    async seed(prisma: PrismaClient) {
        // If the roles are not created yet.
        this.roleSeeder.seed(prisma);

        for (const api of await prisma.aPI.findMany()) {
            await prisma.aPIsOnRoles.create({
                data: {
                    apiId: api.id,
                    roleId: DEFAULT_ROLES.superAdmin.id,
                    get: true,
                    post: true,
                    delete: true,
                },
            });
        }
    }
}
