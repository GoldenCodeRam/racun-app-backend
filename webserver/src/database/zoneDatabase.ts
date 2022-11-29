import { PrismaClient, Zone } from "@prisma/client";

import { SearchResult, SEARCH_AMOUNT, withPrismaClient } from "./database";

export namespace ZoneDatabase {
    export async function deleteZoneById(id: number) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.zone.delete({
                where: {
                    id,
                },
            });
        });
    }

    export async function updateZone(id: number, zone: Zone) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.zone.update({
                where: {
                    id,
                },
                data: zone,
            });
        });
    }

    export async function createZone(zone: Zone) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.zone.create({
                data: zone,
            });
        });
    }

    export async function getZoneById(id: number): Promise<Zone | null> {
        return await withPrismaClient<Zone | null>(
            async (prisma: PrismaClient) => {
                const zone = await prisma.zone.findUnique({
                    where: {
                        id: id,
                    },
                });

                return zone ?? null;
            }
        );
    }

    export async function searchZone(
        search: string = "",
        skip?: number,
        take?: number
    ): Promise<SearchResult<Zone>> {
        return await withPrismaClient<SearchResult<Zone>>(
            async (prisma: PrismaClient) => {
                let whereQuery = null;

                if (search.length > 0) {
                    whereQuery = {
                        OR: [
                            {
                                name: {
                                    contains: search,
                                },
                            },
                            {
                                code: {
                                    contains: search,
                                },
                            },
                        ],
                    };
                }

                const zoneCount = await prisma.zone.count({
                    where: whereQuery ?? {},
                });
                const zones = await prisma.zone.findMany({
                    where: whereQuery ?? {},
                    skip: skip ?? 0,
                    take: take ?? SEARCH_AMOUNT,
                });

                return {
                    search: zones,
                    searchCount: zoneCount,
                };
            }
        );
    }
}
