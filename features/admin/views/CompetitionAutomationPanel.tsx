"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
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
  clubs: AdminPanelData["clubs"];
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

const primaryButtonClassName =
  "inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-zinc-950 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-300/20 active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButtonClassName =
  "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";

const smallButtonClassName =
  "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";

const dangerButtonClassName =
  "inline-flex items-center justify-center rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-200 transition duration-200 hover:-translate-y-0.5 hover:bg-red-500/20 active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";

const competitionStatusOptions = ["Aguardando inscricoes", "Em andamento", "Finalizado"] as const;

const competitionStatusLabel: Record<(typeof competitionStatusOptions)[number], string> = {
  "Aguardando inscricoes": "Aguardando inscrições",
  "Em andamento": "Em andamento",
  "Finalizado": "Finalizado",
};

const normalizedCompetitionStatus = (status?: string | null): (typeof competitionStatusOptions)[number] =>
  competitionStatusOptions.includes((status ?? "") as (typeof competitionStatusOptions)[number])
    ? ((status ?? "") as (typeof competitionStatusOptions)[number])
    : "Aguardando inscricoes";

function buildOptions<T extends { id: number }>(items: T[], getLabel: (item: T) => string): Option[] {
  return items.map((item) => ({ value: String(item.id), label: getLabel(item) }));
}

