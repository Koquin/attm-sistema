import { CompetitionCard } from "../components/CompetitionCard";
import type { Competition } from "../types";

type CompetitionsViewProps = {
  competitions: Competition[];
};

export function CompetitionsView({ competitions }: CompetitionsViewProps) {

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-white">Competicoes</h1>
        <p className="mt-2 text-sm text-white">
          Lista de eventos reais com status, modalidade e quantidade de jogos.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {competitions.map((competition) => (
          <CompetitionCard key={competition.id} competition={competition} />
        ))}
      </div>
    </div>
  );
}
