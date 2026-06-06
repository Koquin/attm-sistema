import { CompetitionsView } from "@/features/competitions";
import { listPublicCompetitions } from "@/lib/db/public";

export default async function CompeticoesPage() {
  const competitions = await listPublicCompetitions();

  return <CompetitionsView competitions={competitions} />;
}
