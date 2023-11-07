import { Router } from "express";
import {
  especialistas,
  criarEspecialista,
  especialistaById,
  atualizarEspecialista,
  apagarEspecialista,
  atualizaContato,
} from "./especialistaController";
export const especialistaRouter = Router();

especialistaRouter.get("/", especialistas);
especialistaRouter.post("/", criarEspecialista);
especialistaRouter.get("/:id", especialistaById);
especialistaRouter.put("/:id", atualizarEspecialista);
especialistaRouter.delete("/:id", apagarEspecialista);
especialistaRouter.patch("/:id", atualizaContato);

export default (app) => {
  app.use("/especialista", especialistaRouter);
};
