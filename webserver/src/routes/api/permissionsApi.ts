import { Request, Response } from "express";

import { ApiDatabase } from "../../database/apiDatabase";
import { ApiEndpoint } from "../apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class PermissionsApiEndpoint extends ApiEndpoint {
    constructor() {
        super("permissions");
    }

    public registerMethods(app: any): void {
        app.get(
            this.getUrlWithExtension(":roleId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const roleId = parseInt(request.params["roleId"]);
                const apisOnRoles = await ApiDatabase.getApisOnRolesByRoleId(
                    roleId
                );

                response.send(apisOnRoles);
            }
        );
    }
}
