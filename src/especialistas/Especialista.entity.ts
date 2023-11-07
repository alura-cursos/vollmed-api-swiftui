import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { type IAutenticavel } from "../auth/IAutenticavel";
import { Role } from "../auth/roles";
import { encryptPassword } from "../auth/cryptografiaSenha";

@Entity()
export class Especialista implements IAutenticavel {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 100 })
  nome: string;

  @Column("varchar", { length: 100 })
  crm: string;

  @Column("varchar")
  imagem: string;

  @Column("varchar", { length: 100 })
  especialidade: string;

  @Column("varchar", { length: 100, nullable: true })
  email: string;

  @Column("varchar", { length: 100, select: false })
  senha: string; // Criptografia?

  @Column("varchar", { nullable: true })
  telefone: string;

  constructor(nome, crm, imagem, especialidade, email, telefone, senha) {
    this.nome = nome;
    this.crm = crm;
    this.imagem = imagem;
    this.especialidade = especialidade;
    this.email = email;
    this.telefone = telefone;
    this.senha = senha;
  }
  @BeforeInsert()
  @BeforeUpdate()
  criptografa() {
    this.senha = encryptPassword(this.senha);
  }
}
