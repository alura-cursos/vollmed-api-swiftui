import { type Request, type Response } from "express";
import { Paciente } from "./paciente.entity.js";
import { AppDataSource } from "../data-source.js";
import { Endereco } from "../enderecos/endereco.entity.js";
import { CPFValido } from "./validacaoCPF.js";
import { Consulta } from "../consultas/consulta.entity.js";
import { AppError, Status } from "../error/ErrorHandler.js";
export const criarPaciente = async (
  req: Request,
  res: Response
): Promise<void> => {
  let {
    cpf,
    nome,
    email,
    senha,
    estaAtivo,
    possuiPlanoSaude,
    endereco,
    telefone,
    planoSaude,
    imagem,
    historico,
  } = req.body;

  if (!CPFValido(cpf)) {
    throw new AppError("CPF Inválido!");
  }

  try {
    const paciente = new Paciente(
      cpf,
      nome,
      email,
      senha,
      telefone,
      planoSaude,
      estaAtivo,
      imagem
    );
    paciente.possuiPlanoSaude = possuiPlanoSaude;
    const enderecoPaciente = new Endereco();

    if (endereco !== undefined) {
      enderecoPaciente.cep = endereco.cep;
      enderecoPaciente.rua = endereco.rua;
      enderecoPaciente.estado = endereco.estado;
      enderecoPaciente.numero = endereco.numero;
      enderecoPaciente.complemento = endereco.complemento;

      paciente.endereco = enderecoPaciente;

      await AppDataSource.manager.save(Endereco, enderecoPaciente);
    }

    await AppDataSource.manager.save(Paciente, paciente);

    res.status(202).json(paciente);
  } catch (error) {
    res.status(502).json({ "Paciente não foi criado": error });
  }
};
export const lerPacientes = async (
  req: Request,
  res: Response
): Promise<void> => {
  const tabelaPaciente = AppDataSource.getRepository(Paciente);
  const allPacientes = await tabelaPaciente.find();

  if (allPacientes.length === 0) {
    res.status(404).json("Não encontramos pacientes!");
  } else {
    res.status(200).json(allPacientes);
  }
};

export const lerPaciente = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const paciente = await AppDataSource.manager.findOne(Paciente, {
    where: { id },
    relations: {
      endereco: true,
    },
  });

  if (paciente === null) {
    res.status(404).json("Paciente não encontrado!");
  } else {
    res.status(200).json(paciente);
  }
};

export const listaConsultasPaciente = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const paciente = await AppDataSource.manager.findOne(Paciente, {
    where: { id },
  });
  if (paciente == null) {
    throw new AppError("Paciente não encontrado!", Status.NOT_FOUND);
  }
  const consultas = await AppDataSource.manager.find(Consulta, {
    where: { paciente: { id: paciente.id } },
  });

  const consultadasTratadas = consultas.map((consulta) => {
    return {
      id: consulta.id,
      data: consulta.data,
      especialista: consulta.especialista,
    };
  });

  return res.json(consultadasTratadas);
};

// update
export const atualizarPaciente = async (
  req: Request,
  res: Response
): Promise<void> => {
  let {
    nome,
    email,
    senha,
    estaAtivo,
    telefone,
    possuiPlanoSaude,
    planoSaude,
    cpf,
    imagem,
    historico,
  } = req.body;

  const { id } = req.params;

  if (!CPFValido(cpf)) {
    throw new AppError("CPF Inválido!", Status.BAD_REQUEST);
  }

  try {
    const paciente = await AppDataSource.manager.findOne(Paciente, {
      where: { id },
      relations: ["endereco"],
    });

    if (paciente === null) {
      res.status(404).json("Paciente não encontrado!");
    } else {
      paciente.cpf = cpf;
      paciente.nome = nome;
      paciente.email = email;
      paciente.possuiPlanoSaude = possuiPlanoSaude;
      paciente.telefone = telefone;
      paciente.planoSaude = planoSaude;
      paciente.estaAtivo = estaAtivo;
      paciente.imagem = imagem;

      await AppDataSource.manager.save(Paciente, paciente);
      res.status(200).json(paciente);
    }
  } catch (error) {
    res.status(502).json("Paciente não foi atualizado!");
  }
};

export const atualizarEnderecoPaciente = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { cep, rua, numero, estado, complemento } = req.body;
  const paciente = await AppDataSource.manager.findOne(Paciente, {
    where: { id },
    relations: ["endereco"],
  });

  if (paciente === null) {
    res.status(404).json("Paciente não encontrado!");
  } else {
    if (paciente.endereco === null) {
      const endereco = new Endereco();
      endereco.cep = cep;
      endereco.rua = rua;
      endereco.estado = estado;
      endereco.numero = numero;
      endereco.complemento = complemento;

      paciente.endereco = endereco;

      await AppDataSource.manager.save(Endereco, endereco);
    } else {
      paciente.endereco.cep = cep;
      paciente.endereco.rua = rua;
      paciente.endereco.estado = estado;
      paciente.endereco.numero = numero;
      paciente.endereco.complemento = complemento;
    }

    await AppDataSource.manager.save(Paciente, paciente);

    res.status(200).json(paciente);
  }
};

// Não deleta o paciente, fica inativo
export const desativaPaciente = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const paciente = await AppDataSource.manager.findOne(Paciente, {
    where: { id },
  });
  if (paciente !== null) {
    paciente.estaAtivo = false;
    res.json({
      message: "Paciente desativado!",
    });
  }
};
