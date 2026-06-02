"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AdminPanelData } from "@/lib/db/admin";
import type { Atleta } from "@/lib/db/types";

type AdminResource =
  | "club"
  | "athlete"
  | "referee"
  | "category"
  | "modality"
  | "competition"
  | "group"
  | "match"
  | "result"
  | "registration";

type AdminRecordPayload = Record<string, unknown>;

type Option = {
  value: string;
  label: string;
};

type CompetitionAutomationPanelProps = {
  competitions: AdminPanelData["competitions"];
  groups: AdminPanelData["groups"];
  athletes: AdminPanelData["athletes"];
  registrations: AdminPanelData["registrations"];
  matchAthletes: AdminPanelData["matchAthletes"];
  matches: AdminPanelData["matches"];
  results: AdminPanelData["results"];
  referees: AdminPanelData["referees"];
  onCreate: (resource: AdminResource, payload: AdminRecordPayload) => Promise<void>;
  onUpdate: (resource: AdminResource, id: number, payload: AdminRecordPayload) => Promise<void>;
  onDelete: (resource: AdminResource, id: number) => Promise<void>;
};

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-amber-300/60";

const selectClassName =
  "w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-amber-300/60";

function buildOptions<T extends { id: number }>(items: T[], getLabel: (item: T) => string): Option[] {
  return items.map((item) => ({ value: String(item.id), label: getLabel(item) }));
}

