import { GroupMatch } from "../types";

type GroupMatchesTableProps = {
  matches: GroupMatch[];
};

export function GroupMatchesTable({ matches }: GroupMatchesTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="px-4 py-3">Fase</th>
            <th className="px-4 py-3">Jogo</th>
            <th className="px-4 py-3">Placar</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr
              key={match.id}
              className="border-t border-zinc-200 text-zinc-700"
            >
              <td className="px-4 py-3 font-medium text-zinc-900">
                {match.round}
              </td>
              <td className="px-4 py-3">
                {match.home} x {match.away}
              </td>
              <td className="px-4 py-3">{match.score}</td>
              <td className="px-4 py-3">{match.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
