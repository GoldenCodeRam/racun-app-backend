import { PrismaClient } from "@prisma/client";
import { ApiSeeder } from "./apiSeeder";
import { APIsOnRolesSeeder } from "./apisOnRolesSeeder";
import { CitySeeder } from "./citySeeder";
import { ClientSeeder } from "./clientSeeder";
import { HardwareSeeder } from "./hardwareSeeder";
import { PlaceSeeder } from "./placeSeeder";
import { RoleSeeder } from "./roleSeeder";
import { ServiceSeeder } from "./serviceSeeder";
import { UserSeeder } from "./userSeeder";
import { ZoneSeeder } from "./zoneSeeder";

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
        new ServiceSeeder(),
    ];

    public async runAllSeeders() {
        for (const seeder of this.seeders) {
            await seeder.seed(this.prisma);
        }
    }
}
