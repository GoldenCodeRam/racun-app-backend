import { User } from "@prisma/client";
import { compareSync } from "bcrypt";
import { Request, Response } from "express";
import passport from "passport";
import { Strategy } from "passport-local";

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
    ),
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

export function configureAuthModule(app: any) {
    app.post(
        '/login/password',
        passport.authenticate('local', {
            failureMessage: true,
            successMessage: true,
        }),
        (request: Request, response: Response) => {
            response.sendStatus(200);
        },
    );
}
