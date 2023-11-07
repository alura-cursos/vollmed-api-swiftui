/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import jwt from "jsonwebtoken";
import { type Role } from "./roles";
import { AppError, Status } from "../error/ErrorHandler";

export function verificaTokenJWT(...role: Role[]) {
  return (req, res, next): any => {
    if (!req.headers.authorization) {
      throw new AppError("Nenhum token informado.", Status.BAD_REQUEST);
    }

    const tokenString: string[] = req.headers.authorization.split(" ");
    const token = tokenString[1];

    // Nenhuma token informado
    if (!token) {
      return res
        .status(403)
        .json({ auth: false, message: "Nenhum token informado." });
    }

    // Verifica se o token é válido
    jwt.verify(token, "secret_token", function (err, decoded) {
      if (err) {
        return res
          .status(403)
          .json({ auth: false, message: "Falha ao autenticar o token." });
      }

      req.userId = decoded.id
      next()
    })
  }
}
