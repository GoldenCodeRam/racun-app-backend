import { Request, Response } from "express";
import { logMotion } from "../../audit/audit";
import { ServiceDatabase } from "../../database/serviceDatabase";
import { ApiEndpoint } from "../apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class ServicesApiEndpoint extends ApiEndpoint {
    constructor() {
        super("services");
    }

    public registerMethods(app: any): void {
        app.get(
            this.getUrlWithExtension(":serviceId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const serviceId = parseInt(request.params["serviceId"]);
                const result = await ServiceDatabase.getServiceById(serviceId);

                response.send(result);
            }
        );

        app.post(
            this.getUrlWithExtension("create"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const result = await ServiceDatabase.createService({
                    name: request.body.name,
                    description: request.body.description,
                });
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

                const result = await ServiceDatabase.searchService(
                    search,
                    skip,
                    take
                );
                response.send(result);
            }
        );
    }
}
