import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

import { DefaultSeeder } from "./seeder";

const RANDOM_HARDWARE_AMOUNT = 10;

export class HardwareSeeder implements DefaultSeeder {
    async seed(prisma: PrismaClient) {
        // Create up to RANDOM_HARDWARE_AMOUNT hardware.
        for (let i = 0; i < RANDOM_HARDWARE_AMOUNT; i++) {
            await prisma.hardware.create({
                data: {
                    model: faker.commerce.productAdjective(),
                    name: faker.commerce.productName(),
                    details: faker.commerce.productDescription(),
                },
            });
        }
    }
}
