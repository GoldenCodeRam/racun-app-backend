import { Request, Response } from "express";
import { withPrismaClient } from "../database/database.js";
import { authorize, authorizeOnRole } from "./auth.js";

export const DEFAULT_API_ROUTES = {
    clientsAPI: "/api/clients",
};

export function configureApiModule(app: any) {
    app.get(
        "/api/clients",
        authorize,
        authorizeOnRole,
        async (_: Request, response: Response) => {
            withPrismaClient(async (prisma) => {
                response.send(await prisma.client.findMany());
            });
        }
    );
}
