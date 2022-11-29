import { PrismaClient, Service } from "@prisma/client";
import { SearchResult, SEARCH_AMOUNT, withPrismaClient } from "./database";

export namespace ServiceDatabase {
    export async function deleteServiceById(id: number) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            if (await canDeleteService(prisma, id)) {
                return await prisma.service.delete({
                    where: {
                        id,
                    },
                });
            } else {
                throw new Error("Can't remove service!");
            }
        });
    }

    export async function updateServiceById(id: number, changes: Service) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.service.update({
                where: {
                    id,
                },
                data: changes,
            });
        });
    }

    export async function getServices() {
        return await withPrismaClient<Service[]>(
            async (prisma: PrismaClient) => {
                return await prisma.service.findMany();
            }
        );
    }

    export async function getServiceById(serviceId: number) {
        return await withPrismaClient<Service | null>(
            async (prisma: PrismaClient) => {
                return await prisma.service.findUnique({
                    where: {
                        id: serviceId,
                    },
                });
            }
        );
    }

    export async function createService(serviceInformation: {
        name: string;
        description: string;
    }) {
        return await withPrismaClient<Service | null>(
            async (prisma: PrismaClient) => {
                const service = await prisma.service.create({
                    data: {
                        ...serviceInformation,
                    },
                });
                return service ?? null;
            }
        );
    }

    export async function searchService(
        search: string = "",
        skip?: number,
        take?: number
    ) {
        return await withPrismaClient<SearchResult<Service>>(
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
                        ],
                    };
                }

                const serviceCount = await prisma.service.count({
                    where: whereQuery ?? {},
                });
                const services = await prisma.service.findMany({
                    where: whereQuery ?? {},
                    skip: skip ?? 0,
                    take: take ?? SEARCH_AMOUNT,
                });

                return {
                    search: services,
                    searchCount: serviceCount,
                };
            }
        );
    }
}

async function canDeleteService(prisma: PrismaClient, serviceId: number) {
    const contracts = await prisma.clientContract.findMany({
        where: {
            serviceId,
        },
    });

    // This means there is no contracts with that service.
    return contracts.length === 0;
}
