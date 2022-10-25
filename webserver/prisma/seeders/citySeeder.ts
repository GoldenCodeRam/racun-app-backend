import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { DefaultSeeder } from "./seeder";

const RANDOM_CITY_AMOUNT = 10;

export class CitySeeder implements DefaultSeeder {
    async seed(prisma: PrismaClient) {
        // Create up to RANDOM_CITY_AMOUNT cities.
        for (let i = 0; i < RANDOM_CITY_AMOUNT; i++) {
            await prisma.place.create({
                data: {
                    name: faker.address.cityName(),
                },
            });
        }
    }
}
