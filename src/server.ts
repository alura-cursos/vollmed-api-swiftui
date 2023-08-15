import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import "express-async-errors";
import "reflect-metadata";
import rotaAuth from "./auth/authRoutes.js";
import rotaConsulta from "./consultas/consultaRoutes.js";
import { AppDataSource } from "./data-source.js";
import rotaEspecialista from "./especialistas/especialistaRoutes.js";
import rotaPaciente from "./pacientes/pacienteRoutes.js";
import errorMiddleware from "./error/errorMiddleware.js";

dotenv.config({ path: ".env" });

const PORT = process.env.SERVER_PORT || 3000;
const app = express();

const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("App Data Source inicializado");
  })
  .catch((error) => {
    console.error(error);
  });

rotaPaciente(app);
rotaEspecialista(app);
rotaConsulta(app);
rotaAuth(app);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

export default app;
