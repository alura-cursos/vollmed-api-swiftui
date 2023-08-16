import { AppDataSource } from "../src/data-source.js";
import { Especialista } from "../src/especialistas/Especialista.entity.js";

export const seedEspecialistas = async () => {
  try {
    // Exemplo de criação de planos de saúde iniciais
    const especialistas = [
      {
        nome: "Dr. João da Silva",
        crm: "12345",
        imagem: "https://images.unsplash.com/photo-1637059824899-a441006a6875?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=752&q=80",
        estaAtivo: true,
        especialidade: "Cardiologia",
        email: "joao.silva@example.com",
        telefone: "(11) 99999-9999",
        role: "especialista",
        senha: "senha123",
      },
      {
        nome: "Dra. Maria Souza",
        crm: "67890",
        imagem: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        estaAtivo: true,
        especialidade: "Ginecologia",
        email: "maria.souza@example.com",
        telefone: "(21) 88888-8888",
        role: "especialista",
        senha: "senha456",
      },
      {
        nome: "Dr. Pedro Oliveira",
        crm: "54321",
        imagem: "https://images.unsplash.com/photo-1622253694242-abeb37a33e97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=765&q=80",
        estaAtivo: true,
        especialidade: "Cardiologia",
        email: "pedro.oliveira@example.com",
        telefone: "(11) 77777-7777",
        role: "especialista",
        senha: "senha123",
      },
      {
        nome: "Dra. Andréia Rodrigues",
        crm: "98765",
        imagem: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        estaAtivo: true,
        especialidade: "Pediatria",
        email: "andreia.rodrigues@example.com",
        telefone: "(31) 99999-9999",
        role: "especialista",
        senha: "senha789",
      },
      {
        nome: "Dr. Rafael Silva",
        crm: "24680",
        imagem: "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        estaAtivo: true,
        especialidade: "Ortopedia",
        email: "rafael.silva@example.com",
        telefone: "(41) 66666-6666",
        role: "especialista",
        senha: "senha246",
      }
    ];

    for (const dados of especialistas) {
      const entidade = AppDataSource.manager.create(Especialista, dados);
      await AppDataSource.manager.save(entidade);
      console.log(`Especialista "${dados.nome}" criado com sucesso.`);
    }

    console.log("------ /n Seed Especialistas concluído com sucesso.");
  } catch (error) {
    console.error("Erro ao executar o seed:", error);
  }
};