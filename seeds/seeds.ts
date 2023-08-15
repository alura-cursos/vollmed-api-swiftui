import { AppDataSource } from "../src/data-source.js";
import { seedEspecialistas } from "./especialistas.seed.js";
import { seedPacientes } from "./pacientes.seed.js";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

AppDataSource.initialize()
  .then(async () => {
    console.log("App Data Source inicializado");
    await seedEspecialistas();
    await seedPacientes();
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
