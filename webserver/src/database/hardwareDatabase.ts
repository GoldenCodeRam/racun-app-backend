import { Hardware, PrismaClient } from "@prisma/client";

import { SearchResult, SEARCH_AMOUNT, withPrismaClient } from "./database.js";

export namespace HardwareDatabase {
    export async function getHardwareById(
        id: number
    ): Promise<Hardware | null> {
        return await withPrismaClient<Hardware | null>(
            async (prisma: PrismaClient) => {
                const hardware = await prisma.hardware.findUnique({
                    where: {
                        id: id,
                    },
                });

                return hardware ?? null;
            }
        );
    }

    export async function searchHardware(
        search: string = "",
        skip?: number,
        take?: number
    ): Promise<SearchResult<Hardware>> {
        return await withPrismaClient<SearchResult<Hardware>>(
            async (prisma: PrismaClient) => {
                let whereQuery = null;

                if (search.length > 0) {
                    whereQuery = {
                        OR: [
                            {
                                model: {
                                    contains: search,
                                },
                            },
                            {
                                name: {
                                    equals: search,
                                },
                            },
                        ],
                    };
                }

                const hardwareCount = await prisma.hardware.count({
                    where: whereQuery ?? {},
                });
                const hardware = await prisma.hardware.findMany({
                    where: whereQuery ?? {},
                    skip: skip ?? 0,
                    take: take ?? SEARCH_AMOUNT,
                });

                return {
                    search: hardware,
                    searchCount: hardwareCount,
                };
            }
        );
    }
}
