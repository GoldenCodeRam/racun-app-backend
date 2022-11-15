import { Request, Response } from "express";
import { ActionDatabase } from "../../database/actionDatabase.js";
import { UserDatabase } from "../../database/userDatabase.js";
import { ApiEndpoint } from "../apiEndpoint.js";
import { authorize, authorizeOnRole } from "../auth.js";

export class ActionsApiEndpoint extends ApiEndpoint {
    constructor() {
        super("actions");
    }

    public registerMethods(app: any): void {
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
}
