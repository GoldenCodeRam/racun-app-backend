import { Request, Response } from "express";

import { withPrismaClient } from "../../database/database.js";
import { HardwareDatabase } from "../../database/hardwareDatabase.js";
import { ApiEndpoint } from "../apiEndpoint.js";
import { authorize, authorizeOnRole } from "../auth.js";

export class HardwareApiEndpoint extends ApiEndpoint {
    constructor() {
        super("hardware");
    }

    public registerMethods(app: any): void {
        app.get(
            this.getUrlWithExtension(":hardwareId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const hardwareId = parseInt(request.params["hardwareId"]);
                const result = await HardwareDatabase.getHardwareById(
                    hardwareId
                );

                response.send(result);
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

                const result = await HardwareDatabase.searchHardware(
                    search,
                    skip,
                    take
                );
                response.send(result);
            }
        );
    }
}
