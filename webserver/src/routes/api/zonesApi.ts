import { Request, Response } from "express";
import { logMotion } from "../../audit/audit";

import { ZoneDatabase } from "../../database/zoneDatabase";
import { ApiEndpoint } from "../apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class ZonesApiEndpoint extends ApiEndpoint {
    constructor() {
        super("zones");
    }

    public getElements(_app: any): void {}

    public searchElements(app: any): void {
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

    public getElementById(app: any): void {
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
    }

    public createElement(app: any): void {
        app.post(
            this.getUrlWithExtension("create"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const zoneData = request.body;
                const result = await ZoneDatabase.createZone(zoneData);

                response.send(result);
            }
        );
    }

    public updateElement(app: any): void {
        app.put(
            this.getUrlWithExtension("update/:zoneId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const zoneId = parseInt(request.params["zoneId"]);
                const zoneData = request.body;

                const result = await ZoneDatabase.updateZone(zoneId, zoneData);

                response.send(result);
            }
        );
    }

    public deleteElement(app: any): void {
        app.delete(
            this.getUrlWithExtension("delete/:zoneId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response, next: any) => {
                const zoneId = parseInt(request.params["zoneId"]);

                const result = await ZoneDatabase.deleteZoneById(zoneId);
                response.locals.result = result;

                next();
            },
            this.sendOkResponse
        );
    }

    public registerCustomMethods(_app: any): void {}
}
