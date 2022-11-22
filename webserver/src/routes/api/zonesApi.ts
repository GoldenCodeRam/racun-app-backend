import { Request, Response } from "express";

import { ZoneDatabase } from "../../database/zoneDatabase";
import { ApiEndpoint } from "../apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class ZonesApiEndpoint extends ApiEndpoint {
    constructor() {
        super("zones");
    }

    public registerMethods(app: any): void {
        app.get(
            this.getUrlWithExtension(":zoneId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const zoneId = parseInt(request.params["zoneId"]);
                const zone = await ZoneDatabase.getZoneById(zoneId);

                response.send(zone);
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

                const result = await ZoneDatabase.searchZone(
                    search,
                    skip,
                    take
                );
                response.send(result);
            }
        );
    }
}
