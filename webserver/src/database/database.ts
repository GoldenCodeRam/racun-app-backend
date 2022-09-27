import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize("racun", "admin", "admin", {
    host: process.env.DATABASE_HOST || "postgres",
    port: parseInt(process.env.DATABASE_PORT as string),
    dialect: "postgres",
});

export async function authenticate() {
    try {
        await sequelize.authenticate();
        console.log("asdf");
    } catch (error) {
        console.error(`Unable to connect to the database: ${error}`);
    }
}

export async function getDatabaseInstance(): Promise<Sequelize> {
    return new Sequelize("racun", "admin", "admin", {
        host: process.env.DATABASE_HOST || "postgres",
        port: parseInt(process.env.DATABASE_PORT as string),
        dialect: "postgres",
    });
}
