import { Request, Response } from "express";
import { PlaceDatabase } from "../../database/placeDatabase";
import { ApiEndpoint } from "../apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class PlacesApiEndpoint extends ApiEndpoint {
    constructor() {
        super("places");
    }

    public getElements(app: any): void {
        app.get(
            this.getUrl(),
            authorize,
            authorizeOnRole,
            async (_request: Request, response: Response) => {
                const result = await PlaceDatabase.getPlaces();
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
                console.log(search, skip, take);

                const result = await PlaceDatabase.searchPlace(
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
            this.getUrlWithExtension("get/:placeId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const placeId = parseInt(request.params["placeId"]);

                const result = await PlaceDatabase.getPlaceById(placeId);
                response.send(result);
            }
        );
    }

    public createElement(_app: any): void {}

    public updateElement(_app: any): void {}

    public deleteElement(_app: any): void {}

    public registerCustomMethods(_app: any): void {}
}
