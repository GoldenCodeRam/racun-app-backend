import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

import { DefaultSeeder } from "./seeder.js";

const RANDOM_CLIENT_AMOUNT = 10;

export class ClientSeeder implements DefaultSeeder {
    async seed(prisma: PrismaClient): Promise<void> {
        for (let i = 0; i < RANDOM_CLIENT_AMOUNT; i++) {
            await prisma.client.create({
                data: {
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    document: faker.random.numeric(10),
                    phone: faker.phone.number(),
                    address: faker.address.streetAddress(),
                    // This is so the email generation is random.
                    email:
                        Math.random() < 0.5
                            ? faker.internet.exampleEmail()
                            : null,
                },
            });
        }
    }
}
