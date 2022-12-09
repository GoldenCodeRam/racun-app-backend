import { PrismaClient } from "@prisma/client";
import { ApiSeeder } from "./apiSeeder";
import { APIsOnRolesSeeder } from "./apisOnRolesSeeder";
import { ClientSeeder } from "./clientSeeder";
import { ConfigSeeder } from "./configSeeder";
import { HardwareSeeder } from "./hardwareSeeder";
import { RoleSeeder } from "./roleSeeder";
import { ServiceSeeder } from "./serviceSeeder";
import { UserSeeder } from "./userSeeder";

export interface DefaultSeeder {
    seed(prisma: PrismaClient): Promise<void>;
}

export class Seeder {
    constructor(private prisma: PrismaClient) {}

    // Here we add all the seeders we want to run.
    private seeders: DefaultSeeder[] = [
        new ClientSeeder(),
        new UserSeeder(new RoleSeeder()),
        new HardwareSeeder(),
        new ApiSeeder(),
        new APIsOnRolesSeeder(new RoleSeeder()),
        // This is not needed anymore, as we are loading the Places manually.
        // new ZoneSeeder(new PlaceSeeder()),
        new ServiceSeeder(),
        new ConfigSeeder(),
    ];

    public async runAllSeeders() {
        for (const seeder of this.seeders) {
            await seeder.seed(this.prisma);
        }
    }
}
