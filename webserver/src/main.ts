import express, { json, urlencoded } from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import cors from "cors";

import { configureApiModule } from "./routes/apis.js";
import { configureAuthModule } from "./routes/auth.js";

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
        origin: "http://localhost:4200",
        credentials: true,
    })
);

app.use(
    session({
        secret: "RACUN",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

configureAuthModule(app);
configureApiModule(app);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening on ${process.env.PORT}`);
});
