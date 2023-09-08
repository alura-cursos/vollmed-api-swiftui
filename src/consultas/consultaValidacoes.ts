import { Between } from "typeorm";
import { AppDataSource } from "../data-source.js";
import { Especialista } from "../especialistas/Especialista.entity.js";
import { Paciente } from "../pacientes/paciente.entity.js";
import { Consulta } from "./consulta.entity.js";

const horarioInicioDaClinica: number = 7;
const horarioFechamentoDaClinica: number = 19;

const validaClinicaEstaAberta = (data: Date): boolean => {
  const diasDaSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  console.log(`daaaata ${data}`)
  const dataObj = new Date(data);
  console.log(`daata ${dataObj}`)
  const diaDaSemana = diasDaSemana[dataObj.getDay()];
  const hora = dataObj.getHours();
  
  console.log(diaDaSemana, hora);

  return (
    diaDaSemana !== "Domingo" &&
    hora >= horarioInicioDaClinica &&
    hora < horarioFechamentoDaClinica
  );
};

// export const validaDuracaoConsulta = async (tempoInicio: Date, tempoFim: Date): Promise<boolean> => {
//   const duracaoConsulta = 60 * 60 * 1000 // 1 HORA DE DURACAO
//   return tempoFim.getTime() - tempoInicio.getTime() === duracaoConsulta
// }

const validaAntecedenciaMinima = (
  horario: Date,
  antecedencia_minima
): boolean => {
  const agora = new Date().getTime(); // Pegar tempo em milissegundos
  const horarioDaConsulta = new Date(horario).getTime(); // Converter horário da consulta para milissegundos
  
  const limiteParaCancelar = horarioDaConsulta - antecedencia_minima * 1000; // Subtrair antecedência mínima em milissegundos
  
  console.log(agora, horarioDaConsulta, limiteParaCancelar)
  
  return agora < limiteParaCancelar; // Verificar se o horário atual é anterior ao limite para cancelar
};

const pacienteEstaDisponivel = async (
  pacienteId: string,
  tempoDaData: Date
): Promise<boolean> => {
  const dataObj = new Date(tempoDaData);
  const consultations = await AppDataSource.manager.find(Consulta, {
    where: {
      paciente: { id: pacienteId },
      data: Between(
        new Date(
          dataObj.getFullYear(),
          dataObj.getMonth(),
          dataObj.getDate(),
          0,
          0,
          0
        ),
        new Date(
          dataObj.getFullYear(),
          dataObj.getMonth(),
          dataObj.getDate(),
          23,
          59,
          59
        )
      ),
    },
  });
  return consultations.length === 0;
};

const especialistaEstaDisponivel = async (
  especialistaId: string,
  tempoDaData: Date
): Promise<boolean> => {
  const dataObj = new Date(tempoDaData);
  const consultations = await AppDataSource.manager.find(Consulta, {
    where: {
      especialista: { id: especialistaId },
      data: Between(
        new Date(
          dataObj.getFullYear(),
          dataObj.getMonth(),
          dataObj.getDate(),
          0,
          0,
          0
        ),
        new Date(
          dataObj.getFullYear(),
          dataObj.getMonth(),
          dataObj.getDate(),
          23,
          59,
          59
        )
      ),
    },
  });

  return consultations.length === 0;
};

export {
  validaClinicaEstaAberta,
  validaAntecedenciaMinima,
  pacienteEstaDisponivel,
  especialistaEstaDisponivel,
};
