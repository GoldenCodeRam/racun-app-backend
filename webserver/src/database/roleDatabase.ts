import { PrismaClient, Role } from "@prisma/client";

import { SearchResult, SEARCH_AMOUNT, withPrismaClient } from "./database";

export namespace RoleDatabase {
    export async function getRoleById(id: number): Promise<Role | null> {
        return await withPrismaClient<Role | null>(
            async (prisma: PrismaClient) => {
                const role = await prisma.role.findUnique({
                    where: {
                        id: id,
                    },
                });

                return role ?? null;
            }
        );
    }

    export async function getRoles(): Promise<Role[]> {
        return await withPrismaClient<Role[]>(async (prisma: PrismaClient) => {
            const roles = await prisma.role.findMany();

            return roles;
        });
    }

    export async function createRole(name: string): Promise<Role | null> {
        return await withPrismaClient<Role | null>(
            async (prisma: PrismaClient) => {
                const role = await prisma.role.create({
                    data: {
                        name,
                    },
                });

                return role ?? null;
            }
        );
    }

    export async function searchRole(
        search: string = "",
        skip?: number,
        take?: number
    ): Promise<SearchResult<Role>> {
        return await withPrismaClient<SearchResult<Role>>(
            async (prisma: PrismaClient) => {
                let whereQuery = null;

                if (search.length > 0) {
                    whereQuery = {
                        name: {
                            contains: search,
                        },
                    };
                }

                const roleCount = await prisma.role.count({
                    where: whereQuery ?? {},
                });
                const roles = await prisma.role.findMany({
                    where: whereQuery ?? {},
                    skip: skip ?? 0,
                    take: take ?? SEARCH_AMOUNT,
                });

                return {
                    search: roles,
                    searchCount: roleCount,
                };
            }
        );
    }
}
