import { Request, Response } from "express";
import { PlaceDatabase } from "../../database/placeDatabase";
import { ApiEndpoint } from "../apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class PlacesApiEndpoint extends ApiEndpoint {
    constructor() {
        super("places");
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

                const result = await PlaceDatabase.searchPlace(
                    search,
                    skip,
                    take
                );
                response.send(result);
            }
        );
    }
}
