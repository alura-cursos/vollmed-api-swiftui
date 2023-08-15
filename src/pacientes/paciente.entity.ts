import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Relation,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { type IAutenticavel } from "../auth/IAutencavel.js";
import { Role } from "../auth/roles.js";
import { encryptPassword } from "../auth/cryptografiaSenha.js";

@Entity()
export class Paciente implements IAutenticavel {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 11 })
  cpf: string;

  @Column("varchar", { length: 100 })
  nome: string;

  @Column("varchar", { length: 100 })
  email: string;

  @Column("varchar", { length: 100, select: false })
  senha: string;

  @Column({ type: "int" })
  telefone: number;

  @Column({ type: "boolean", default: true })
  estaAtivo: boolean;

  @Column({ type: "boolean", default: true })
  possuiPlanoSaude: boolean;

  @Column("varchar", { length: 100, nullable: true })
  planoSaude: string;

  @Column("varchar", { nullable: false })
  role: Role;

  constructor(
    cpf,
    nome,
    email,
    senha: string,
    telefone,
    planoSaude,
    estaAtivo,
  ) {
    this.cpf = cpf;
    this.nome = nome;
    this.email = email;
    this.estaAtivo = estaAtivo;
    this.senha = senha;
    this.telefone = telefone;
    this.planoSaude = planoSaude;
    this.role = Role.paciente;
  }

  @BeforeInsert()
  @BeforeUpdate()
  criptografa() {
    this.senha = encryptPassword(this.senha);
  }
}
