import { Api, ApisOnRoles, PrismaClient } from "@prisma/client";

import { withPrismaClient } from "./database.js";

export namespace ApiDatabase {
    export async function getApi(name: string): Promise<Api | null> {
        return await withPrismaClient<Api | null>(
            async (prisma: PrismaClient) => {
                const api = await prisma.api.findUnique({
                    where: {
                        name: name,
                    },
                });

                return api ?? null;
            }
        );
    }

    export async function getApisOnRoles(
        apiId: number,
        roleId: number
    ): Promise<ApisOnRoles | null> {
        return await withPrismaClient<ApisOnRoles | null>(
            async (prisma: PrismaClient) => {
                const apisOnRoles = await prisma.apisOnRoles.findUnique({
                    where: {
                        apiId_roleId: {
                            apiId: apiId,
                            roleId: roleId,
                        },
                    },
                });

                return apisOnRoles ?? null;
            }
        );
    }
}
