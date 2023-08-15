import { Router } from "express";
import {
  lerPacientes,
  criarPaciente,
  lerPaciente,
  atualizarPaciente,
  desativaPaciente,
  atualizarEnderecoPaciente,
  listaConsultasPaciente,
} from "./pacienteController.js";

export const pacienteRouter = Router();

pacienteRouter.get("/", lerPacientes);
pacienteRouter.post("/", criarPaciente);
pacienteRouter.get("/:id", lerPaciente);
pacienteRouter.get("/:id/consultas", listaConsultasPaciente);
pacienteRouter.put("/:id", atualizarPaciente);
pacienteRouter.delete("/:id", desativaPaciente);
pacienteRouter.patch("/:id", atualizarEnderecoPaciente);
export default (app) => {
  app.use("/paciente", pacienteRouter);
};
