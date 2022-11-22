import { Client, ClientAccount, PrismaClient } from "@prisma/client";

import { SearchResult, SEARCH_AMOUNT, withPrismaClient } from "./database";

export namespace ClientDatabase {
    export async function getClientAccounts() {
        return await withPrismaClient<ClientAccount[]>(
            async (prisma: PrismaClient) => {
                return await prisma.clientAccount.findMany();
            }
        );
    }

    export async function getClientAccountById() {
        return await withPrismaClient<ClientAccount[]>(
            async (prisma: PrismaClient) => {
                return await prisma.clientAccount.findMany();
            }
        );
    }

    export async function searchClient(
        search: string = "",
        skip?: number,
        take?: number
    ): Promise<SearchResult<Client>> {
        return await withPrismaClient<SearchResult<Client>>(
            async (prisma: PrismaClient) => {
                let whereQuery = null;

                if (search.length > 0) {
                    whereQuery = {
                        OR: [
                            {
                                firstName: {
                                    contains: search,
                                },
                            },
                            {
                                lastName: {
                                    contains: search,
                                },
                            },
                            {
                                document: {
                                    contains: search,
                                },
                            },
                        ],
                    };
                }

                const clientCount = await prisma.client.count({
                    where: whereQuery ?? {},
                });
                const clients = await prisma.client.findMany({
                    where: whereQuery ?? {},
                    skip: skip ?? 0,
                    take: take ?? SEARCH_AMOUNT,
                });

                return {
                    search: clients,
                    searchCount: clientCount,
                };
            }
        );
    }

    export async function getClientById(id: number): Promise<Client | null> {
        return await withPrismaClient<Client | null>(
            async (prisma: PrismaClient) => {
                const client = await prisma.client.findUnique({
                    where: {
                        id: id,
                    },
                    include: {
                        clientAccount: true,
                    },
                });

                return client ?? null;
            }
        );
    }

    export async function getClients() {
        return await withPrismaClient<Client[]>(
            async (prisma: PrismaClient) => {
                return await prisma.client.findMany();
            }
        );
    }

    export async function countClients(): Promise<number> {
        return await withPrismaClient<number>(async (prisma: PrismaClient) => {
            return await prisma.client.count();
        });
    }

    export async function createClient(client: {
        firstName: string;
        lastName: string;
        document: string;
        phone: string;
        address: string;
        email: string | null;
    }): Promise<Client | null> {
        return await withPrismaClient<Client | null>(
            async (prisma: PrismaClient) => {
                const newClient = await prisma.client.create({
                    data: {
                        firstName: client.firstName,
                        lastName: client.lastName,
                        document: client.document,
                        phone: client.phone,
                        address: client.address,
                        email: client.email,
                    },
                });

                return newClient ?? null;
            }
        );
    }

    export async function deleteClient(id: number): Promise<void | null> {
        return await withPrismaClient<void | null>(
            async (prisma: PrismaClient) => {
                await prisma.client.delete({
                    where: {
                        id,
                    },
                });
            }
        );
    }
}
