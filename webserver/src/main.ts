import express from "express";
import dotenv from "dotenv";

import { authenticate } from "./database/database.js";
import { Client } from "./database/models/Client.js";

dotenv.config();

const app = express();

app.get("/", async (request, response) => {
    response.send("Henlo");
    await authenticate();
    await Client.sync();
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening on ${process.env.SERVER_PORT}`);
});
