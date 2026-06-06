import { listPublicCompetitions } from "@/lib/db/public";
import type { Competition } from "../types";

export type CompetitionsViewModel = {
  competitions: Competition[];
};

export async function getCompetitionsViewModel(): Promise<CompetitionsViewModel> {
  return {
    competitions: await listPublicCompetitions(),
  };
}
