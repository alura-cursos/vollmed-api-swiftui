/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import {
  atualizaHorarioConsulta,
  buscaConsultaPorId,
  criaConsulta,
  deletaConsulta,
  listaConsultas,
} from "./consultaController";
import errorMiddleware from "../error/errorMiddleware";

export const consultaRouter = Router();
consultaRouter.post("/", criaConsulta);
consultaRouter.get("/", listaConsultas);
consultaRouter.get("/:id", buscaConsultaPorId);
consultaRouter.patch("/:id", atualizaHorarioConsulta);
consultaRouter.delete("/:id", deletaConsulta);

export default (app) => {
  app.use("/consulta", consultaRouter);
};
