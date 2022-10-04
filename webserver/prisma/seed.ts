import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: {},
        create: {
            email: "admin@admin.com",
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            password: hashSync("admin", genSaltSync(10))
        },
    });

    for (let i = 0; i < 10; i++) {
        await prisma.place.create({
            data: {
                name: faker.address.cityName(),
            },
        });
    }
}

main().then(async () => {
    await prisma.$disconnect();
}).catch(async (error: any) => {
    console.log(error);
    await prisma.$disconnect();
    process.exit();
});
