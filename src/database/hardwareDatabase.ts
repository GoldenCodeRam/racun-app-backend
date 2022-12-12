import { Hardware, PrismaClient } from "@prisma/client";
import { Err, Ok, Result } from "ts-results";

import { SearchResult, SEARCH_AMOUNT, withPrismaClient } from "./database";

export namespace HardwareDatabase {
    export async function deleteHardware(
        id: number
    ): Promise<Result<Hardware, Error>> {
        try {
            return Ok(
                await withPrismaClient(async (prisma: PrismaClient) => {
                    return await prisma.hardware.delete({
                        where: {
                            id,
                        },
                    });
                })
            );
        } catch (error: any) {
            return Err(error);
        }
    }

    export async function updateHardware(id: number, changes: Hardware) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.hardware.update({
                where: {
                    id,
                },
                data: changes,
            });
        });
    }

    export async function createHardware(hardwareData: {
        name: string;
        description: string;
        model: string;
    }) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.hardware.create({
                data: hardwareData,
            });
        });
    }

    export async function getHardware() {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.hardware.findMany();
        });
    }

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
                                    contains: search,
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

    export async function isHardwareAvailable(
        prisma: PrismaClient,
        hardwareId: number
    ) {
        const where = {
            hardwareId,
            endDate: null,
        };

        const hardwareOnClients = await prisma.hardwareOnClients.findMany({
            // If this finds any hardware that matches this hardware id
            // AND the end date is not null, it means there is the same
            // hardware and an active one, so don't do this.
            where,
        });

        const hardwareOnZones = await prisma.hardwareOnZones.findMany({
            where,
        });

        return hardwareOnClients.length === 0 && hardwareOnZones.length === 0;
    }
}
