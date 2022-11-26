import { Request, Response } from "express";
import { logMotion } from "../../audit/audit";
import { ActionDatabase } from "../../database/actionDatabase";
import { ApiEndpoint } from "../apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class ActionsApiEndpoint extends ApiEndpoint {
    constructor() {
        super("actions");
    }

    public searchElements(app: any): void {
        app.post(
            this.getUrlWithExtension("search"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const search = request.body.userSearch;
                const skip = request.body.skip;
                const take = request.body.take;

                const result = await ActionDatabase.searchAction(
                    search,
                    skip,
                    take
                );
                response.send(result);
            }
        );
    }

    public getElementById(app: any): void {
        app.get(
            this.getUrlWithExtension(":actionId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const actionId = parseInt(request.params["actionId"]);
                const result = await ActionDatabase.getActionById(actionId);

                response.send(result);
            }
        );
    }

    public createElement(app: any): void {
        app.post(
            this.getUrlWithExtension(":actionId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const actionInformation = request.body;
                const result = await ActionDatabase.createAction(
                    actionInformation
                );

                response.send(result);
            }
        );
    }

    public updateElement(app: any): void {
        throw new Error("Method not implemented.");
    }

    public registerCustomMethods(app: any): void {}
}
