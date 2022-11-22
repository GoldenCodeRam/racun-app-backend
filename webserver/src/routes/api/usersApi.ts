import { User } from "@prisma/client";
import { Request, Response } from "express";
import { logMotion } from "../../audit/audit";
import { UserDatabase } from "../../database/userDatabase";
import { ApiEndpoint } from "../apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class UsersApiEndpoint extends ApiEndpoint {
    constructor() {
        super("users");
    }

    public registerMethods(app: any): void {
        app.get(
            this.getUrlWithExtension("current-user"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                response.send(request.user);
            }
        );

        app.get(
            this.getUrlWithExtension(":userId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const userId = parseInt(request.params["userId"]);
                const result = await UserDatabase.getUserById(userId, true);
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

                const result = await UserDatabase.searchUser(
                    search,
                    skip,
                    take
                );
                response.send(result);
            }
        );

        app.delete(
            this.getUrlWithExtension("delete/:userId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const userId = parseInt(request.params["userId"]);
                try {
                    if ((request.user as User).id == userId) {
                        response
                            .status(412)
                            .send("Can't delete the current user.");
                        return;
                    }

                    await UserDatabase.deleteUser(userId);
                    response.sendStatus(200);
                } catch (error) {
                    response.status(406).send(error);
                }
            }
        );

        app.put(
            this.getUrlWithExtension("edit/:userId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const userId = parseInt(request.params["userId"]);
                try {
                    const result = await UserDatabase.updateUser(
                        userId,
                        request.body
                    );
                    response.send(result);
                } catch (error) {
                    response.status(406).send(error);
                }
            }
        );

        app.post(
            this.getUrlWithExtension("create"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const result = await UserDatabase.createUser(request.body);
                response.send(result);
            }
        );
    }
}
