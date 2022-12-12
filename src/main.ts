import express, { json, urlencoded } from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import cors from "cors";

import { configureApiModule } from "./routes/apis.js";
import { configureAuthModule } from "./routes/auth.js";
import { CronJobManager } from "./cron/cron.js";

dotenv.config();

const app = express();

// This is so the app can handle JSON requests in the body.
app.use(json());

// This is so the app can handle urlencoded forms.
app.use(
    urlencoded({
        extended: true,
    })
);

app.use(
    cors({
        origin: process.env.CORS_URL,
        credentials: true,
    })
);

app.use(
    session({
        secret: "RACUN",
        proxy: true,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: process.env.IS_PROD === "true",
            sameSite: process.env.IS_PROD === "true" ? "none" : false,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

configureAuthModule(app);
configureApiModule(app);

CronJobManager.getInstance();

app.listen(process.env.PORT, () => {
    console.log(`Server listening on ${process.env.PORT}!`);
});
