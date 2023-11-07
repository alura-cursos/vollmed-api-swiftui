import { Between } from "typeorm";
import { AppDataSource } from "../data-source";
import { Especialista } from "../especialistas/Especialista.entity";
import { Paciente } from "../pacientes/paciente.entity";
import { Consulta } from "./consulta.entity";

const horarioInicioDaClinica: number = 7;
const horarioFechamentoDaClinica: number = 19;

const adjustForTimezone = (date: Date): Date => {
  const dataObj = new Date(date);

  const timezoneOffset = dataObj.getTimezoneOffset() * 60000;

  dataObj.setTime(dataObj.getTime() + timezoneOffset);

  return dataObj;
};

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
  const dataObj = new Date(data);

  const diaDaSemana = diasDaSemana[dataObj.getDay()];
  const hora = dataObj.getHours();

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
  const agora = new Date();
  const horarioDaConsulta = new Date(horario);

  const timeOffset = agora.setMinutes(agora.getMinutes() + antecedencia_minima);

  return horarioDaConsulta.getTime() > timeOffset;
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
