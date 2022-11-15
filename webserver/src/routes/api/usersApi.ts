import { Request, Response } from "express";
import { logMotion } from "../../audit/audit.js";
import { UserDatabase } from "../../database/userDatabase.js";
import { ApiEndpoint } from "../apiEndpoint.js";
import { authorize, authorizeOnRole } from "../auth.js";

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

    app.put(
      this.getUrlWithExtension("edit/:userId"),
      authorize,
      authorizeOnRole,
      logMotion,
      async (request: Request, response: Response) => {
        const userId = parseInt(request.params["userId"]);
        const result = await UserDatabase.updateUser(
          userId,
          request.body
        );
        response.send(result);
      }
    );

    app.post(
      this.getUrlWithExtension("create"),
      authorize,
      authorizeOnRole,
      logMotion,
      async (request: Request, response: Response) => {
        const result = await UserDatabase.createUser(
          request.body
        );
        response.send(result);
      }
    );

  }
}
