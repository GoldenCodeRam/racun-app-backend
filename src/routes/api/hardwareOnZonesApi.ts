import { Request, Response } from "express";
import { logMotion } from "../../audit/audit";

import { HardwareOnZonesDatabase } from "../../database/hardwareOnZonesDatabase";
import { ApiEndpoint } from "../apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class HardwareOnZonesApiEndpoint extends ApiEndpoint {
    constructor() {
        super("hardware-on-zones");
    }

    public getElements(app: any): void {}

    public searchElements(app: any): void {}

    public getElementById(app: any): void {
        app.get(
            this.getUrlWithExtension(":zoneId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response, next: any) => {
                const zoneId = parseInt(request.params["zoneId"]);
                const result =
                    await HardwareOnZonesDatabase.getHardwareOnZonesByZoneId(
                        zoneId
                    );

                response.locals.result = result;
                next();
            },
            this.sendObjectResponse
        );
    }

    public createElement(app: any): void {
        app.post(
            this.getUrlWithExtension("create"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response, next: any) => {
                const hardwareOnZonesData = request.body;
                const result =
                    await HardwareOnZonesDatabase.createHardwareOnZones(
                        hardwareOnZonesData
                    );
                response.locals.result = result;
                next();
            },
            this.sendObjectResponse
        );
    }

    public updateElement(app: any): void {}

    public deleteElement(app: any): void {
        app.delete(
            this.getUrlWithExtension("delete/:hardwareOnZoneId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response, next: any) => {
                const hardwareOnZoneId = parseInt(
                    request.params["hardwareOnZoneId"]
                );

                const result =
                    await HardwareOnZonesDatabase.deleteHardwareOnZone(
                        hardwareOnZoneId
                    );

                response.locals.result = result;
                next();
            },
            this.sendOkResponse
        );
    }

    public registerCustomMethods(app: any): void {}
}
