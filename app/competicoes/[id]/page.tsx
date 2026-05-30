import { CompetitionDetailsView } from "@/features/competitions";

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

  return (
    <CompetitionDetailsView
      competitionId={decodeURIComponent(competitionId)}
    />
  );
}
