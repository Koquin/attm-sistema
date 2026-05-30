export type CompetitionStatus = "finalizado" | "em andamento" | "aguardando";
export type CompetitionModality = "1x1" | "2x2";
export type CompetitionCategory =
  | "master"
  | "50+"
  | "feminino"
  | "aberto"
  | "sub-21";

export type Competition = {
  id: number;
  name: string;
  category: CompetitionCategory;
  modality: CompetitionModality;
  status: CompetitionStatus;
  location: string;
  date: string;
};

export type Athlete = {
  name: string;
  age: number;
  club: string;
  status: "confirmada" | "pendente";
};

export type GroupMatch = {
  id: string;
  group: string;
  home: string;
  away: string;
  status: CompetitionStatus;
  scheduledAt: string;
};

export type MatchSet = {
  home: number;
  away: number;
};

export type Game = {
  id: string;
  round: string;
  home: string;
  away: string;
  sets: MatchSet[];
};

export type BracketMatch = {
  id: number;
  name: string;
  nextMatchId: number | null;
  tournamentRoundText: string;
  startTime: string;
  state: "DONE" | "RUNNING" | "SCHEDULED";
  participants: Array<{
    id: string;
    name: string;
    resultText?: string;
    isWinner?: boolean;
    status?: "PLAYED" | "NO_SHOW" | "WALK_OVER" | "READY";
  }>;
};

export type CompetitionDetails = {
  about: string;
  athletes: Athlete[];
  groupMatches: GroupMatch[];
  bracketMatches: BracketMatch[];
  games: Game[];
};
