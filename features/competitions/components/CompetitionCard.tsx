import Link from "next/link";
import { Competition } from "../types";

type CompetitionCardProps = {
  competition: Competition;
};

export function CompetitionCard({ competition }: CompetitionCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">
          {competition.name}
        </h3>
        <div className="mt-3 grid gap-1 text-sm text-zinc-600">
          <p>Categoria: {competition.category}</p>
          <p>Modalidade: {competition.modality}</p>
          <p>Status: {competition.status}</p>
          <p>Local: {competition.location}</p>
          <p>Data: {competition.date}</p>
        </div>
      </div>
      <Link
        className="mt-6 inline-flex w-fit items-center justify-center rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-50"
        href={`/competicoes/${competition.id}`}
      >
        Ver detalhes
      </Link>
    </div>
  );
}
