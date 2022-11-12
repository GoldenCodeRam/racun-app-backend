import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt";

import { DEFAULT_ROLES } from "../../src/model/role.js";
import { RoleSeeder } from "./roleSeeder.js";
import { DefaultSeeder } from "./seeder.js";

export class UserSeeder implements DefaultSeeder {
    constructor(private roleSeeder: RoleSeeder) {}

    async seed(prisma: PrismaClient) {
        // Seed the roles first, so the users can use them
        await this.roleSeeder.seed(prisma);

        await prisma.user.upsert({
            where: { email: "admin@admin.com" },
            update: {},
            create: {
                email: "admin@admin.com",
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                password: hashSync("admin", genSaltSync(10)),
                // This is the first role and the only one we have for now.
                roleId: DEFAULT_ROLES.superAdmin.id,
            },
        });
    }
}
