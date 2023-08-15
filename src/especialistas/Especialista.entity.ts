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
import { Endereco } from "../enderecos/endereco.entity.js";
import { type IAutenticavel } from "../auth/IAutencavel.js";
import { Role } from "../auth/roles.js";
import { encryptPassword } from "../auth/cryptografiaSenha.js";

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

  @Column({ type: "boolean", default: true })
  estaAtivo: boolean;

  @Column("varchar", { length: 100 })
  especialidade: string;

  @Column("varchar", { length: 100, nullable: true })
  email: string;

  @Column("varchar", { length: 100, select: false })
  senha: string; // Criptografia?

  @Column("varchar", { nullable: true })
  telefone: string;

  @OneToOne(() => Endereco, {
    cascade: ["update"],
  })
  @JoinColumn({ referencedColumnName: "id" })
  endereco: Relation<Endereco>;

  @Column("varchar", { nullable: false })
  role: Role;

  constructor(
    nome,
    crm,
    imagem,
    estaAtivo,
    especialidade,
    email,
    telefone,
    senha
  ) {
    this.nome = nome;
    this.crm = crm;
    this.imagem = imagem;
    this.estaAtivo = estaAtivo;
    this.especialidade = especialidade;
    this.email = email;
    this.telefone = telefone;
    this.senha = senha;
    this.role = Role.especialista;
  }
  @BeforeInsert()
  @BeforeUpdate()
  criptografa() {
    this.senha = encryptPassword(this.senha);
  }
}
