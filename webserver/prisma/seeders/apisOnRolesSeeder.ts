import { PrismaClient } from "@prisma/client";

import { DEFAULT_ROLES } from "../../src/model/role";
import { RoleSeeder } from "./roleSeeder";
import { DefaultSeeder } from "./seeder";

export class APIsOnRolesSeeder implements DefaultSeeder {
    constructor(private roleSeeder: RoleSeeder) {}

    async seed(prisma: PrismaClient) {
        // If the roles are not created yet.
        this.roleSeeder.seed(prisma);

        for (const api of await prisma.api.findMany()) {
            await prisma.apisOnRoles.create({
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
