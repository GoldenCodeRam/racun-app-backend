import { ApisOnRoles, PrismaClient } from "@prisma/client";

import { withPrismaClient } from "../database/database.js";
import { Method } from "../routes/apiRoutes.js";

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

/**
 * Use the user role, API route, to get the permissions the user has on that
 * route. 
 */
export async function getUserRolePermissionsOnAPI(
    userId: number,
    apiRoute: string,
): Promise<ApisOnRoles> {
    return await new Promise<ApisOnRoles>((resolve, _) => {
        withPrismaClient(async (prisma: PrismaClient) => {
            const validatedUser = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    role: true,
                },
            });
            const validatedAPI = await prisma.api.findUnique({
                where: {
                    route: apiRoute,
                },
            });

            const result = await prisma.apisOnRoles.findUnique({
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
    permission: ApisOnRoles,
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
