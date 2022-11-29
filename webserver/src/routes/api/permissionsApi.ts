import { Request, Response } from "express";
import { logMotion } from "../../audit/audit";

import { ApiDatabase } from "../../database/apiDatabase";
import { ApiEndpoint } from "../apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class PermissionsApiEndpoint extends ApiEndpoint {
    constructor() {
        super("permissions");
    }

    public getElements(_app: any): void {}

    public searchElements(_app: any): void {}

    public getElementById(app: any): void {
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

    public createElement(_app: any): void {}

    public updateElement(app: any): void {
        app.put(
            this.getUrlWithExtension("changePermission/:apisOnRolesId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const changes = request.body;
                const result = await ApiDatabase.updateApisOnRoles(changes);

                response.send(result);
            }
        );
    }

    public deleteElement(_app: any): void {}

    public registerCustomMethods(_app: any): void {}
}
