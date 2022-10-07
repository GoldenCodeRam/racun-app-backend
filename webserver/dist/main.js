import express, { json, urlencoded } from "express";
import dotenv from "dotenv";
import { configureAuthModule } from "./routes/auth.js";
import passport from "passport";
import session from "express-session";
import cors from "cors";
dotenv.config();
var app = express();
// This is so the app can handle JSON requests in the body.
app.use(json());
// This is so the app can handle urlencoded forms.
app.use(urlencoded({
    extended: true
}));
app.use(cors({
    origin: "http://localhost:4200",
    credentials: true
}));
app.use(session({
    secret: 'RACUN',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
configureAuthModule(app);
app.listen(process.env.SERVER_PORT, function () {
    console.log("Server listening on ".concat(process.env.SERVER_PORT));
});
//# sourceMappingURL=main.js.map