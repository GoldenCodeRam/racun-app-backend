import { PrismaClient } from "@prisma/client";
import { DefaultSeeder } from "./seeder";
import { DEFAULT_CONFIG } from "../../src/model/config";

export class ConfigSeeder implements DefaultSeeder {
    async seed(prisma: PrismaClient) {
        for (const value of Object.values(DEFAULT_CONFIG)) {
            await prisma.config.create({
                data: {
                    key: value.key,
                    value: value.value,
                },
            });
        }
    }
}
