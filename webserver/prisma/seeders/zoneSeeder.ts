import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { raw } from "@prisma/client/runtime/index.js";
import { PlaceSeeder } from "./placeSeeder.js";

import { DefaultSeeder } from "./seeder.js";

const RANDOM_ZONES_AMOUNT = 10;

export class ZoneSeeder implements DefaultSeeder {
    constructor(private placeSeeder: PlaceSeeder) {}

    async seed(prisma: PrismaClient) {
        // Seed the places first, so the zones can use them
        this.placeSeeder.seed(prisma);

        // Create up to RANDOM_HARDWARE_AMOUNT hardware.
        for (let i = 0; i < RANDOM_ZONES_AMOUNT; i++) {
            const randomPlaces = await prisma.place.findMany();
            const randomChoice = Math.floor(
                Math.random() * randomPlaces.length
            );

            await prisma.zone.create({
                data: {
                    placeId: randomPlaces[randomChoice].id,
                    name: faker.address.cityName(),
                    code: faker.address.stateAbbr(),
                },
            });
        }
    }
}
