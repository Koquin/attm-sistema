import { Game } from "../types";

type MatchesListProps = {
  games: Game[];
};

export function MatchesList({ games }: MatchesListProps) {
  return (
    <div className="grid gap-4">
      {games.map((game) => (
        <div
          key={game.id}
          className="rounded-2xl border border-zinc-200 bg-white p-5"
        >
          <h4 className="text-sm font-semibold text-zinc-900">
            {game.round}
          </h4>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
            {game.status}
          </p>
          <div className="mt-4 overflow-x-auto">
            <div
              className="grid min-w-[360px] items-center gap-2"
              style={{ gridTemplateColumns: `160px repeat(${game.sets.length}, minmax(70px, 1fr))` }}
            >
              <div />
              {game.sets.map((_, index) => (
                <div
                  key={`${game.id}-set-header-${index}`}
                  className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500"
                >
                  Set {index + 1}
                </div>
              ))}
              <div className="text-sm font-semibold text-zinc-900">
                {game.home}
              </div>
              {game.sets.map((set, index) => (
                <div
                  key={`${game.id}-set-home-${index}`}
                  className="text-center text-sm font-semibold text-zinc-900"
                >
                  {set.home}
                </div>
              ))}
              <div className="text-sm font-semibold text-zinc-900">
                {game.away}
              </div>
              {game.sets.map((set, index) => (
                <div
                  key={`${game.id}-set-away-${index}`}
                  className="text-center text-sm font-semibold text-zinc-900"
                >
                  {set.away}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-600">Placar final: {game.score}</p>
        </div>
      ))}
    </div>
  );
}
