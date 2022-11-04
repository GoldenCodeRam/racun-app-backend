import { PrismaClient } from "@prisma/client";
import { ApiSeeder } from "./apiSeeder.js";
import { APIsOnRolesSeeder } from "./apisOnRolesSeeder.js";
import { CitySeeder } from "./citySeeder.js";
import { ClientSeeder } from "./clientSeeder.js";
import { HardwareSeeder } from "./hardwareSeeder.js";
import { PlaceSeeder } from "./placeSeeder.js";
import { RoleSeeder } from "./roleSeeder.js";
import { UserSeeder } from "./userSeeder.js";
import { ZoneSeeder } from "./zoneSeeder.js";

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
        new ApiSeeder(),
        new APIsOnRolesSeeder(new RoleSeeder()),
        new ZoneSeeder(new PlaceSeeder()),
    ];

    public async runAllSeeders() {
        for (const seeder of this.seeders) {
            await seeder.seed(this.prisma);
        }
    }
}
