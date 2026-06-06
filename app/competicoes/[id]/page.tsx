import { CompetitionDetailsView } from "@/features/competitions";
import { getPublicCompetitionDetails } from "@/lib/db/public";

type CompetitionDetailsPageProps = {
  params: Promise<{ id: string | string[] }>;
};

export default async function CompetitionDetailsPage({
  params,
}: CompetitionDetailsPageProps) {
  const resolvedParams = await params;
  const competitionId = Array.isArray(resolvedParams.id)
    ? resolvedParams.id[0]
    : resolvedParams.id;
  const numericId = Number.parseInt(decodeURIComponent(competitionId), 10);

  if (Number.isNaN(numericId)) {
    return (
      <div className="mx-auto w-full max-w-5xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-zinc-900">Competicao nao encontrada</h1>
        <p className="mt-2 text-sm text-zinc-600">Verifique o link ou volte para a lista de competicoes.</p>
      </div>
    );
  }

  const data = await getPublicCompetitionDetails(numericId);

  if (!data) {
    return (
      <div className="mx-auto w-full max-w-5xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-zinc-900">Competicao nao encontrada</h1>
        <p className="mt-2 text-sm text-zinc-600">Verifique o link ou volte para a lista de competicoes.</p>
      </div>
    );
  }

  const { competition, ...details } = data;

  if (!competition) {
    return (
      <div className="mx-auto w-full max-w-5xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-zinc-900">Competicao nao encontrada</h1>
        <p className="mt-2 text-sm text-zinc-600">Verifique o link ou volte para a lista de competicoes.</p>
      </div>
    );
  }

  return <CompetitionDetailsView competition={competition} details={details} />;
}
