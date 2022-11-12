import { PrismaClient, User } from "@prisma/client";

import { SearchResult, SEARCH_AMOUNT, withPrismaClient } from "./database.js";

export namespace UserDatabase {

    export async function getUserByEmail(
        email: string,
    ): Promise<User | null> {
        return await withPrismaClient<User | null>(
            async (prisma: PrismaClient) => {
                const user = await prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                });

                return user ?? null;
            }
        );
    }

    export async function getUserById(
        id: number,
        withRole = false
    ): Promise<User | null> {
        return await withPrismaClient<User | null>(
            async (prisma: PrismaClient) => {
                const user = await prisma.user.findUnique({
                    where: {
                        id: id,
                    },
                    include: {
                        role: withRole,
                    },
                });

                return user ?? null;
            }
        );
    }

    export async function updateUser(user: any): Promise<User | null> {
        return await withPrismaClient<User | null>(
            async (prisma: PrismaClient) => {
                const updatedUser = await prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        roleId: user.role.id,
                    },
                });

                return updatedUser ?? null;
            }
        );
    }

    export async function searchUser(
        search: string = "",
        skip?: number,
        take?: number
    ): Promise<SearchResult<User>> {
        return await withPrismaClient<SearchResult<User>>(
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
                                email: {
                                    contains: search,
                                },
                            },
                        ],
                    };
                }
                const userCount = await prisma.user.count({
                    where: whereQuery ?? {},
                });
                const users = await prisma.user.findMany({
                    where: whereQuery ?? {},
                    include: {
                        role: true,
                    },
                    skip: skip ?? 0,
                    take: take ?? SEARCH_AMOUNT,
                });

                return {
                    search: users,
                    searchCount: userCount,
                };
            }
        );
    }
}
