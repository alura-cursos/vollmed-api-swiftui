import { Router } from "express";
import {
  lerPacientes,
  criarPaciente,
  lerPaciente,
  atualizarPaciente,
  desativaPaciente,
  listaConsultasPaciente,
} from "./pacienteController";
import { verificaTokenJWT } from "../auth/verificaTokenJWT";
import { Role } from "../auth/roles";

export const pacienteRouter = Router();

pacienteRouter.get("/", lerPacientes);
pacienteRouter.post("/", criarPaciente);
pacienteRouter.get("/:id", verificaTokenJWT(Role.paciente), lerPaciente);
pacienteRouter.get("/:id/consultas", verificaTokenJWT(Role.paciente), listaConsultasPaciente);
pacienteRouter.put("/:id", atualizarPaciente);
pacienteRouter.delete("/:id", desativaPaciente);
export default (app) => {
  app.use("/paciente", pacienteRouter);
};
