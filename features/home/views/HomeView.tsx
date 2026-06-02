import Link from "next/link";
import Image from "next/image";
import { getLatestMatchesByCompetition } from "@/lib/db/home";

export async function HomeView() {
  const latestByCompetition = await getLatestMatchesByCompetition();

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-zinc-950 px-6 py-12 text-zinc-100"
      style={{
        fontFamily: '"Space Grotesk", "Manrope", sans-serif',
      }}
    >
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-amber-200/10 via-zinc-950 to-zinc-900 p-10">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-rose-300/10 blur-3xl" />
          <div className="relative flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-amber-200/80">
              Portal oficial
            </p>
            <h1
              className="text-3xl font-semibold leading-tight text-white sm:text-5xl"
              style={{ fontFamily: '"Fraunces", "DM Serif Display", serif' }}
            >
              Associacao Teresinense de Tenis de Mesa
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg">
              Um espaco para formar atletas, criar conexoes e elevar o nivel do
              tenis de mesa local com estrutura, treino e competicoes.
            </p>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-zinc-900/70 p-6 lg:flex-row lg:items-center">
            <div className="flex w-full items-center justify-center lg:w-1/2">
              <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <Image
                  src="/assets/imagem1attm.jpg"
                  alt="Faca parte da associacao"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex w-full flex-col justify-center lg:w-1/2">
              <h2 className="text-2xl font-semibold text-white">
                Faca parte da associacao
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Seja iniciante ou avancado, aqui voce encontra estrutura, equipe
                tecnica e um ambiente preparado para evoluir no tenis de mesa.
              </p>
              <Link
                href="/contatos"
                className="mt-6 inline-flex w-fit items-center justify-center rounded-full border border-amber-200/60 bg-amber-200/10 px-5 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-200/20"
              >
                Fale com a associacao
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-zinc-900/70 p-6 lg:flex-row lg:items-center">
            <div className="flex w-full items-center justify-center lg:order-2 lg:w-1/2">
              <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <Image
                  src="/assets/imagem2.png"
                  alt="Compita com suporte real"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex w-full flex-col justify-center lg:order-1 lg:w-1/2">
              <h2 className="text-2xl font-semibold text-white">
                Compita com suporte real
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Participe de competicoes organizadas pela associacao, com
                eventos experimentais e disputas competitivas para todos os
                niveis.
              </p>
              <Link
                href="/contatos"
                className="mt-6 inline-flex w-fit items-center justify-center rounded-full border border-sky-200/60 bg-sky-200/10 px-5 py-2 text-sm font-semibold text-sky-100 transition hover:bg-sky-200/20"
              >
                Quero competir
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 lg:flex-row lg:items-start">
            <div className="flex w-full items-center justify-center lg:w-1/2">
              <div className="relative aspect-square w-full max-w-[240px] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <Image
                  src="/assets/imagem3.webp"
                  alt="Fique por dentro das competicoes"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-6 lg:w-1/2">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Fique por dentro das competicoes
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  Confira as ultimas partidas por competicao e acompanhe os
                  resultados que estao movimentando a associacao.
                </p>
                <Link
                  href="/competicoes"
                  className="mt-6 inline-flex w-fit items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Ver competicoes
                </Link>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-200">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-zinc-400">
                  Ultimas partidas
                </p>
                {latestByCompetition.length === 0 ? (
                  <p className="mt-4 text-sm text-zinc-400">
                    Nenhuma partida recente encontrada.
                  </p>
                ) : (
                  <div className="mt-4 grid gap-4">
                    {latestByCompetition.map((competition) => (
                      <div key={competition.competitionName}>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/80">
                          {competition.competitionName}
                        </p>
                        <div className="mt-2 grid gap-2">
                          {competition.matches.map((match) => (
                            <div
                              key={match.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <span>{match.matchup}</span>
                              <span className="text-zinc-300">
                                {match.score}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}