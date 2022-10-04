import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/", async (request, response) => {
    response.send("Henlo");
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening on ${process.env.SERVER_PORT}`);
});
