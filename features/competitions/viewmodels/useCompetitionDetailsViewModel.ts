import { getPublicCompetitionDetails } from "@/lib/db/public";
import type { Competition, CompetitionDetails } from "../types";

export type CompetitionDetailsViewModel = {
  competition: Competition | null;
  details: CompetitionDetails | null;
};

export async function getCompetitionDetailsViewModel(
  competitionId: number,
): Promise<CompetitionDetailsViewModel> {
  const data = await getPublicCompetitionDetails(competitionId);

  if (!data) {
    return { competition: null, details: null };
  }

  const { competition, ...details } = data;

  return { competition, details };
}
