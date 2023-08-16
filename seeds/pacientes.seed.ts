import { AppDataSource } from "../src/data-source.js";
import { Paciente } from "../src/pacientes/paciente.entity.js";

export const seedPacientes = async () => {
  try {
    // Exemplo de criação de planos de saúde iniciais
    const pacientes = [
      {
        cpf: "12345678901",
        nome: "João da Silva",
        email: "joao.silva@example.com",
        senha: "senha123",
        telefone: 11999999999,
        planoSaude: "Unimed",
      },
    ];

    for (const dados of pacientes) {
      const entidade = AppDataSource.manager.create(Paciente, dados);
      const pacienteSalvo = await AppDataSource.manager.save(entidade);
      console.log(`Paciente "${dados.nome}" criado com sucesso.`);
    }
    console.log("---- /n Seed pacientes concluído com sucesso.");
  } catch (error) {
    console.error("Erro ao executar o seed:", error);
  }
};
