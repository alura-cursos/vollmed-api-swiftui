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
import { type IAutenticavel } from "../auth/IAutenticavel";
import { Role } from "../auth/roles";
import { encryptPassword } from "../auth/cryptografiaSenha";

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

  @Column("varchar", { length: 100, nullable: true })
  planoSaude: string;

  constructor(cpf, nome, email, senha: string, telefone, planoSaude) {
    this.cpf = cpf;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.telefone = telefone;
    this.planoSaude = planoSaude;
  }

  @BeforeInsert()
  @BeforeUpdate()
  criptografa() {
    this.senha = encryptPassword(this.senha);
  }
}
