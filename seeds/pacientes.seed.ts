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
        estaAtivo: true,
        possuiPlanoSaude: true,
        planoSaude: "Unimed",
        imagem: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
      },
    ];

    for (const dados of pacientes) {
      const entidade = AppDataSource.manager.create(Paciente, dados);
      await AppDataSource.manager.save(entidade);
      console.log(`Paciente "${dados.nome}" criado com sucesso.`);
    }
    console.log("---- /n Seed pacientes concluído com sucesso.");
  } catch (error) {
    console.error("Erro ao executar o seed:", error);
  }
};
