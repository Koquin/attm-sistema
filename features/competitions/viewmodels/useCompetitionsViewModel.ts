import { Competition } from "../types";

export type CompetitionsViewModel = {
  competitions: Competition[];
};

export function useCompetitionsViewModel(): CompetitionsViewModel {
  return {
    competitions: [
      {
        id: 1,
        name: "Circuito Teresina Open 2026",
        category: "aberto",
        modality: "1x1",
        status: "em andamento",
        location: "Ginasio Central",
        date: "12/06/2026",
      },
      {
        id: 2,
        name: "Copa Master 50+",
        category: "50+",
        modality: "1x1",
        status: "aguardando",
        location: "Clube Lago Norte",
        date: "28/06/2026",
      },
      {
        id: 3,
        name: "Festival Feminino de Duplas",
        category: "feminino",
        modality: "2x2",
        status: "finalizado",
        location: "Arena Teresina",
        date: "18/05/2026",
      },
      {
        id: 4,
        name: "Torneio Sub-21",
        category: "sub-21",
        modality: "1x1",
        status: "finalizado",
        location: "Centro Esportivo Sul",
        date: "02/05/2026",
      },
      {
        id: 5,
        name: "Desafio Elite por Equipes",
        category: "master",
        modality: "2x2",
        status: "em andamento",
        location: "Clube Teresina",
        date: "22/06/2026",
      },
    ],
  };
}
