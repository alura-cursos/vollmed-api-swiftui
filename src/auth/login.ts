import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { Autenticaveis } from "./auth.entity";

import { AppDataSource } from "../data-source";
import { decryptPassword } from "./cryptografiaSenha";
import { AppError } from "../error/ErrorHandler";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, senha } = req.body;

  const autenticavel = await AppDataSource.manager.findOne(Autenticaveis, {
    select: ["id", "rota", "senha"],
    where: { email },
  });

  if (autenticavel == null) {
    throw new AppError("Não encontrado!", 404);
  } else {
    const { id, rota, senha: senhaAuth } = autenticavel;
    const senhaCorrespondente = decryptPassword(senhaAuth);

    if (senha !== senhaCorrespondente) {
      throw new AppError("Senha incorreta!", 401);
    }

    const token = jwt.sign({ id }, 'secret_token', {
      expiresIn: 3.1536e+7,
    }); // expira em 24 horas

    res.status(200).json({
      auth: true,
      id,
      token,
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ auth: false, token: null });
};
