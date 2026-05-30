import { Hero } from "../components/Hero";
import { useHomeViewModel } from "../viewmodels/useHomeViewModel";
import Link from "next/link";

export function HomeView() {
  const viewModel = useHomeViewModel();

  return (
    <div className="flex flex-col items-center bg-zinc-50 px-6 py-12">
      <main className="w-full max-w-5xl rounded-2xl bg-white p-10 shadow-sm">
        <Hero
          title={viewModel.title}
          subtitle={viewModel.subtitle}
          description={viewModel.description}
        />
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {viewModel.highlights.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-6 transition hover:border-zinc-300 hover:bg-white"
            >
              <h2 className="text-lg font-semibold text-zinc-900">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {item.description}
              </p>
              <span className="mt-4 inline-flex text-sm font-medium text-zinc-900 group-hover:underline">
                Abrir
              </span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
