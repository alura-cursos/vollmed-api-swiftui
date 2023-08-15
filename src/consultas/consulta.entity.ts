import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Especialista } from "../especialistas/Especialista.entity.js";
import { Paciente } from "../pacientes/paciente.entity.js";


enum MotivoCancelamento {
  paciente_desistiu,
  médico_cancelou,
  outros,
}

@Entity()
export class Consulta {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Especialista, { eager: true })
  // @JoinColumn({ name: 'especialista_id' })
  especialista: Especialista;

  @ManyToOne(() => Paciente, { eager: true })
  // @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column({ type: "datetime", nullable: true })
  data: Date;

  @Column({ name: "motivo_cancelamento", nullable: true })
  motivoCancelamento: string;

  cancelar(motivo: string): void {
    this.motivoCancelamento = motivo;
  }
}
