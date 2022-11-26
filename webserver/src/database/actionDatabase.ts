import { Action, PrismaClient } from "@prisma/client";

import { SearchResult, SEARCH_AMOUNT, withPrismaClient } from "./database";

export class ActionDatabase {
    static async getActionById(id: number) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.action.findUnique({
                where: {
                    id,
                },
            });
        });
    }

    static async createAction(actionInformation: {
        method: string;
        url: string;
        date: Date;
        userEmail: string;
    }) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.action.create({
                data: actionInformation,
            });
        });
    }

    export async function searchAction(
        search: string = "",
        skip?: number,
        take?: number
    ): Promise<SearchResult<Action>> {
        return await withPrismaClient<SearchResult<Action>>(
            async (prisma: PrismaClient) => {
                let whereQuery = null;

                if (search.length > 0) {
                    whereQuery = {
                        OR: [
                            {
                                method: {
                                    contains: search,
                                },
                            },
                            {
                                url: {
                                    contains: search,
                                },
                            },
                            {
                                date: search,
                            },
                            {
                                userEmail: search,
                            },
                        ],
                    };
                }

                const actionCount = await prisma.action.count({
                    where: whereQuery ?? {},
                });
                const actions = await prisma.action.findMany({
                    where: whereQuery ?? {},
                    skip: skip ?? 0,
                    take: take ?? SEARCH_AMOUNT,
                });

                return {
                    search: actions,
                    searchCount: actionCount,
                };
            }
        );
    }
}
