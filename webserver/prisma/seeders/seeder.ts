import { PrismaClient } from "@prisma/client";
import { APISeeder } from "./apiSeeder.js";
import { APIsOnRolesSeeder } from "./apisOnRolesSeeder.js";
import { CitySeeder } from "./citySeeder.js";
import { ClientSeeder } from "./clientSeeder.js";
import { HardwareSeeder } from "./hardwareSeeder.js";
import { RoleSeeder } from "./roleSeeder.js";
import { UserSeeder } from "./userSeeder.js";

export interface DefaultSeeder {
    seed(prisma: PrismaClient): Promise<void>;
}

export class Seeder {
    constructor(private prisma: PrismaClient) {}

    // Here we add all the seeders we want to run.
    private seeders: DefaultSeeder[] = [
        new ClientSeeder(),
        new CitySeeder(),
        new UserSeeder(new RoleSeeder()),
        new HardwareSeeder(),
        new APISeeder(),
        new APIsOnRolesSeeder(new RoleSeeder()),
    ];

    public async runAllSeeders() {
        for (const seeder of this.seeders) {
            await seeder.seed(this.prisma);
        }
    }
}
