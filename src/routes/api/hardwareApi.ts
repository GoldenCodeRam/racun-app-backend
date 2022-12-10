import { Request, Response } from "express";
import { logMotion } from "../../audit/audit";

import { HardwareDatabase } from "../../database/hardwareDatabase";
import { ApiEndpoint } from "../apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class HardwareApiEndpoint extends ApiEndpoint {
    constructor() {
        super("hardware");
    }

    public getElements(app: any): void {
        app.get(
            this.getUrl(),
            authorize,
            authorizeOnRole,
            async (_request: Request, response: Response) => {
                const result = await HardwareDatabase.getHardware();
                response.send(result);
            }
        );
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

                const result = await HardwareDatabase.searchHardware(
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
    }

    public createElement(app: any): void {
        app.post(
            this.getUrlWithExtension("create"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const hardwareData = request.body;
                const result = await HardwareDatabase.createHardware(
                    hardwareData
                );

                response.send(result);
            }
        );
    }

    public updateElement(app: any): void {
        app.put(
            this.getUrlWithExtension("update/:hardwareId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const hardwareId = parseInt(request.params["hardwareId"]);
                const hardwareChanges = request.body;

                const result = await HardwareDatabase.updateHardware(
                    hardwareId,
                    hardwareChanges
                );

                response.send(result);
            }
        );
    }

    public deleteElement(app: any): void {
        app.delete(
            this.getUrlWithExtension("delete/:hardwareId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response, next: any) => {
                const hardwareId = parseInt(request.params["hardwareId"]);

                const result = await HardwareDatabase.deleteHardware(
                    hardwareId
                );

                response.locals.result = result;
                next();
            },
            this.sendOkResponse
        );
    }

    public registerCustomMethods(app: any): void {
    }
}
