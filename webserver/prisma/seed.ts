import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt";

const prisma = new PrismaClient();

// This tells the seeding process how much entities we want.
const RANDOM_CITY_AMOUNT = 10;
const RANDOM_USER_AMOUNT = 10;
const RANDOM_HARDWARE_AMOUNT = 10;

async function main() {
    await prisma.user.upsert({
        where: { email: "admin@admin.com" },
        update: {},
        create: {
            email: "admin@admin.com",
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            password: hashSync("admin", genSaltSync(10)),
        },
    });

    // Create up to RANDOM_CITY_AMOUNT cities.
    for (let i = 0; i < RANDOM_CITY_AMOUNT; i++) {
        await prisma.place.create({
            data: {
                name: faker.address.cityName(),
            },
        });
    }

    // Create up to RANDOM_USER_AMOUNT users.
    for (let i = 0; i < RANDOM_USER_AMOUNT; i++) {
        await prisma.client.create({
            data: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                document: faker.random.numeric(10),
                phone: faker.phone.number(),
                address: faker.address.streetAddress(),
                // This is so the email generation is random.
                email:
                    Math.random() < 0.5 ? faker.internet.exampleEmail() : null,
            },
        });
    }

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

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error: any) => {
        console.log(error);
        await prisma.$disconnect();
        process.exit();
    });
