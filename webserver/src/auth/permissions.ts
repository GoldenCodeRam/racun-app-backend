import { APIsOnRoles, PrismaClient } from "@prisma/client";

import { withPrismaClient } from "../database/database.js";

export interface Permission {
    hasGet(): boolean;
    hasPost(): boolean;
    hasDelete(): boolean;
}

export class AllPermissions implements Permission {
    hasGet(): boolean {
        return true;
    }

    hasPost(): boolean {
        return true;
    }

    hasDelete(): boolean {
        return true;
    }
}

export async function getUserRolePermissionsOnAPI(
    userId: number,
    apiUrl: string
) {
    return await new Promise<APIsOnRoles>((resolve, _) => {
        withPrismaClient(async (prisma: PrismaClient) => {
            const validatedUser = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    role: true,
                },
            });
            const validatedAPI = await prisma.aPI.findUnique({
                where: { route: apiUrl },
            });

            const result = await prisma.aPIsOnRoles.findUnique({
                where: {
                    apiId_roleId: {
                        apiId: validatedAPI!.id,
                        roleId: validatedUser!.role.id,
                    },
                },
            });
            if (result) {
                resolve(result);
            }
        });
    });
}

export function canRoleExecuteMethod(
    permission: APIsOnRoles,
    request: string
): boolean {
    switch (request) {
        case "GET":
            return permission.get;
        case "POST":
            return permission.post;
        case "DELETE":
            return permission.delete;
        default:
            // When other method is requested but we aren't using it.
            return false;
    }
}
