import { User } from "@prisma/client";
import { compareSync } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { Strategy } from "passport-local";
import { canRoleExecuteMethod, getUserRolePermissionsOnAPI } from "../auth/permissions.js";

import { withPrismaClient } from "../database/database.js";

passport.use(
    "local",
    new Strategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        function verify(email, password, done) {
            withPrismaClient(async (prisma) => {
                const user = await prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                });

                if (user) {
                    if (compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message: "Incorrect password",
                        });
                    }
                } else {
                    return done(null, false, {
                        message: "Incorrect username",
                    });
                }
            });
        }
    )
);

passport.serializeUser((user: any | User, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    withPrismaClient(async (prisma) => {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        done(null, user);
    });
});

// This is a simple alternative to the authorize Middleware used by PassportJs
// I couldn't make it work, so this is the solution. :/
export function authorize(
    request: Request,
    response: Response,
    next: NextFunction
) {
    if (request.user) {
        next();
    } else {
        response.sendStatus(401);
    }
}

export async function authorizeOnRole(
    request: Request,
    response: Response,
    next: NextFunction
) {
    if (request.user) {
        const permission = await getUserRolePermissionsOnAPI(
            (request.user as User).id,
            request.url
        );

        if (canRoleExecuteMethod(permission, request.method)) {
            next();
        } else {
            response.sendStatus(401);
        }
    } else {
        response.sendStatus(401);
    }
}

export function configureAuthModule(app: any) {
    app.post(
        "/login/password",
        passport.authenticate("local", {
            failureMessage: true,
            successMessage: true,
        }),
        (_: Request, response: Response) => {
            response.sendStatus(200);
        }
    );

    app.get("/auth/canActivate", authorize, (_: Request, response: Response) =>
        response.sendStatus(200)
    );
}
