import dotenv from "dotenv";
dotenv.config();

export const isDevelopment = process.env.ENVIRONMENT === "development";