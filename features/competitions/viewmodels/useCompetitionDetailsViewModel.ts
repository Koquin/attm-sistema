import {
  Competition,
  CompetitionDetails,
  BracketMatch,
} from "../types";

const bracketTemplate: BracketMatch[] = [
  {
    id: 1,
    name: "Quartas 1",
    nextMatchId: 3,
    tournamentRoundText: "Quartas",
    startTime: "2026-06-11",
    state: "DONE",
    participants: [
      {
        id: "p2",
        name: "Bruno Alves",
        resultText: "2",
        isWinner: true,
        status: "PLAYED",
      },
      {
        id: "p5",
        name: "Fabio Lima",
        resultText: "1",
        isWinner: false,
        status: "PLAYED",
      },
    ],
  },
  {
    id: 2,
    name: "Quartas 2",
    nextMatchId: 4,
    tournamentRoundText: "Quartas",
    startTime: "2026-06-11",
    state: "DONE",
    participants: [
      {
        id: "p3",
        name: "Carla Souza",
        resultText: "2",
        isWinner: true,
        status: "PLAYED",
      },
      {
        id: "p4",
        name: "Davi Rocha",
        resultText: "0",
        isWinner: false,
        status: "PLAYED",
      },
    ],
  },
  {
    id: 3,
    name: "Semifinal 1",
    nextMatchId: 5,
    tournamentRoundText: "Semifinal",
    startTime: "2026-06-12",
    state: "SCHEDULED",
    participants: [
      {
        id: "p1",
        name: "Ana Costa",
        status: "READY",
      },
      {
        id: "p2",
        name: "Bruno Alves",
        status: "READY",
      },
    ],
  },
  {
    id: 4,
    name: "Semifinal 2",
    nextMatchId: 5,
    tournamentRoundText: "Semifinal",
    startTime: "2026-06-12",
    state: "SCHEDULED",
    participants: [
      {
        id: "p6",
        name: "Elaine Dias",
        status: "READY",
      },
      {
        id: "p3",
        name: "Carla Souza",
        status: "READY",
      },
    ],
  },
  {
    id: 5,
    name: "Final",
    nextMatchId: null,
    tournamentRoundText: "Final",
    startTime: "2026-06-13",
    state: "SCHEDULED",
    participants: [
      {
        id: "p1",
        name: "Ana Costa",
        status: "READY",
      },
      {
        id: "p6",
        name: "Elaine Dias",
        status: "READY",
      },
    ],
  },
];

const competitionsIndex: Competition[] = [
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
];

