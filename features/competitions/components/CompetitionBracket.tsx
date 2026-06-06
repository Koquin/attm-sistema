"use client";

import { BracketMatch } from "../types";

type CompetitionBracketProps = {
  matches: BracketMatch[];
};

export function CompetitionBracket({ matches }: CompetitionBracketProps) {
  const groupedMatches = matches.reduce<Record<string, BracketMatch[]>>((groups, match) => {
    const key = match.phase || "Outros";
    groups[key] = groups[key] ?? [];
    groups[key].push(match);
    return groups;
  }, {});

  return (
    <div className="grid gap-4">
      {matches.length > 0 ? (
        Object.entries(groupedMatches).map(([phase, phaseMatches]) => (
          <section key={phase} className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {phase}
            </h4>
            <div className="mt-4 grid gap-3">
              {phaseMatches.map((match) => (
                <article key={match.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">
                        {match.round}
                      </p>
                      <p className="mt-1 text-sm text-zinc-600">
                        {match.home} x {match.away}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-zinc-900">{match.score}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                        {match.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {match.sets.length > 0 ? match.sets.map((set, index) => (
                      <div key={`${match.id}-set-${index}`} className="rounded-lg bg-white px-3 py-2 text-sm text-zinc-700">
                        <span className="font-semibold text-zinc-900">Set {index + 1}:</span> {set.home} x {set.away}
                      </div>
                    )) : (
                      <p className="text-sm text-zinc-500">Sem sets registrados.</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-center text-sm text-zinc-500">
          Chaveamento indisponivel.
        </div>
      )}
    </div>
  );
}
