import { PrismaClient, Role, User } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt";
import { DEFAULT_ROLES } from "../model/role";

import { SearchResult, SEARCH_AMOUNT, withPrismaClient } from "./database";
import { DatabaseErrors } from "./exceptions/exceptions";

export namespace UserDatabase {
    export async function getUserByEmail(email: string): Promise<User | null> {
        return await withPrismaClient<User | null>(
            async (prisma: PrismaClient) => {
                const user = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                });

                return user ?? null;
            }
        );
    }

    export async function getUserById(id: number, withRole = false) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.user.findUnique({
                where: {
                    id,
                },
                include: {
                    role: withRole,
                },
            });
        });
    }

    export async function createUser(userInformation: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: Role;
    }): Promise<User | null> {
        return await withPrismaClient<User | null>(
            async (prisma: PrismaClient) => {
                const user = await prisma.user.create({
                    data: {
                        firstName: userInformation.firstName,
                        lastName: userInformation.lastName,
                        email: userInformation.email,
                        password: hashSync(
                            userInformation.password,
                            genSaltSync(10)
                        ),
                        roleId: userInformation.role.id,
                    },
                });

                return user ?? null;
            }
        );
    }

    export async function deleteUser(id: number): Promise<void | null> {
        return await withPrismaClient<void | null>(
            async (prisma: PrismaClient) => {
                if (await platformHasMoreThanOneSuperUser(prisma)) {
                    await prisma.user.delete({
                        where: {
                            id,
                        },
                    });
                } else {
                    throw new DatabaseErrors.LastSuperUserError();
                }
            }
        );
    }

    export async function updateUser(
        userToChangeId: number,
        userChanges: any
    ): Promise<User | null> {
        return await withPrismaClient<User | null>(
            async (prisma: PrismaClient) => {
                if (await canUpdateUser(prisma, userToChangeId, userChanges)) {
                    const updatedUser = await prisma.user.update({
                        where: {
                            id: userToChangeId,
                        },
                        data: {
                            firstName: userChanges.firstName,
                            lastName: userChanges.lastName,
                            email: userChanges.email,
                            roleId: userChanges.role.id,
                        },
                    });

                    return updatedUser ?? null;
                } else {
                    throw new DatabaseErrors.LastSuperUserError();
                }
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

    /**
     * Checks if there is more than 1 super user when deleting or updating an user
     * if it is the last super user, the role can't be changed or removed.
     */
    async function canUpdateUser(
        prisma: PrismaClient,
        userToChangeId: number,
        changes: any
    ): Promise<boolean> {
        const userToChange = await prisma.user.findUnique({
            where: {
                id: userToChangeId,
            },
        });

        // If the user that we are trying to change is a Super Admin we have to
        // check:
        //
        // 1. If the user wants to change the role, check if there is more than
        // one super user.
        if (userToChange?.roleId === DEFAULT_ROLES.superAdmin.id) {
            // This means the user is changing the role of the user
            if (changes.role.id !== DEFAULT_ROLES.superAdmin.id) {
                return platformHasMoreThanOneSuperUser(prisma);
            }
        }
        return true;
    }

    async function platformHasMoreThanOneSuperUser(prisma: PrismaClient) {
        const superUsers = await prisma.user.findMany({
            where: {
                roleId: DEFAULT_ROLES.superAdmin.id,
            },
        });

        return superUsers.length > 1;
    }
}
