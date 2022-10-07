import express, { json, urlencoded } from "express";
import dotenv from "dotenv";
import { configureAuthModule } from "./routes/auth.js";
import passport from "passport";
import session from "express-session";
import cors from "cors";

dotenv.config();

const app = express();

// This is so the app can handle JSON requests in the body.
app.use(json());
// This is so the app can handle urlencoded forms.
app.use(urlencoded({
    extended: true,
}));

app.use(cors());

app.use(
    session({
        secret: 'RACUN',
        resave: false,
        saveUninitialized: true,
    })
);

configureAuthModule(app);

app.use(passport.initialize());
app.use(passport.session());

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening on ${process.env.SERVER_PORT}`);
});
