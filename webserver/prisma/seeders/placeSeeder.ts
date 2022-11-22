
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

import { DefaultSeeder } from "./seeder";

const RANDOM_PLACE_AMOUNT = 30;

export class PlaceSeeder implements DefaultSeeder {
    async seed(prisma: PrismaClient) {
        // Create up to RANDOM_HARDWARE_AMOUNT hardware.
        for (let i = 0; i < RANDOM_PLACE_AMOUNT; i++) {
            await prisma.place.create({
                data: {
                    name: faker.address.cityName(),
                },
            });
        }
    }
}
