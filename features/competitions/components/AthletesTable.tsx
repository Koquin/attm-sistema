import { Athlete } from "../types";

type AthletesTableProps = {
  athletes: Athlete[];
};

export function AthletesTable({ athletes }: AthletesTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="px-4 py-3">Atleta</th>
            <th className="px-4 py-3">Idade</th>
            <th className="px-4 py-3">Clube</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {athletes.map((athlete) => (
            <tr
              key={athlete.name}
              className="border-t border-zinc-200 text-zinc-700"
            >
              <td className="px-4 py-3 font-medium text-zinc-900">
                {athlete.name}
              </td>
              <td className="px-4 py-3">{athlete.age}</td>
              <td className="px-4 py-3">{athlete.club}</td>
              <td className="px-4 py-3">{athlete.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
