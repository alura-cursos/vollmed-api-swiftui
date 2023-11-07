import { type Request, type Response } from "express";
import { AppDataSource } from "../data-source";
import { Especialista } from "./Especialista.entity";
import { AppError } from "../error/ErrorHandler";
import { encryptPassword } from "../auth/cryptografiaSenha";

// Get All
export const especialistas = async (
  req: Request,
  res: Response
): Promise<void> => {
  const allEspecialistas = await AppDataSource.manager.find(Especialista);
  if (allEspecialistas.length > 0) {
    res.status(200).json(allEspecialistas);
  } else {
    throw new AppError("Não encontramos especialistas");
  }
};
// Post
// Se o especialista for criado apenas com os atributos opcionais, enviar mensagem avisando quais campos faltam

export const criarEspecialista = async (
  req: Request,
  res: Response
): Promise<void> => {
  const requestBody = req.body;

  if (Array.isArray(requestBody)) {
    // Se o corpo for um array, trata como múltiplos especialistas
    const createdEspecialistas: Especialista[] = [];

    for (const especialistaData of requestBody) {
      const { nome, crm, imagem, especialidade, email, telefone, senha } =
        especialistaData;

      const especialista = new Especialista(
        nome,
        crm,
        imagem,
        especialidade,
        email,
        telefone,
        senha
      );

      try {
        await AppDataSource.manager.save(Especialista, especialista);
        createdEspecialistas.push(especialista);
      } catch (error) {
        if (
          (await AppDataSource.manager.findOne(Especialista, {
            where: { crm },
          })) != null
        ) {
          res.status(422).json({ message: `Crm ${crm} já cadastrado` });
        } else {
          throw new AppError("Especialista não foi criado");
        }
      }
    }

    res.status(200).json(createdEspecialistas);
  } else {
    // Se o corpo for um objeto, trata como um único especialista
    const { nome, crm, imagem, especialidade, email, telefone, senha } =
      requestBody;

    const especialista = new Especialista(
      nome,
      crm,
      imagem,
      especialidade,
      email,
      telefone,
      senha
    );

    try {
      await AppDataSource.manager.save(Especialista, especialista);
      res.status(200).json(especialista);
    } catch (error) {
      if (
        (await AppDataSource.manager.findOne(Especialista, {
          where: { crm },
        })) != null
      ) {
        res.status(422).json({ message: "Crm já cadastrado" });
      } else {
        throw new AppError("Especialista não foi criado");
      }
    }
  }
};

// Get By Id
export const especialistaById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const especialista = await AppDataSource.manager.findOneBy(Especialista, {
    id,
  });

  if (especialista !== null) {
    res.status(200).json(especialista);
  } else {
    throw new AppError("Id não encontrado ");
  }
};

// Put especialista/:id
export const atualizarEspecialista = async (
  req: Request,
  res: Response
): Promise<void> => {
  let { nome, crm, imagem, especialidade, email, telefone, senha } = req.body;
  const { id } = req.params;

  const especialistaUpdate = await AppDataSource.manager.findOneBy(
    Especialista,
    {
      id,
    }
  );
  if (especialistaUpdate !== null) {
    especialistaUpdate.nome = nome;
    especialistaUpdate.crm = crm;
    especialistaUpdate.imagem = imagem;
    especialistaUpdate.especialidade = especialidade;
    especialistaUpdate.email = email;
    especialistaUpdate.telefone = telefone;
    especialistaUpdate.senha = senha;

    await AppDataSource.manager.save(Especialista, especialistaUpdate);
    res.json(especialistaUpdate);
  } else {
    throw new AppError("Id não encontrado ");
  }
};

// Delete por id especialista/:id
export const apagarEspecialista = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const especialistaDel = await AppDataSource.manager.findOneBy(Especialista, {
    id,
  });
  if (especialistaDel !== null) {
    await AppDataSource.manager.remove(Especialista, especialistaDel);
    res.json({ message: "Especialista apagado!" });
  } else {
    throw new AppError("Id não encontrado");
  }
};

// patch
export const atualizaContato = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const buscaEspecialista = await AppDataSource.manager.findOneBy(
    Especialista,
    { id }
  );
  const telefone = req.body.telefone;

  if (buscaEspecialista !== null) {
    buscaEspecialista.telefone = telefone;
    await AppDataSource.createQueryBuilder()
      .update(Especialista, buscaEspecialista)
      .where(buscaEspecialista.telefone)
      .set({ telefone })
      .execute();
    res.status(200).json(buscaEspecialista);
  } else {
    throw new AppError("Telefone não atualizado");
  }
};
