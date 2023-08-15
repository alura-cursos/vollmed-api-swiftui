import { DataSource } from "typeorm";
import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./src/database/database.sqlite", // caminho para o arquivo do banco de dados SQLite
  synchronize: true,
  logging: false,
  entities: ["./src/**/*.entity.{js,ts}"],
  migrations: [],
  subscribers: [],
});
