import { supabase } from "../supabaseClient";

type LatestMatch = {
  id: number;
  competitionName: string;
  matchup: string;
  score: string;
};

type MatchesByCompetition = {
  competitionName: string;
  matches: LatestMatch[];
};

function buildScore(result: {
  time1_set1: number;
  time1_set2: number;
  time1_set3: number;
  time2_set1: number;
  time2_set2: number;
  time2_set3: number;
} | null): string {
  if (!result) {
    return "-";
  }

  const sets = [
    [result.time1_set1, result.time2_set1],
    [result.time1_set2, result.time2_set2],
    [result.time1_set3, result.time2_set3],
  ];

  const wins = sets.reduce(
    (acc, [a, b]) => {
      if (a === 0 && b === 0) {
        return acc;
      }
      if (a > b) {
        acc.home += 1;
      } else if (b > a) {
        acc.away += 1;
      }
      return acc;
    },
    { home: 0, away: 0 }
  );

  if (wins.home === 0 && wins.away === 0) {
    return "-";
  }

  return `${wins.home}-${wins.away}`;
}

export async function getLatestMatchesByCompetition(
  limit = 5
): Promise<MatchesByCompetition[]> {
  const { data, error } = await supabase
    .from("partida")
    .select(
      "id, grupo:grupo (id, nome, competicao:competicao (id, nome)), partida_atleta:partida_atleta (atleta:atleta (nome, sobrenome)), resultado_partida:resultado_partida (time1_set1, time1_set2, time1_set3, time2_set1, time2_set2, time2_set3)"
    )
    .order("id", { ascending: false })
    .limit(limit);

  if (error) throw error;

  const rows = data ?? [];
  const grouped = new Map<string, LatestMatch[]>();

  rows.forEach((row) => {
    const typedRow = row as {
      id: number;
      grupo?: { competicao?: { nome?: string } };
      partida_atleta?: Array<{ atleta?: { nome?: string; sobrenome?: string } }>;
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

    const competitionName = typedRow.grupo?.competicao?.nome ?? "Competicao sem nome";
    const athletes = (typedRow.partida_atleta ?? [])
      .map((item) => {
        const first = item.atleta?.nome ?? "Atleta";
        const last = item.atleta?.sobrenome ?? "";
        return `${first} ${last}`.trim();
      })
      .filter((name: string) => name.length > 0);

    const matchup = athletes.length >= 2
      ? `${athletes[0]} x ${athletes[1]}`
      : `Partida #${typedRow.id}`;

    const result = Array.isArray(typedRow.resultado_partida)
      ? typedRow.resultado_partida[0] ?? null
      : typedRow.resultado_partida ?? null;

    const match: LatestMatch = {
      id: typedRow.id,
      competitionName,
      matchup,
      score: buildScore(result),
    };

    const list = grouped.get(competitionName) ?? [];
    list.push(match);
    grouped.set(competitionName, list);
  });

  return Array.from(grouped.entries()).map(([competitionName, matches]) => ({
    competitionName,
    matches,
  }));
}