export function CompetitionAutomationPanel({
  competitions,
  groups,
  athletes,
  registrations,
  matchAthletes,
  matches,
  results,
  referees,
  onCreate,
  onUpdate,
  onDelete,
}: CompetitionAutomationPanelProps) {
  const router = useRouter();
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<number | null>(competitions[0]?.id ?? null);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [playerBySlot, setPlayerBySlot] = useState<Record<string, string>>({});

  const selectedCompetition = competitions.find((competition) => competition.id === selectedCompetitionId) ?? null;

  const competitionGroups = useMemo(
    () => groups.filter((group) => group.id_competicao === selectedCompetitionId),
    [groups, selectedCompetitionId],
  );

  const competitionRegistrations = useMemo(
    () => registrations.filter((registration) => registration.id_competicao === selectedCompetitionId),
    [registrations, selectedCompetitionId],
  );

  const competitionAthletesByGroup = useMemo(() => {
    const grouped = new Map<number, Atleta[]>();

    for (const group of competitionGroups) {
      const athleteList = competitionRegistrations
        .filter((registration) => registration.id_grupo === group.id)
        .map((registration) => athletes.find((athlete) => athlete.id === registration.id_atleta) ?? null)
        .filter((athlete): athlete is Atleta => athlete !== null);

      grouped.set(group.id, athleteList);
    }

    return grouped;
  }, [athletes, competitionGroups, competitionRegistrations]);

  const competitionMatches = useMemo(() => {
    const groupIds = new Set(competitionGroups.map((group) => group.id));
    return matches.filter((match) => match.id_grupo !== null && groupIds.has(match.id_grupo));
  }, [competitionGroups, matches]);

  const selectedMatch = competitionMatches.find((match) => match.id === selectedMatchId) ?? null;
  const selectedMatchResult = results.find((result) => result.id_partida === selectedMatch?.id) ?? null;
  const selectedMatchAthletes = selectedMatch
    ? matchAthletes
        .filter((link) => link.id_partida === selectedMatch.id)
        .map((link) => athletes.find((athlete) => athlete.id === link.id_atleta) ?? null)
        .filter((athlete): athlete is Atleta => athlete !== null)
    : [];

  const refereeOptions = useMemo(
    () => buildOptions(referees, (referee) => `${referee.nome} ${referee.sobrenome}`),
    [referees],
  );

  const unassignedAthletes = useMemo(() => {
    const assignedAthleteIds = new Set(
      competitionRegistrations
        .filter((registration) => registration.id_grupo !== null)
        .map((registration) => registration.id_atleta),
    );
    return athletes.filter((athlete) => !assignedAthleteIds.has(athlete.id));
  }, [athletes, competitionRegistrations]);

  async function postAdminRecord(resource: string, payload: Record<string, unknown>) {
    const response = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource, payload }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string; details?: string; hint?: string } | null;
      const message = data?.error ?? "Falha ao salvar registro.";
      throw new Error(data?.details ? `${message}\n${data.details}${data.hint ? `\n${data.hint}` : ""}` : message);
    }

    const data = (await response.json().catch(() => null)) as { data?: { id?: number } } | null;
    return data?.data ?? null;
  }

  async function handleCreateGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCompetition) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    await onCreate("group", {
      id_competicao: selectedCompetition.id,
      nome: String(formData.get("nome") ?? ""),
      quantidade_jogadores: Number(formData.get("quantidade_jogadores")),
    });
    form.reset();
  }

  async function handleGenerateMatches() {
    if (!selectedCompetition) return;

    for (const group of competitionGroups) {
      const groupAthletes = competitionAthletesByGroup.get(group.id) ?? [];
      const generatedCount = groupAthletes.length > 1 ? (groupAthletes.length * (groupAthletes.length - 1)) / 2 : 0;
      const existingMatches = competitionMatches.filter((match) => match.id_grupo === group.id);
      if (existingMatches.length > 0) continue;

      if (generatedCount === 0) {
        continue;
      }

      for (let homeIndex = 0; homeIndex < groupAthletes.length; homeIndex += 1) {
        for (let awayIndex = homeIndex + 1; awayIndex < groupAthletes.length; awayIndex += 1) {
          const createdMatch = (await postAdminRecord("match", {
          id_grupo: group.id,
          id_arbitro: null,
          numero_mesa: null,
          status: "aguardo",
          fase: "grupos",
          })) as { id?: number } | null;

          if (!createdMatch?.id) {
            continue;
          }

          await postAdminRecord("matchAthlete", {
            id_partida: createdMatch.id,
            id_atleta: groupAthletes[homeIndex].id,
          });

          await postAdminRecord("matchAthlete", {
            id_partida: createdMatch.id,
            id_atleta: groupAthletes[awayIndex].id,
          });
        }
      }
    }

    router.refresh();
  }

  async function handleAssignAthlete(groupId: number, slotKey: string) {
    if (!selectedCompetition) return;
    const athleteId = Number(playerBySlot[slotKey]);
    if (!athleteId) return;

    await onCreate("registration", {
      id_atleta: athleteId,
      id_competicao: selectedCompetition.id,
      id_grupo: groupId,
    });

    setPlayerBySlot((current) => ({ ...current, [slotKey]: "" }));
  }

  async function handleStartMatch() {
    if (!selectedMatch) return;

    await onUpdate("match", selectedMatch.id, {
      id_grupo: selectedMatch.id_grupo,
      id_arbitro: selectedMatch.id_arbitro,
      numero_mesa: selectedMatch.numero_mesa,
      status: "em andamento",
      fase: selectedMatch.fase,
    });
  }

  async function handleSaveMatchSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedMatch) return;

    const formData = new FormData(event.currentTarget);
    await onUpdate("match", selectedMatch.id, {
      id_grupo: selectedMatch.id_grupo,
      id_arbitro: Number(formData.get("id_arbitro")),
      numero_mesa: Number(formData.get("numero_mesa")),
      status: selectedMatch.status,
      fase: selectedMatch.fase,
    });
  }

  async function handleSaveResult(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedMatch) return;

    const formData = new FormData(event.currentTarget);
    const payload = {
      id_partida: selectedMatch.id,
      time1_set1: Number(formData.get("time1_set1")),
      time1_set2: Number(formData.get("time1_set2")),
      time1_set3: Number(formData.get("time1_set3")),
      time2_set1: Number(formData.get("time2_set1")),
      time2_set2: Number(formData.get("time2_set2")),
      time2_set3: Number(formData.get("time2_set3")),
    };

    if (selectedMatchResult) {
      await onUpdate("result", selectedMatchResult.id, payload);
    } else {
      await onCreate("result", payload);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-200/80">Automacao de competicoes</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Competições cadastradas</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
            Selecione uma competição para ver grupos, colocar jogadores, gerar partidas e abrir os detalhes da partida.
          </p>
        </div>
        <button
          type="button"
          onClick={handleGenerateMatches}
          disabled={!selectedCompetition}
          className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Gerar partidas
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {competitions.map((competition) => (
          <button
            key={competition.id}
            type="button"
            onClick={() => {
              setSelectedCompetitionId(competition.id);
              setSelectedMatchId(null);
            }}
            className={`rounded-3xl border p-5 text-left transition ${
              selectedCompetitionId === competition.id
                ? "border-amber-300/60 bg-amber-300/10"
                : "border-white/10 bg-zinc-950/50 hover:border-white/20"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Competição #{competition.id}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{competition.nome}</h3>
            <p className="mt-1 text-sm text-zinc-300">Modalidade #{competition.id_modalidade} · Categoria #{competition.id_categoria}</p>
            <p className="mt-2 text-sm text-zinc-400">Status: {competition.status}</p>
          </button>
        ))}
      </div>

      {selectedCompetition ? (
        <div className="mt-8 grid gap-6">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Grupos da competição</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{selectedCompetition.nome}</h3>
              </div>
              <form onSubmit={handleCreateGroup} className="grid gap-3 md:grid-cols-[1.2fr_0.7fr_auto] md:items-end">
                <label className="grid gap-2 text-sm text-zinc-200">
                  <span>Nome do grupo</span>
                  <input name="nome" className={inputClassName} placeholder="Ex.: Grupo A" required />
                </label>
                <label className="grid gap-2 text-sm text-zinc-200">
                  <span>Jogadores</span>
                  <input name="quantidade_jogadores" type="number" min="0" className={inputClassName} placeholder="0" required />
                </label>
                <button type="submit" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950">
                  Criar grupo
                </button>
              </form>
            </div>

            <div className="mt-6 space-y-4">
              {competitionGroups.length > 0 ? (
                competitionGroups.map((group) => {
                  const groupSlots = Array.from({ length: group.quantidade_jogadores }, (_, index) => index + 1);
                  const groupRegistrations = competitionRegistrations.filter((registration) => registration.id_grupo === group.id);
                  const rows = groupSlots.map((slot, index) => {
                    const slotKey = `${group.id}-${slot}`;
                    const registration = groupRegistrations[index] ?? null;
                    const athlete = registration ? athletes.find((item) => item.id === registration.id_atleta) ?? null : null;

                    return {
                      slotKey,
                      slot,
                      registration,
                      athlete,
                    };
                  });

                  return (
                    <div key={group.id} className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{group.nome}</h4>
                          <p className="text-sm text-zinc-400">{group.quantidade_jogadores} vagas</p>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            await onDelete("group", group.id);
                          }}
                          className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-200"
                        >
                          Remover grupo
                        </button>
                      </div>

                      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-white/5 text-zinc-300">
                            <tr>
                              <th className="px-4 py-3">Slot</th>
                              <th className="px-4 py-3">Jogador</th>
                              <th className="px-4 py-3">Ação</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.length > 0 ? rows.map(({ slotKey, slot, registration, athlete }) => (
                              <tr key={`${group.id}-${slot}`} className="border-t border-white/10">
                                <td className="px-4 py-3 text-zinc-400">{slot}</td>
                                <td className="px-4 py-3 text-white">{athlete ? `${athlete.nome} ${athlete.sobrenome}` : "Vazio"}</td>
                                <td className="px-4 py-3">
                                  {athlete ? (
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        if (registration) {
                                          await onDelete("registration", registration.id);
                                        }
                                      }}
                                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white"
                                    >
                                      Remover jogador
                                    </button>
                                  ) : (
                                    <div className="flex gap-2">
                                      <select
                                        value={playerBySlot[slotKey] ?? ""}
                                        onChange={(event) => setPlayerBySlot((current) => ({ ...current, [slotKey]: event.target.value }))}
                                        className={selectClassName}
                                      >
                                        <option value="">Selecionar atleta</option>
                                        {unassignedAthletes.map((athleteOption) => (
                                          <option key={athleteOption.id} value={athleteOption.id}>
                                            {athleteOption.nome} {athleteOption.sobrenome}
                                          </option>
                                        ))}
                                      </select>
                                      <button
                                        type="button"
                                        onClick={() => handleAssignAthlete(group.id, slotKey)}
                                        disabled={!playerBySlot[slotKey]}
                                        className="rounded-full bg-amber-300 px-4 py-2 text-xs font-semibold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        Adicionar jogador
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            )) : (
                              <tr className="border-t border-white/10">
                                <td className="px-4 py-3 text-zinc-400" colSpan={3}>
                                  Nenhuma vaga configurada para este grupo.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
                  Nenhum grupo criado ainda.
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Partidas geradas</p>
              <div className="mt-4 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
                {competitionMatches.length > 0 ? (
                  competitionMatches.map((match) => (
                    <button
                      key={match.id}
                      type="button"
                      onClick={() => setSelectedMatchId(match.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selectedMatchId === match.id
                          ? "border-amber-300/60 bg-amber-300/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">Partida #{match.id}</p>
                          <p className="text-xs text-zinc-400">Grupo {match.id_grupo ?? "-"}</p>
                        </div>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-200">{match.status}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
                    Gere as partidas a partir dos grupos para vê-las aqui.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Detalhes da partida</p>
              {selectedMatch ? (
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
                    <p className="font-semibold text-white">Partida #{selectedMatch.id}</p>
                    <p className="mt-1">Status: {selectedMatch.status}</p>
                    <p>Fase: {selectedMatch.fase}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.3em] text-zinc-500">Atletas da partida</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedMatchAthletes.length > 0 ? (
                        selectedMatchAthletes.map((athlete) => (
                          <span key={athlete.id} className="rounded-full border border-white/10 bg-zinc-950/70 px-3 py-1 text-xs text-white">
                            {athlete.nome} {athlete.sobrenome}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-zinc-400">Nenhum atleta vinculado a esta partida ainda.</span>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleSaveMatchSettings} className="grid gap-4">
                    <label className="grid gap-2 text-sm text-zinc-200">
                      <span>Arbitro</span>
                      <select name="id_arbitro" defaultValue={selectedMatch.id_arbitro ?? ""} className={selectClassName}>
                        <option value="">Selecione o arbitro</option>
                        {refereeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-2 text-sm text-zinc-200">
                      <span>Mesa</span>
                      <input name="numero_mesa" type="number" defaultValue={selectedMatch.numero_mesa ?? ""} className={inputClassName} />
                    </label>
                    <button type="submit" className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white">
                      Salvar dados da partida
                    </button>
                    <button
                      type="button"
                      onClick={handleStartMatch}
                      disabled={selectedMatch.status === "em andamento"}
                      className="rounded-full bg-amber-300 px-4 py-3 text-sm font-semibold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Iniciar partida
                    </button>
                  </form>

                  {selectedMatch.status === "em andamento" ? (
                    <form onSubmit={handleSaveResult} className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-semibold text-white">Sets da partida</p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <input name="time1_set1" type="number" min="0" defaultValue={selectedMatchResult?.time1_set1 ?? 0} className={inputClassName} placeholder="Time 1 Set 1" />
                        <input name="time2_set1" type="number" min="0" defaultValue={selectedMatchResult?.time2_set1 ?? 0} className={inputClassName} placeholder="Time 2 Set 1" />
                        <input name="time1_set2" type="number" min="0" defaultValue={selectedMatchResult?.time1_set2 ?? 0} className={inputClassName} placeholder="Time 1 Set 2" />
                        <input name="time2_set2" type="number" min="0" defaultValue={selectedMatchResult?.time2_set2 ?? 0} className={inputClassName} placeholder="Time 2 Set 2" />
                        <input name="time1_set3" type="number" min="0" defaultValue={selectedMatchResult?.time1_set3 ?? 0} className={inputClassName} placeholder="Time 1 Set 3" />
                        <input name="time2_set3" type="number" min="0" defaultValue={selectedMatchResult?.time2_set3 ?? 0} className={inputClassName} placeholder="Time 2 Set 3" />
                      </div>
                      <button type="submit" className="rounded-full bg-amber-300 px-4 py-3 text-sm font-semibold text-zinc-950">
                        Salvar sets
                      </button>
                    </form>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
                      Os pontos dos sets só podem ser lançados quando a partida estiver em andamento.
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
                  Selecione uma partida para ver mesa, arbitro e sets.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
