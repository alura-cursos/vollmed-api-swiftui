import { type Request, type Response } from "express";
import { AppDataSource } from "../data-source";
import { Consulta } from "./consulta.entity";
import {
  validaAntecedenciaMinima,
  validaClinicaEstaAberta,
  pacienteEstaDisponivel,
  especialistaEstaDisponivel,
} from "./consultaValidacoes";
import { AppError, Status } from "../error/ErrorHandler";

export const criaConsulta = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { especialista, paciente, data } = req.body;

  if (!validaClinicaEstaAberta(data)) {
    throw new AppError("A clinica não está aberta nesse horário");
  }

  if (!validaAntecedenciaMinima(data, 30)) {
    throw new AppError(
      "A consulta deve ser agendada com 30 minutos de antecedência",
      Status.BAD_REQUEST
    );
  }

  if (!(await pacienteEstaDisponivel(paciente, data))) {
    throw new AppError(
      "Paciente não está disponível nesse horário",
      Status.BAD_REQUEST
    );
  }

  if (!(await especialistaEstaDisponivel(especialista, data))) {
    throw new AppError(
      "Especialista não está disponível nesse horário",
      Status.BAD_REQUEST
    );
  }

  const consulta = new Consulta();

  consulta.especialista = especialista;
  consulta.paciente = paciente;
  consulta.data = data;

  await AppDataSource.manager.save(Consulta, consulta);
  return res.json(consulta);
};

export const listaConsultas = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const consultas = await AppDataSource.manager.find(Consulta);

  return res.json(consultas);
};

//! Não devolve resposta ao cliente, caso não encontre a consulta
export const buscaConsultaPorId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const consulta = await AppDataSource.manager.findOne(Consulta, {
    where: { id },
    relations: ["paciente", "especialista"],
  });

  if (consulta !== null) {
    res.json(consulta);
  } else {
    throw new AppError("Consulta não encontrada", Status.BAD_REQUEST);
  }
};

export const deletaConsulta = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { motivo_cancelamento } = req.body;
  const consulta = await AppDataSource.manager.findOne(Consulta, {
    where: { id },
  });

  if (consulta == null) {
    throw new AppError("Consulta não encontrada");
  }

  const HORA = 60 * 24;
  //console.log(validaAntecedenciaMinima(consulta.data, HORA))
  if (!validaAntecedenciaMinima(consulta.data, HORA)) {
    throw new AppError(
      "A consulta deve ser desmarcada com 1 dia de antecedência",
      Status.BAD_REQUEST
    );
  }

  consulta.cancelar = motivo_cancelamento;

  await AppDataSource.manager.delete(Consulta, { id });
  res.json("Consulta cancelada com sucesso");
};

export const atualizaHorarioConsulta = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { data: novaData } = req.body;
  const consulta = await AppDataSource.manager.findOne(Consulta, {
    where: { id },
  });

  if (consulta == null) {
    throw new AppError("Consulta não encontrada");
  }

  if (!validaClinicaEstaAberta(novaData)) {
    throw new AppError("A clinica não está aberta nesse horário");
  }

  if (!validaAntecedenciaMinima(novaData, 30)) {
    throw new AppError(
      "A consulta deve ser agendada com 30 minutos de antecedência",
      Status.BAD_REQUEST
    );
  }

  consulta.data = novaData;

  await AppDataSource.manager.save(Consulta, consulta);
  res.json({
    especialista: consulta.especialista.id,
    paciente: consulta.paciente.id,
    data: consulta.data,
    motivoCancelamento: consulta.motivoCancelamento,
    id: consulta.id,
  });
};
