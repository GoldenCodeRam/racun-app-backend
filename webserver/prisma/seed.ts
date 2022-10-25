import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

import { Seeder } from "./seeders/seeder.js";

const prisma = new PrismaClient();


async function main() {
    await new Seeder(prisma).runAllSeeders();
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
