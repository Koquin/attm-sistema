import { useAdminViewModel } from "../viewmodels/useAdminViewModel";

export function AdminView() {
  const viewModel = useAdminViewModel();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-zinc-900">
          {viewModel.title}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">{viewModel.description}</p>
      </header>
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6">
        <p className="text-sm font-semibold text-zinc-700">Template cru</p>
        <ul className="mt-4 grid gap-2 text-sm text-zinc-600">
          {viewModel.notes.map((note) => (
            <li key={note}>- {note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