const detailsById: Record<number, CompetitionDetails> = {
  1: {
    about:
      "Etapa aberta do circuito com foco em atletas locais e convidados de outros estados.",
    athletes: [
      { name: "Ana Costa", age: 23, club: "CTM Zona Norte", status: "confirmada" },
      { name: "Bruno Alves", age: 27, club: "CTM Centro", status: "confirmada" },
      { name: "Carla Souza", age: 21, club: "CTM Leste", status: "pendente" },
      { name: "Davi Rocha", age: 29, club: "CTM Sul", status: "confirmada" },
      { name: "Elaine Dias", age: 24, club: "CTM Norte", status: "confirmada" },
      { name: "Fabio Lima", age: 26, club: "CTM Oeste", status: "pendente" },
    ],
    groupMatches: [
      {
        id: "g1",
        group: "Grupo A",
        home: "Ana Costa",
        away: "Bruno Alves",
        status: "finalizado",
        scheduledAt: "12/06/2026 09:00",
      },
      {
        id: "g2",
        group: "Grupo A",
        home: "Carla Souza",
        away: "Davi Rocha",
        status: "em andamento",
        scheduledAt: "12/06/2026 10:30",
      },
      {
        id: "g3",
        group: "Grupo B",
        home: "Elaine Dias",
        away: "Fabio Lima",
        status: "aguardando",
        scheduledAt: "12/06/2026 11:30",
      },
    ],
    bracketMatches: bracketTemplate,
    games: [
      {
        id: "m1",
        round: "Grupo A",
        home: "Ana Costa",
        away: "Bruno Alves",
        sets: [
          { home: 11, away: 8 },
          { home: 9, away: 11 },
          { home: 11, away: 7 },
        ],
      },
      {
        id: "m2",
        round: "Grupo A",
        home: "Carla Souza",
        away: "Davi Rocha",
        sets: [
          { home: 10, away: 12 },
          { home: 11, away: 9 },
          { home: 8, away: 11 },
        ],
      },
      {
        id: "m7",
        round: "Final",
        home: "Ana Costa",
        away: "Davi Rocha",
        sets: [
          { home: 11, away: 7 },
          { home: 9, away: 11 },
          { home: 11, away: 9 },
        ],
      },
    ],
  },
  2: {
    about: "Competicao exclusiva para atletas acima de 50 anos.",
    athletes: [
      { name: "Gilberto Nunes", age: 54, club: "CTM Norte", status: "confirmada" },
      { name: "Helio Castro", age: 58, club: "CTM Sul", status: "pendente" },
      { name: "Ivo Martins", age: 52, club: "CTM Centro", status: "confirmada" },
      { name: "Joao Pereira", age: 56, club: "CTM Leste", status: "confirmada" },
      { name: "Leo Matos", age: 51, club: "CTM Oeste", status: "confirmada" },
    ],
    groupMatches: [
      {
        id: "g4",
        group: "Grupo Unico",
        home: "Gilberto Nunes",
        away: "Ivo Martins",
        status: "aguardando",
        scheduledAt: "28/06/2026 09:00",
      },
      {
        id: "g5",
        group: "Grupo Unico",
        home: "Joao Pereira",
        away: "Leo Matos",
        status: "aguardando",
        scheduledAt: "28/06/2026 10:00",
      },
    ],
    bracketMatches: bracketTemplate,
    games: [
      {
        id: "m3",
        round: "Agenda",
        home: "Gilberto Nunes",
        away: "Ivo Martins",
        sets: [
          { home: 0, away: 0 },
          { home: 0, away: 0 },
          { home: 0, away: 0 },
        ],
      },
    ],
  },
  3: {
    about: "Festival de duplas femininas com formato eliminatorio.",
    athletes: [
      { name: "Marina Lopes", age: 27, club: "CTM Norte", status: "confirmada" },
      { name: "Nina Barros", age: 25, club: "CTM Centro", status: "confirmada" },
      { name: "Olivia Reis", age: 29, club: "CTM Sul", status: "confirmada" },
      { name: "Paula Araujo", age: 26, club: "CTM Leste", status: "confirmada" },
    ],
    groupMatches: [
      {
        id: "g6",
        group: "Grupo A",
        home: "Marina/Nina",
        away: "Olivia/Paula",
        status: "finalizado",
        scheduledAt: "18/05/2026 09:30",
      },
    ],
    bracketMatches: bracketTemplate,
    games: [
      {
        id: "m4",
        round: "Final",
        home: "Marina/Nina",
        away: "Olivia/Paula",
        sets: [
          { home: 11, away: 6 },
          { home: 11, away: 9 },
          { home: 8, away: 11 },
        ],
      },
    ],
  },
  4: {
    about: "Categoria de base com atletas ate 21 anos.",
    athletes: [
      { name: "Rafa Silva", age: 19, club: "CTM Centro", status: "confirmada" },
      { name: "Sara Freitas", age: 18, club: "CTM Norte", status: "confirmada" },
      { name: "Tania Melo", age: 20, club: "CTM Leste", status: "pendente" },
      { name: "Ulisses Ramos", age: 20, club: "CTM Sul", status: "confirmada" },
    ],
    groupMatches: [
      {
        id: "g7",
        group: "Grupo A",
        home: "Rafa Silva",
        away: "Sara Freitas",
        status: "finalizado",
        scheduledAt: "02/05/2026 09:00",
      },
      {
        id: "g8",
        group: "Grupo A",
        home: "Tania Melo",
        away: "Ulisses Ramos",
        status: "finalizado",
        scheduledAt: "02/05/2026 10:00",
      },
    ],
    bracketMatches: bracketTemplate,
    games: [
      {
        id: "m5",
        round: "Semifinal",
        home: "Rafa Silva",
        away: "Sara Freitas",
        sets: [
          { home: 11, away: 9 },
          { home: 10, away: 12 },
          { home: 11, away: 7 },
        ],
      },
    ],
  },
  5: {
    about: "Disputa por equipes com atletas de alto rendimento.",
    athletes: [
      { name: "Vitor Mendes", age: 34, club: "CTM Elite", status: "confirmada" },
      { name: "William Costa", age: 36, club: "CTM Elite", status: "confirmada" },
      { name: "Xavier Lima", age: 33, club: "CTM Norte", status: "pendente" },
      { name: "Yara Souza", age: 31, club: "CTM Sul", status: "confirmada" },
    ],
    groupMatches: [
      {
        id: "g9",
        group: "Grupo A",
        home: "Vitor/William",
        away: "Xavier/Yara",
        status: "em andamento",
        scheduledAt: "22/06/2026 15:00",
      },
    ],
    bracketMatches: bracketTemplate,
    games: [
      {
        id: "m6",
        round: "Grupo A",
        home: "Vitor/William",
        away: "Xavier/Yara",
        sets: [
          { home: 11, away: 6 },
          { home: 9, away: 11 },
          { home: 11, away: 8 },
        ],
      },
    ],
  },
};

export type CompetitionDetailsViewModel = {
  competition: Competition | null;
  details: CompetitionDetails | null;
};

export function useCompetitionDetailsViewModel(
  competitionId: string
): CompetitionDetailsViewModel {
  const normalizedId = decodeURIComponent(competitionId).trim();
  const numericId = Number.parseInt(normalizedId, 10);
  const competition = Number.isNaN(numericId)
    ? null
    : competitionsIndex.find((item) => item.id === numericId) ?? null;
  const details = Number.isNaN(numericId)
    ? null
    : detailsById[numericId] ?? null;

  return { competition, details };
}
