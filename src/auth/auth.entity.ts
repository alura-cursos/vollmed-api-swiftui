import { Role } from "./roles";
import { ViewColumn, ViewEntity } from "typeorm";
import { type IAutenticavel } from "./IAutenticavel";

@ViewEntity({
  expression: `
    SELECT "email", "senha", "id", '/paciente' AS "rota" FROM "paciente"
    UNION ALL
    SELECT "email", "senha", "id", '/especialista' AS "rota" FROM "especialista"
  `,
})
export class Autenticaveis implements IAutenticavel {
  @ViewColumn()
  id: string;

  @ViewColumn()
  email: string;

  @ViewColumn()
  senha: string;

  @ViewColumn()
  rota: string;
}
