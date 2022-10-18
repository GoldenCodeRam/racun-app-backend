import { Request, Response } from "express";
import { withPrismaClient } from "../database/database.js";
import { authorize } from "./auth.js";

export function configureApiModule(app: any) {
    app.get(
        "/api/clients",
        authorize,
        async (_: Request, response: Response) => {
            withPrismaClient(async (prisma) => {
                response.send(await prisma.client.findMany());
            });
        }
    );
}
