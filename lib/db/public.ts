import { supabaseServer } from "@/lib/supabaseServer";
import type {
  Athlete,
  BracketMatch,
  Competition,
  CompetitionStatus,
  Game,
  GroupMatch,
  MatchSet,
} from "@/features/competitions/types";

type CompetitionRow = {
  id: number;
  nome: string;
  status: string;
  created_at: string;
  categoria?: {
    sexo?: string;
    idade?: string;
  } | null;
  modalidade?: {
    nome?: string;
  } | null;
};

type GroupRow = {
  id: number;
  id_competicao: number;
};

type RegistrationRow = {
  id: number;
  id_atleta: number;
  id_competicao: number;
  id_grupo: number | null;
  inscricao_confirmada: boolean;
  atleta?: {
    nome?: string;
    sobrenome?: string;
    idade?: number;
    sexo?: string;
    clube?: {
      nome?: string;
    } | null;
  } | null;
};

type MatchRow = {
  id: number;
  id_grupo: number | null;
  status: string;
  fase: string;
  grupo?: {
    nome?: string;
    competicao?: {
      id?: number;
      nome?: string;
    } | null;
  } | null;
  partida_atleta?: Array<{
    atleta?: {
      id?: number;
      nome?: string;
      sobrenome?: string;
      idade?: number;
      sexo?: string;
      clube?: {
        nome?: string;
      } | null;
    } | null;
  }> | null;
  resultado_partida?: Array<{
    time1_set1: number;
    time1_set2: number;
    time1_set3: number;
    time2_set1: number;
    time2_set2: number;
    time2_set3: number;
  }> | {
    time1_set1: number;
    time1_set2: number;
    time1_set3: number;
    time2_set1: number;
    time2_set2: number;
    time2_set3: number;
  } | null;
};

function mapCompetitionStatus(status?: string | null): CompetitionStatus {
  const normalized = (status ?? "").toLowerCase();

  if (normalized.includes("final")) return "finalizado";
  if (normalized.includes("andamento")) return "em andamento";
  return "aguardando";
}