export function CompetitionAutomationPanel({
  clubs,
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
  const [registrationSearch, setRegistrationSearch] = useState("");
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  const selectedCompetition = competitions.find((competition) => competition.id === selectedCompetitionId) ?? null;
  const selectedCompetitionStatus = normalizedCompetitionStatus(selectedCompetition?.status);
  const isAwaitingRegistrations = selectedCompetitionStatus === "Aguardando inscricoes";
  const isInProgress = selectedCompetitionStatus === "Em andamento";
  const isFinalized = selectedCompetitionStatus === "Finalizado";

  useEffect(() => {
    if (!feedback) return undefined;

    const timeout = window.setTimeout(() => setFeedback(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  function showFeedback(kind: "success" | "error", message: string) {
    setFeedback({ kind, message });
  }

  const clubById = useMemo(() => new Map(clubs.map((club) => [club.id, club])), [clubs]);

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

  const competitionMatchesOrdered = useMemo(
    () => [...competitionMatches].sort((left, right) => left.id - right.id),
    [competitionMatches],
  );

  const matchNumberById = useMemo(() => {
    const map = new Map<number, number>();
    competitionMatchesOrdered.forEach((match, index) => map.set(match.id, index + 1));
    return map;
  }, [competitionMatchesOrdered]);

  const availableAthletesForRegistration = useMemo(() => {
    const registeredAthleteIds = new Set(competitionRegistrations.map((registration) => registration.id_atleta));
    return athletes.filter((athlete) => !registeredAthleteIds.has(athlete.id));
  }, [athletes, competitionRegistrations]);

  const filteredAthletesForRegistration = useMemo(() => {
    const normalizedSearch = registrationSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return availableAthletesForRegistration;
    }

    return availableAthletesForRegistration.filter((athlete) => {
      const athleteName = `${athlete.nome} ${athlete.sobrenome}`.toLowerCase();
      return athleteName.includes(normalizedSearch);
    });
  }, [availableAthletesForRegistration, registrationSearch]);

  const registrationRows = useMemo(
    () =>
      competitionRegistrations
        .map((registration) => ({
          registration,
          athlete: athletes.find((athlete) => athlete.id === registration.id_atleta) ?? null,
        }))
        .filter((row): row is { registration: (typeof competitionRegistrations)[number]; athlete: Atleta } => row.athlete !== null),
    [athletes, competitionRegistrations],
  );

  const selectedMatch = competitionMatches.find((match) => match.id === selectedMatchId) ?? null;
  const selectedMatchDisplayNumber = selectedMatch ? matchNumberById.get(selectedMatch.id) ?? selectedMatch.id : null;
  const selectedMatchResult = results.find((result) => result.id_partida === selectedMatch?.id) ?? null;
  const selectedMatchFinalized = selectedMatch?.status === "finalizada" || selectedMatch?.status === "finalizado";
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

  async function patchAdminRecord(resource: string, id: number, payload: Record<string, unknown>) {
    const response = await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource, id, payload }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string; details?: string; hint?: string } | null;
      const message = data?.error ?? "Falha ao atualizar registro.";
      throw new Error(data?.details ? [message, data.details, data.hint].filter(Boolean).join("\n") : message);
    }

    const data = (await response.json().catch(() => null)) as { data?: Record<string, unknown> } | null;
    return data?.data ?? null;
  }

  function athleteLabel(athlete: Atleta) {
    const club = clubById.get(athlete.id_clube);
    return `${athlete.nome} ${athlete.sobrenome} · ${club ? club.nome : "Sem clube"} · ${athlete.idade} anos · ${athlete.sexo}`;
  }

  async function updateCompetitionStatus(nextStatus: (typeof competitionStatusOptions)[number]) {
    if (!selectedCompetition || isFinalized) return;

    await onUpdate("competition", selectedCompetition.id, { status: nextStatus });
    router.refresh();
  }

  async function handleCreateGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCompetition || !isInProgress || isFinalized) {
      showFeedback("error", "Os grupos so podem ser criados quando a competicao estiver em andamento.");
      return;
    }

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
    if (!selectedCompetition || !isInProgress || isFinalized) {
      showFeedback("error", "As partidas so podem ser geradas quando a competicao estiver em andamento.");
      return;
    }

    try {
      for (const group of competitionGroups) {
        const groupAthletes = competitionAthletesByGroup.get(group.id) ?? [];
        const existingMatches = competitionMatches.filter((match) => match.id_grupo === group.id);
        if (existingMatches.length > 0) continue;

        if (groupAthletes.length < 2) {
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

      showFeedback("success", "Partidas geradas a partir dos atletas inscritos.");
      router.refresh();
    } catch {
      showFeedback("error", "Nao foi possivel gerar as partidas.");
    }
  }

  async function handleAssignAthlete(groupId: number, slotKey: string) {
    if (!selectedCompetition || isFinalized) return;
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
    if (!selectedMatch || isFinalized) return;

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
    if (!selectedMatch || isFinalized) return;

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

    try {
      if (selectedMatchResult) {
        await patchAdminRecord("result", selectedMatchResult.id, payload);
      } else {
        await postAdminRecord("result", payload);
      }

      await patchAdminRecord("match", selectedMatch.id, {
        id_grupo: selectedMatch.id_grupo,
        id_arbitro: selectedMatch.id_arbitro,
        numero_mesa: selectedMatch.numero_mesa,
        status: "finalizada",
        fase: selectedMatch.fase,
      });

      showFeedback("success", "Sets salvos e partida finalizada.");
      router.refresh();
    } catch {
      showFeedback("error", "Nao foi possivel salvar os sets da partida.");
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
      {feedback ? (
        <div
          className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border px-4 py-3 text-sm shadow-2xl transition ${
            feedback.kind === "success"
              ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-50"
              : "border-red-400/30 bg-red-500/15 text-red-50"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-200/80">Automacao de competicoes</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Competições cadastradas</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
            Selecione uma competição para ver grupos, colocar jogadores, gerar partidas e abrir os detalhes da partida.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleGenerateMatches}
            disabled={!selectedCompetition || !isInProgress || isFinalized}
            className={primaryButtonClassName}
          >
            Gerar partidas
          </button>
          <button
            type="button"
            onClick={() => updateCompetitionStatus("Aguardando inscricoes")}
            disabled={!selectedCompetition || isFinalized || selectedCompetitionStatus === "Aguardando inscricoes"}
            className={secondaryButtonClassName}
          >
            Aguardando inscrições
          </button>
          <button
            type="button"
            onClick={() => updateCompetitionStatus("Em andamento")}
            disabled={!selectedCompetition || isFinalized || selectedCompetitionStatus === "Em andamento"}
            className={secondaryButtonClassName}
          >
            Em andamento
          </button>
          <button
            type="button"
            onClick={() => updateCompetitionStatus("Finalizado")}
            disabled={!selectedCompetition || isFinalized}
            className={secondaryButtonClassName}
          >
            Finalizar
          </button>
        </div>
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
            <p className="mt-2 text-sm text-zinc-400">Status: {competitionStatusLabel[normalizedCompetitionStatus(competition.status)]}</p>
          </button>
        ))}
      </div>

      {selectedCompetition ? (
        <div className="mt-8 grid gap-6">
          {isAwaitingRegistrations ? (
            <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Fase de inscrições</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{selectedCompetition.nome}</h3>
                  <p className="mt-2 text-sm text-zinc-400">Cadastre atletas na competição e marque a inscrição como confirmada ou não.</p>
                </div>
                <span className="rounded-full bg-amber-300/15 px-4 py-2 text-xs font-semibold text-amber-100">{competitionStatusLabel[selectedCompetitionStatus]}</span>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">Nova inscrição</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.3em] text-zinc-500">Selecione um atleta e confirme a inscrição</p>
                  <div className="mt-4 grid gap-4">
                    <div>
                      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-3">
                        <label className="mb-3 block text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Buscar atleta
                          <input
                            value={registrationSearch}
                            onChange={(event) => setRegistrationSearch(event.target.value)}
                            placeholder="Digite o nome do atleta"
                            className={`${inputClassName} mt-2`}
                          />
                        </label>
                        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                          {filteredAthletesForRegistration.length > 0 ? filteredAthletesForRegistration.map((athlete) => {
                            const selected = playerBySlot[`registration-${selectedCompetition.id}`] === String(athlete.id);

                            return (
                              <button
                                key={athlete.id}
                                type="button"
                                onClick={() => setPlayerBySlot((current) => ({ ...current, [`registration-${selectedCompetition.id}`]: String(athlete.id) }))}
                                className={`w-full rounded-2xl border p-3 text-left transition duration-200 hover:-translate-y-0.5 active:scale-[0.99] ${
                                  selected
                                    ? "border-amber-300/60 bg-amber-300/10"
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-white">{athlete.nome} {athlete.sobrenome}</p>
                                    <p className="mt-1 text-xs text-zinc-300">
                                      {clubById.get(athlete.id_clube)?.nome ?? "Sem clube"} · {athlete.idade} anos · {athlete.sexo}
                                    </p>
                                  </div>
                                  <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-semibold text-zinc-200">
                                    Selecionar
                                  </span>
                                </div>
                              </button>
                            );
                          }) : (
                            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
                              {registrationSearch.trim() ? "Nenhum atleta encontrado com esse nome." : "Não há atletas disponíveis para inscrição."}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        const athleteId = Number(playerBySlot[`registration-${selectedCompetition.id}`]);
                        if (!athleteId) {
                          showFeedback("error", "Selecione um atleta para registrar.");
                          return;
                        }

                        await onCreate("registration", {
                          id_atleta: athleteId,
                          id_competicao: selectedCompetition.id,
                          id_grupo: null,
                          inscricao_confirmada: false,
                        });

                        setPlayerBySlot((current) => ({ ...current, [`registration-${selectedCompetition.id}`]: "" }));
                        showFeedback("success", "Inscrição criada com sucesso.");
                        router.refresh();
                      }}
                      disabled={availableAthletesForRegistration.length === 0}
                      className={primaryButtonClassName}
                    >
                      Criar inscrição
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <div className="max-h-80 overflow-y-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="sticky top-0 bg-white/5 text-zinc-300">
                        <tr>
                          <th className="px-4 py-3">Atleta</th>
                          <th className="px-4 py-3">Clube</th>
                          <th className="px-4 py-3">Idade</th>
                          <th className="px-4 py-3">Sexo</th>
                          <th className="px-4 py-3">Confirmada</th>
                          <th className="px-4 py-3">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrationRows.length > 0 ? registrationRows.map(({ registration, athlete }) => {
                          const club = clubById.get(athlete.id_clube);

                          return (
                            <tr key={registration.id} className="border-t border-white/10">
                              <td className="px-4 py-3 font-medium text-white">{athlete.nome} {athlete.sobrenome}</td>
                              <td className="px-4 py-3 text-white">{club ? club.nome : "Sem clube"}</td>
                              <td className="px-4 py-3 text-white">{athlete.idade}</td>
                              <td className="px-4 py-3 text-white">{athlete.sexo}</td>
                              <td className="px-4 py-3 text-white">{registration.inscricao_confirmada ? "Sim" : "Nao"}</td>
                              <td className="px-4 py-3">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await onUpdate("registration", registration.id, {
                                      id_atleta: registration.id_atleta,
                                      id_competicao: registration.id_competicao,
                                      id_grupo: registration.id_grupo,
                                      inscricao_confirmada: !registration.inscricao_confirmada,
                                    });
                                    showFeedback("success", "Status da inscrição atualizado.");
                                  }}
                                  className={smallButtonClassName}
                                >
                                  {registration.inscricao_confirmada ? "Desconfirmar" : "Confirmar"}
                                </button>
                              </td>
                            </tr>
                          );
                        }) : (
                          <tr className="border-t border-white/10">
                            <td className="px-4 py-3 text-zinc-400" colSpan={6}>
                              Nenhuma inscrição cadastrada ainda.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className={`${isAwaitingRegistrations ? "hidden" : ""} rounded-3xl border border-white/10 bg-zinc-950/60 p-5`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Grupos da competição</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{selectedCompetition.nome}</h3>
              </div>
              <form onSubmit={handleCreateGroup} className="grid gap-3 md:grid-cols-[1.2fr_0.7fr_auto] md:items-end" aria-disabled={isFinalized}>
                <label className="grid gap-2 text-sm text-zinc-200">
                  <span>Nome do grupo</span>
                  <input name="nome" className={inputClassName} placeholder="Ex.: Grupo A" required disabled={isFinalized} />
                </label>
                <label className="grid gap-2 text-sm text-zinc-200">
                  <span>Jogadores</span>
                  <input name="quantidade_jogadores" type="number" min="0" className={inputClassName} placeholder="0" required disabled={isFinalized} />
                </label>
                <button type="submit" disabled={isFinalized} className={primaryButtonClassName}>
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
                        <button type="button" onClick={async () => { await onDelete("group", group.id); }} disabled={isFinalized} className={dangerButtonClassName}>
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
                                        disabled={!playerBySlot[slotKey] || isFinalized}
                                        className={primaryButtonClassName}
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

          <div className={`${isAwaitingRegistrations ? "hidden" : ""} grid gap-6 xl:grid-cols-[1fr_1fr]`}>
            <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Partidas geradas</p>
              <div className="mt-4 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
                {competitionMatchesOrdered.length > 0 ? (
                  competitionMatchesOrdered.map((match) => (
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
                          <p className="text-sm font-semibold text-white">Partida #{matchNumberById.get(match.id) ?? match.id}</p>
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
                    <p className="font-semibold text-white">Partida #{selectedMatchDisplayNumber ?? selectedMatch.id}</p>
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

                  <form onSubmit={handleSaveMatchSettings} className="grid gap-4" aria-disabled={isFinalized}>
                    <label className="grid gap-2 text-sm text-zinc-200">
                      <span>Arbitro</span>
                      <select name="id_arbitro" defaultValue={selectedMatch.id_arbitro ?? ""} className={selectClassName} disabled={isFinalized}>
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
                      <input name="numero_mesa" type="number" defaultValue={selectedMatch.numero_mesa ?? ""} className={inputClassName} disabled={isFinalized} />
                    </label>
                    <button type="submit" disabled={isFinalized} className={secondaryButtonClassName}>
                      Salvar dados da partida
                    </button>
                    <button
                      type="button"
                      onClick={handleStartMatch}
                      disabled={selectedMatch.status === "em andamento" || isFinalized}
                      className={primaryButtonClassName}
                    >
                      Iniciar partida
                    </button>
                  </form>

                  {selectedMatch.status === "em andamento" ? (
                    <form onSubmit={handleSaveResult} className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-semibold text-white">Sets da partida</p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Jogador 1{selectedMatchAthletes[0] ? ` · ${selectedMatchAthletes[0].nome} ${selectedMatchAthletes[0].sobrenome}` : ""}</p>
                          <div className="mt-4 grid gap-3">
                            <label className="grid gap-2 text-sm text-zinc-200">Set 1<input name="time1_set1" type="number" min="0" defaultValue={selectedMatchResult?.time1_set1 ?? 0} className={inputClassName} /></label>
                            <label className="grid gap-2 text-sm text-zinc-200">Set 2<input name="time1_set2" type="number" min="0" defaultValue={selectedMatchResult?.time1_set2 ?? 0} className={inputClassName} /></label>
                            <label className="grid gap-2 text-sm text-zinc-200">Set 3<input name="time1_set3" type="number" min="0" defaultValue={selectedMatchResult?.time1_set3 ?? 0} className={inputClassName} /></label>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Jogador 2{selectedMatchAthletes[1] ? ` · ${selectedMatchAthletes[1].nome} ${selectedMatchAthletes[1].sobrenome}` : ""}</p>
                          <div className="mt-4 grid gap-3">
                            <label className="grid gap-2 text-sm text-zinc-200">Set 1<input name="time2_set1" type="number" min="0" defaultValue={selectedMatchResult?.time2_set1 ?? 0} className={inputClassName} /></label>
                            <label className="grid gap-2 text-sm text-zinc-200">Set 2<input name="time2_set2" type="number" min="0" defaultValue={selectedMatchResult?.time2_set2 ?? 0} className={inputClassName} /></label>
                            <label className="grid gap-2 text-sm text-zinc-200">Set 3<input name="time2_set3" type="number" min="0" defaultValue={selectedMatchResult?.time2_set3 ?? 0} className={inputClassName} /></label>
                          </div>
                        </div>
                      </div>
                      <button type="submit" disabled={isFinalized} className={primaryButtonClassName}>
                        Salvar sets e finalizar partida
                      </button>
                    </form>
                  ) : selectedMatchFinalized ? (
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-white">
                      <p className="font-semibold">Resultado final</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Jogador 1</p>
                          <p className="mt-2 text-sm font-semibold text-white">
                            {selectedMatchAthletes[0] ? `${selectedMatchAthletes[0].nome} ${selectedMatchAthletes[0].sobrenome}` : "-"}
                          </p>
                          <p className="mt-3 text-sm text-white">
                            Sets: {selectedMatchResult ? `${selectedMatchResult.time1_set1} / ${selectedMatchResult.time1_set2} / ${selectedMatchResult.time1_set3}` : "-"}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Jogador 2</p>
                          <p className="mt-2 text-sm font-semibold text-white">
                            {selectedMatchAthletes[1] ? `${selectedMatchAthletes[1].nome} ${selectedMatchAthletes[1].sobrenome}` : "-"}
                          </p>
                          <p className="mt-3 text-sm text-white">
                            Sets: {selectedMatchResult ? `${selectedMatchResult.time2_set1} / ${selectedMatchResult.time2_set2} / ${selectedMatchResult.time2_set3}` : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
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
