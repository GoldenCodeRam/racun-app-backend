import { Request, Response } from "express";
import { logMotion } from "../../audit/audit";
import { ApiDatabase } from "../../database/apiDatabase";

import { RoleDatabase } from "../../database/roleDatabase";
import { ApiEndpoint } from "../apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class RolesApiEndpoint extends ApiEndpoint {
    constructor() {
        super("roles");
    }

    public registerMethods(app: any): void {
        app.post(
            this.getUrlWithExtension("create"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const result = await RoleDatabase.createRole(
                    request.body.roleName
                );
                const apis = await ApiDatabase.getApis();

                // This right here might be problematic in the future, as we are
                // creating the role and generating all the relationships with
                // the APIs, so if we have many roles or many APIs, this can be
                // troublesome. For now this I think is the correct way, as we
                // can have a lot of control over the permissions, but we have
                // to see later.
                for (const api of apis) {
                    await ApiDatabase.createApisOnRoles(api.id, result!.id);
                }

                response.sendStatus(200);
            }
        );

        app.post(
            this.getUrlWithExtension("search"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const search = request.body.userSearch;
                const skip = request.body.skip;
                const take = request.body.take;

                const result = await RoleDatabase.searchRole(
                    search,
                    skip,
                    take
                );
                response.send(result);
            }
        );

        app.get(
            this.getUrlWithExtension(":roleId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const roleId = parseInt(request.params["roleId"]);
                const result = await RoleDatabase.getRoleById(roleId);

                response.send(result);
            }
        );

        app.get(
            this.getUrl(),
            authorize,
            authorizeOnRole,
            async (_: Request, response: Response) => {
                const result = await RoleDatabase.getRoles();

                response.send(result);
            }
        );
    }
}
