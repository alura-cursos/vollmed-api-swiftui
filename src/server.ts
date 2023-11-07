import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import "express-async-errors";
import "reflect-metadata";
import rotaAuth from "./auth/authRoutes";
import rotaConsulta from "./consultas/consultaRoutes";
import { AppDataSource } from "./data-source";
import rotaEspecialista from "./especialistas/especialistaRoutes";
import rotaPaciente from "./pacientes/pacienteRoutes";
import errorMiddleware from "./error/errorMiddleware";

dotenv.config({ path: ".env" });

const PORT = 3000;
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
