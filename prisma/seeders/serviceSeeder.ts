import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { DefaultSeeder } from "./seeder";

const RANDOM_SERVICE_AMOUNT = 10;

export class ServiceSeeder implements DefaultSeeder {
    async seed(prisma: PrismaClient) {
        for (let i = 0; i < RANDOM_SERVICE_AMOUNT; i++) {
            await prisma.service.create({
                data: {
                    name: faker.commerce.productName(),
                    description: faker.lorem.paragraph(),
                },
            });
        }
    }
}
