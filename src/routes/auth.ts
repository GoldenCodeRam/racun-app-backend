import { User } from "@prisma/client";
import { compareSync } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { Strategy } from "passport-local";
import {
    canRoleExecuteMethod,
    getUserRolePermissionsOnAPI,
} from "../auth/permissions";
import { UserDatabase } from "../database/userDatabase";

passport.use(
    "local",
    new Strategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async function verify(email, password, done) {
            const user = await UserDatabase.getUserByEmail(email);

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
        }
    )
);

passport.serializeUser((user: any | User, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    const user = await UserDatabase.getUserById(id);

    done(null, user);
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
        // You see all of this?
        // All of this is needed so we take the second part of the url to see
        // if the user has permission to the API route. So, take a look a this
        // example:
        //
        // /api/users: This should list the users, but how we make sure that
        // we get the 'users' part? That's why this is done.
        //
        // First, we replace the empty spaces, just to be safe, then we split
        // the url. After that, we remove the empty values from the array and
        // we get the second element and boom. We got it.
        const routeApi = request.route.path
            .replace(/ /g, "")
            .split("/")
            .filter((e: string) => e.length > 0)[1];
        // ====================================================================

        const permission = await getUserRolePermissionsOnAPI(
            (request.user as User).id,
            // This is needed so the arguments, queries and such, don't kill this.
            routeApi
        );

        // Check if the permission exists and then if the role can execute that
        // permission.
        if (permission && canRoleExecuteMethod(permission, request.method)) {
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

    app.post(
        "/logout",
        authorize,
        (request: Request, response: Response, next: NextFunction) => {
            request.session.destroy((_) => {
                response.sendStatus(200);
            });
        }
    );
}
