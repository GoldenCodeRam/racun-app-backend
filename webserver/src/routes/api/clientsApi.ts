import { Request, Response } from "express";
import { logMotion } from "../../audit/audit";
import { ClientDatabase } from "../../database/clientDatabase";

import { ApiEndpoint } from "../apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class ClientsApiEndpoint extends ApiEndpoint {
    constructor() {
        super("clients");
    }

    public getElements(app: any): void {
        app.get(
            this.getUrl(),
            authorize,
            authorizeOnRole,
            async (_: Request, response: Response) => {
                const result = ClientDatabase.getClients();
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

                const result = await ClientDatabase.searchClient(
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
            this.getUrlWithExtension(":clientId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const clientId = parseInt(request.params["clientId"]);
                const client = await ClientDatabase.getClientById(clientId);

                response.send(client);
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
                const result = await ClientDatabase.createClient(request.body);
                response.send(result);
            }
        );
    }

    public updateElement(app: any): void {
        throw new Error("Method not implemented.");
    }

    public deleteElement(app: any): void {
        app.delete(
            this.getUrlWithExtension("delete/:clientId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const clientId = parseInt(request.params["clientId"]);
                await ClientDatabase.deleteClient(clientId);
                response.sendStatus(200);
            }
        );
    }

    public registerCustomMethods(app: any): void {
        app.get(
            this.getUrlWithExtension("count"),
            authorize,
            authorizeOnRole,
            async (_: Request, response: Response) => {
                const count = await ClientDatabase.countClients();
                response.send(count);
            }
        );

        app.get(
            this.getUrlWithExtension("accounts/"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (_: Request, response: Response) => {
                const clientAccounts = ClientDatabase.getClientAccounts();
                response.send(clientAccounts);
            }
        );
    }
}
