export type CompetitionStatus = "finalizado" | "em andamento" | "aguardando";
export type CompetitionModality = "1x1" | "2x2";

export type Competition = {
  id: number;
  name: string;
  category: string;
  modality: CompetitionModality;
  status: CompetitionStatus;
  createdAt: string;
  groupCount: number;
  matchCount: number;
};

export type Athlete = {
  name: string;
  age: number;
  club: string;
  status: "confirmada" | "pendente";
};

export type GroupMatch = {
  id: number;
  phase: string;
  round: string;
  home: string;
  away: string;
  status: CompetitionStatus;
  score: string;
};

export type MatchSet = {
  home: number;
  away: number;
};

export type Game = {
  id: number;
  phase: string;
  round: string;
  home: string;
  away: string;
  status: CompetitionStatus;
  score: string;
  sets: MatchSet[];
};

export type BracketMatch = {
  id: number;
  phase: string;
  round: string;
  home: string;
  away: string;
  status: CompetitionStatus;
  score: string;
  sets: MatchSet[];
};

export type CompetitionDetails = {
  about: string;
  athletes: Athlete[];
  groupMatches: GroupMatch[];
  bracketMatches: BracketMatch[];
  games: Game[];
};
