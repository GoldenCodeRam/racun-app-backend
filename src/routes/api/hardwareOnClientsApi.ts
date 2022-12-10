import { Request, Response } from "express";
import { logMotion } from "../../audit/audit";
import { HardwareOnClientsDatabase } from "../../database/hardwareOnClientsDatabase";

import { ApiEndpoint } from "../apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class HardwareOnClientsApiEndpoint extends ApiEndpoint {
    constructor() {
        super("hardware-on-clients");
    }

    public getElements(app: any): void {}

    public searchElements(app: any): void {}

    public getElementById(app: any): void {
        app.get(
            this.getUrlWithExtension(":clientAccountId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response, next: any) => {
                const clientAccountId = parseInt(
                    request.params["clientAccountId"]
                );
                const result =
                    await HardwareOnClientsDatabase.getHardwareOnClientByClientAccountId(
                        clientAccountId
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
                const hardwareOnClientData = request.body;
                const result =
                    await HardwareOnClientsDatabase.createHardwareOnClient(
                        hardwareOnClientData
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
            this.getUrlWithExtension("delete/:hardwareOnClientId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response, next: any) => {
                const hardwareOnClientId = parseInt(
                    request.params["hardwareOnClientId"]
                );

                const result =
                    await HardwareOnClientsDatabase.deleteHardwareOnClient(
                        hardwareOnClientId
                    );

                response.locals.result = result;
                next();
            },
            this.sendOkResponse
        );
    }

    public registerCustomMethods(app: any): void {}
}