function mapMatchStatus(status?: string | null): CompetitionStatus {
  const normalized = (status ?? "").toLowerCase();

  if (normalized.includes("final")) return "finalizado";
  if (normalized.includes("andamento")) return "em andamento";
  return "aguardando";
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function buildScore(result: MatchRow["resultado_partida"]): string {
  const typedResult = Array.isArray(result) ? result[0] ?? null : result;

  if (!typedResult) {
    return "-";
  }

  const sets = [
    [typedResult.time1_set1, typedResult.time2_set1],
    [typedResult.time1_set2, typedResult.time2_set2],
    [typedResult.time1_set3, typedResult.time2_set3],
  ];

  const wins = sets.reduce(
    (acc, [homeScore, awayScore]) => {
      if (homeScore === 0 && awayScore === 0) {
        return acc;
      }

      if (homeScore > awayScore) {
        acc.home += 1;
      } else if (awayScore > homeScore) {
        acc.away += 1;
      }

      return acc;
    },
    { home: 0, away: 0 },
  );

  if (wins.home === 0 && wins.away === 0) {
    return "-";
  }

  return `${wins.home}-${wins.away}`;
}

function buildSets(result: MatchRow["resultado_partida"]): MatchSet[] {
  const typedResult = Array.isArray(result) ? result[0] ?? null : result;

  if (!typedResult) {
    return [];
  }

  return [
    { home: typedResult.time1_set1, away: typedResult.time2_set1 },
    { home: typedResult.time1_set2, away: typedResult.time2_set2 },
    { home: typedResult.time1_set3, away: typedResult.time2_set3 },
  ];
}

function getParticipantNames(row: MatchRow) {
  const participants = (row.partida_atleta ?? [])
    .map((item) => {
      const athlete = item.atleta;
      if (!athlete?.nome) {
        return null;
      }

      return `${athlete.nome} ${athlete.sobrenome ?? ""}`.trim();
    })
    .filter((name): name is string => Boolean(name));

  return {
    home: participants[0] ?? `Partida #${row.id}`,
    away: participants[1] ?? "Aguardando atleta",
  };
}

function formatRoundLabel(phase: string, groupName?: string | null) {
  if (groupName) {
    return groupName;
  }

  const normalized = phase.toLowerCase();

  if (normalized.includes("grupo")) return "Fase de grupos";
  if (normalized.includes("final")) return "Final";
  if (normalized.includes("semi")) return "Semifinal";
  if (normalized.includes("quart")) return "Quartas";

  return phase;
}

function mapCompetition(row: CompetitionRow, groupCount: number, matchCount: number): Competition {
  return {
    id: row.id,
    name: row.nome,
    category: `${row.categoria?.sexo ?? "Categoria"} - ${row.categoria?.idade ?? ""}`.trim(),
    modality: (row.modalidade?.nome === "2x2" ? "2x2" : "1x1") as Competition["modality"],
    status: mapCompetitionStatus(row.status),
    createdAt: formatDate(row.created_at),
    groupCount,
    matchCount,
  };
}

function mapMatchRow(row: MatchRow): { groupMatch: GroupMatch; game: Game; bracketMatch: BracketMatch } {
  const { home, away } = getParticipantNames(row);
  const score = buildScore(row.resultado_partida);
  const sets = buildSets(row.resultado_partida);
  const round = formatRoundLabel(row.fase, row.grupo?.nome ?? null);
  const status = mapMatchStatus(row.status);

  return {
    groupMatch: {
      id: row.id,
      phase: row.fase,
      round,
      home,
      away,
      status,
      score,
    },
    game: {
      id: row.id,
      phase: row.fase,
      round,
      home,
      away,
      status,
      score,
      sets,
    },
    bracketMatch: {
      id: row.id,
      phase: row.fase,
      round,
      home,
      away,
      status,
      score,
      sets,
    },
  };
}

export async function listPublicCompetitions(): Promise<Competition[]> {
  const [competitionResult, groupResult, matchResult] = await Promise.all([
    supabaseServer
      .from("competicao")
      .select("id, nome, status, created_at, categoria:categoria (sexo, idade), modalidade:modalidade (nome)")
      .order("created_at", { ascending: false }),
    supabaseServer.from("grupo").select("id, id_competicao"),
    supabaseServer.from("partida").select("id, id_grupo, fase, status, grupo:grupo (nome, competicao:competicao (id))"),
  ]);

  if (competitionResult.error) throw competitionResult.error;
  if (groupResult.error) throw groupResult.error;
  if (matchResult.error) throw matchResult.error;

  const groupsByCompetition = new Map<number, number>();
  for (const group of groupResult.data ?? []) {
    const typedGroup = group as GroupRow;
    groupsByCompetition.set(typedGroup.id_competicao, (groupsByCompetition.get(typedGroup.id_competicao) ?? 0) + 1);
  }

  const matchesByCompetition = new Map<number, number>();
  for (const match of matchResult.data ?? []) {
    const typedMatch = match as MatchRow;
    const competitionId = typedMatch.grupo?.competicao?.id;
    if (!competitionId) continue;
    matchesByCompetition.set(competitionId, (matchesByCompetition.get(competitionId) ?? 0) + 1);
  }

  return ((competitionResult.data ?? []) as CompetitionRow[]).map((row) =>
    mapCompetition(row, groupsByCompetition.get(row.id) ?? 0, matchesByCompetition.get(row.id) ?? 0),
  );
}

export async function getPublicCompetitionDetails(competitionId: number): Promise<{
  competition: Competition | null;
  about: string;
  athletes: Athlete[];
  groupMatches: GroupMatch[];
  bracketMatches: BracketMatch[];
  games: Game[];
} | null> {
  const [competitionResult, groupResult, registrationsResult, matchesResult] = await Promise.all([
    supabaseServer
      .from("competicao")
      .select("id, nome, status, created_at, categoria:categoria (sexo, idade), modalidade:modalidade (nome)")
      .eq("id", competitionId)
      .maybeSingle(),
    supabaseServer.from("grupo").select("id, id_competicao").eq("id_competicao", competitionId),
    supabaseServer
      .from("inscricao")
      .select("id, id_atleta, id_competicao, id_grupo, inscricao_confirmada, atleta:atleta (nome, sobrenome, idade, sexo, clube:clube (nome))")
      .eq("id_competicao", competitionId),
    supabaseServer
      .from("partida")
      .select("id, id_grupo, status, fase, grupo:grupo (nome, competicao:competicao (id)), partida_atleta:partida_atleta (atleta:atleta (id, nome, sobrenome, idade, sexo, clube:clube (nome))), resultado_partida:resultado_partida (time1_set1, time1_set2, time1_set3, time2_set1, time2_set2, time2_set3)")
      .order("id", { ascending: true }),
  ]);

  if (competitionResult.error) throw competitionResult.error;
  if (groupResult.error) throw groupResult.error;
  if (registrationsResult.error) throw registrationsResult.error;
  if (matchesResult.error) throw matchesResult.error;

  const competitionRow = competitionResult.data as CompetitionRow | null;
  if (!competitionRow) {
    return null;
  }

  const competitionMatches = (matchesResult.data ?? [])
    .map((row) => row as MatchRow)
    .filter((match) => match.grupo?.competicao?.id === competitionId);

  const mappedMatches = competitionMatches.map(mapMatchRow);

  const athletes = ((registrationsResult.data ?? []) as RegistrationRow[])
    .map((registration) => {
      const athlete = registration.atleta;
      const clubName = athlete?.clube?.nome ?? "Sem clube";

      if (!athlete?.nome || athlete.idade === undefined) {
        return null;
      }

      return {
        name: `${athlete.nome} ${athlete.sobrenome ?? ""}`.trim(),
        age: athlete.idade,
        club: clubName,
        status: registration.inscricao_confirmada ? "confirmada" : "pendente",
      } satisfies Athlete;
    })
    .filter((athlete): athlete is Athlete => athlete !== null);

  const competition = mapCompetition(
    competitionRow,
    ((groupResult.data ?? []) as GroupRow[]).length,
    competitionMatches.length,
  );

  const groupMatches = mappedMatches
    .map((entry) => entry.groupMatch)
    .filter((match) => match.phase.toLowerCase().includes("grupo"));

  const bracketMatches = mappedMatches
    .map((entry) => entry.bracketMatch)
    .filter((match) => !match.phase.toLowerCase().includes("grupo"));

  const games = mappedMatches.map((entry) => entry.game);

  return {
    competition,
    about: `Competição com ${competition.groupCount} grupos e ${competition.matchCount} partidas cadastradas no sistema.`,
    athletes,
    groupMatches,
    bracketMatches,
    games,
  };
}
