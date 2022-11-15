import { ApisOnRoles } from "@prisma/client";

import { ApiDatabase } from "../database/apiDatabase.js";
import { UserDatabase } from "../database/userDatabase.js";

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
  apiName: string
): Promise<ApisOnRoles | null> {
  const validatedUser = await UserDatabase.getUserById(userId);
  const validatedApi = await ApiDatabase.getApi(apiName);

  if (validatedUser && validatedApi) {
    return await ApiDatabase.getApisOnRolesById(
      validatedApi.id,
      validatedUser.roleId,
    );
  } else {
    return null;
  }
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
    case "PUT":
      // FIXME: This PUT case is very important, we could just add another value
      // to the model and database, but for the moment we need to have this
      // working. So if the user can post, it means that it can also update
      // values.
      return permission.post;
    case "DELETE":
      return permission.delete;
    default:
      // When other method is requested but we aren't using it.
      return false;
  }
}
