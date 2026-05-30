import { useContactsViewModel } from "../viewmodels/useContactsViewModel";

export function ContactsView() {
  const viewModel = useContactsViewModel();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-zinc-900">
          {viewModel.title}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">{viewModel.description}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {viewModel.items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {item.label}
            </h3>
            <p className="mt-2 text-lg font-semibold text-zinc-900">
              {item.value}
            </p>
            {item.description ? (
              <p className="mt-1 text-sm text-zinc-600">{item.description}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
