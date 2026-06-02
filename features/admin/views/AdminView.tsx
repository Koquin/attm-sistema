"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { AdminPanelData } from "@/lib/db/admin";
import { CompetitionAutomationPanel } from "./CompetitionAutomationPanel";

const sections = [
  { key: "competitions", label: "Competicoes" },
  { key: "athletes", label: "Atletas" },
  { key: "clubs", label: "Clubes" },
  { key: "referees", label: "Arbitros" },
  { key: "categories", label: "Categorias" },
  { key: "modalities", label: "Modalidades" },
] as const;

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-amber-300/60";

const selectClassName =
  "w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-amber-300/60";

type AdminViewProps = {
  initialData: AdminPanelData;
  currentAdmin: {
    sub: string;
    uid: string;
    login: string;
    nome: string;
  };
};

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

type SidebarRecord = {
  id: number;
  label: string;
  resource: AdminResource;
  data: Record<string, unknown>;
};

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  label: string;
  name: string;
  options: Option[];
  placeholder: string;
  defaultValue?: string;
};

type TextProps = {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  defaultValue?: string | number;
};

export function AdminView({ initialData, currentAdmin }: AdminViewProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<(typeof sections)[number]["key"]>("competitions");
  const [editingRecord, setEditingRecord] = useState<SidebarRecord | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const ownerId = currentAdmin.uid;

  const clubOptions = useMemo(
    () => initialData.clubs.map((club) => ({ value: String(club.id), label: `${club.nome} - ${club.estado}` })),
    [initialData.clubs],
  );
  const categoryOptions = useMemo(
    () => initialData.categories.map((category) => ({ value: String(category.id), label: `${category.sexo} - ${category.idade}` })),
    [initialData.categories],
  );
  const modalityOptions = useMemo(
    () => initialData.modalities.map((modality) => ({ value: String(modality.id), label: modality.nome })),
    [initialData.modalities],
  );
  const competitionOptions = useMemo(
    () => initialData.competitions.map((competition) => ({ value: String(competition.id), label: competition.nome })),
    [initialData.competitions],
  );
  const groupOptions = useMemo(
    () => initialData.groups.map((group) => ({ value: String(group.id), label: group.nome })),
    [initialData.groups],
  );
  const refereeOptions = useMemo(
    () => initialData.referees.map((referee) => ({ value: String(referee.id), label: `${referee.nome} ${referee.sobrenome}` })),
    [initialData.referees],
  );
  const matchOptions = useMemo(
    () => initialData.matches.map((match) => ({ value: String(match.id), label: `Partida #${match.id}` })),
    [initialData.matches],
  );

  const sidebarRecords = useMemo<SidebarRecord[]>(() => {
    switch (activeSection) {
      case "competitions":
        return initialData.competitions.map((competition) => ({
          id: competition.id,
          label: competition.nome,
          resource: "competition",
          data: competition,
        }));
      case "athletes":
        return initialData.athletes.map((athlete) => ({
          id: athlete.id,
          label: `${athlete.nome} ${athlete.sobrenome}`,
          resource: "athlete",
          data: athlete,
        }));
      case "clubs":
        return initialData.clubs.map((club) => ({ id: club.id, label: club.nome, resource: "club", data: club }));
      case "referees":
        return initialData.referees.map((referee) => ({
          id: referee.id,
          label: `${referee.nome} ${referee.sobrenome}`,
          resource: "referee",
          data: referee,
        }));
      case "categories":
        return initialData.categories.map((category) => ({
          id: category.id,
          label: `${category.sexo} - ${category.idade}`,
          resource: "category",
          data: category,
        }));
      case "modalities":
      default:
        return initialData.modalities.map((modality) => ({ id: modality.id, label: modality.nome, resource: "modality", data: modality }));
    }
  }, [activeSection, initialData]);

  async function handleLogout() {
    setLogoutLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLogoutLoading(false);
    }
  }

  async function createRecord(resource: AdminResource, payload: AdminRecordPayload) {
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource, payload }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string; details?: string; hint?: string } | null;
        const message = data?.error ?? "Falha ao salvar registro.";
        window.alert(data?.details ? `${message}\n${data.details}${data.hint ? `\n${data.hint}` : ""}` : message);
        return;
      }

      router.refresh();
    } catch {
      window.alert("Nao foi possivel conectar ao servidor.");
    }
  }

  async function updateRecord(resource: AdminResource, id: number, payload: AdminRecordPayload) {
    try {
      const response = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource, id, payload }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string; details?: string; hint?: string } | null;
        const message = data?.error ?? "Falha ao atualizar registro.";
        window.alert(data?.details ? `${message}\n${data.details}${data.hint ? `\n${data.hint}` : ""}` : message);
        return;
      }

      router.refresh();
    } catch {
      window.alert("Nao foi possivel conectar ao servidor.");
    }
  }

  async function deleteRecord(resource: AdminResource, id: number) {
    try {
      const response = await fetch("/api/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource, id }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string; details?: string; hint?: string } | null;
        const message = data?.error ?? "Falha ao remover registro.";
        window.alert(data?.details ? `${message}\n${data.details}${data.hint ? `\n${data.hint}` : ""}` : message);
        return;
      }

      if (editingRecord?.id === id && editingRecord.resource === resource) {
        setEditingRecord(null);
      }

      router.refresh();
    } catch {
      window.alert("Nao foi possivel conectar ao servidor.");
    }
  }

  async function handleQuickEdit(record: SidebarRecord) {
    const currentValue = JSON.stringify(record.data, null, 2);
    const nextValue = window.prompt("Edite o registro em JSON", currentValue);

    if (!nextValue) {
      return;
    }

    const parsed = JSON.parse(nextValue) as Record<string, unknown>;
    delete parsed.id;
    await updateRecord(record.resource, record.id, parsed);
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-amber-200/10 via-zinc-950 to-zinc-900 p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-amber-200/80">Painel administrativo</p>
              <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Gestao completa de competicoes</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">Cadastro e manutencao dos dados do sistema diretamente no backend.</p>
              <p className="mt-3 text-xs uppercase tracking-[0.35em] text-zinc-500">Logado como {currentAdmin.nome} ({currentAdmin.login})</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutLoading}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {logoutLoading ? "Saindo..." : "Sair"}
            </button>
          </div>
        </header>

        <nav className="flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => {
                setActiveSection(section.key);
                setEditingRecord(null);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeSection === section.key
                  ? "bg-white text-zinc-950"
                  : "bg-transparent text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6">
            {activeSection === "competitions" && (
              <CompetitionForm
                competition={editingRecord?.resource === "competition" ? (editingRecord.data as AdminPanelData["competitions"][number]) : null}
                ownerId={ownerId}
                modalityOptions={modalityOptions}
                categoryOptions={categoryOptions}
                onCreate={createRecord}
                onUpdate={updateRecord}
              />
            )}
            {activeSection === "athletes" && (
              <AthleteForm
                athlete={editingRecord?.resource === "athlete" ? (editingRecord.data as AdminPanelData["athletes"][number]) : null}
                clubOptions={clubOptions}
                onCreate={createRecord}
                onUpdate={updateRecord}
              />
            )}
            {activeSection === "clubs" && (
              <ClubForm
                club={editingRecord?.resource === "club" ? (editingRecord.data as AdminPanelData["clubs"][number]) : null}
                onCreate={createRecord}
                onUpdate={updateRecord}
              />
            )}
            {activeSection === "referees" && (
              <RefereeForm
                referee={editingRecord?.resource === "referee" ? (editingRecord.data as AdminPanelData["referees"][number]) : null}
                onCreate={createRecord}
                onUpdate={updateRecord}
              />
            )}
            {activeSection === "categories" && (
              <CategoryForm
                category={editingRecord?.resource === "category" ? (editingRecord.data as AdminPanelData["categories"][number]) : null}
                onCreate={createRecord}
                onUpdate={updateRecord}
              />
            )}
            {activeSection === "modalities" && (
              <ModalityForm
                modality={editingRecord?.resource === "modality" ? (editingRecord.data as AdminPanelData["modalities"][number]) : null}
                onCreate={createRecord}
                onUpdate={updateRecord}
              />
            )}
          </section>

          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">{sections.find((section) => section.key === activeSection)?.label}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-300">Aqui aparecem todos os itens atuais da secao selecionada.</p>

            <div className="mt-6 max-h-[34rem] space-y-3 overflow-y-auto pr-1">
              {sidebarRecords.length > 0 ? (
                sidebarRecords.map((record) => (
                  <div key={record.id} className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                    <p className="text-sm font-semibold text-white">{record.label}</p>
                    <p className="mt-1 text-xs text-zinc-500">ID {record.id}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRecord(record);
                          handleQuickEdit(record).catch(() => undefined);
                        }}
                        className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-zinc-950"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void deleteRecord(record.resource, record.id);
                        }}
                        className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-200"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4 text-sm text-zinc-400">
                  Nenhum item cadastrado nesta secao.
                </div>
              )}
            </div>

          </aside>
        </div>

        {activeSection === "competitions" ? (
          <CompetitionAutomationPanel
            competitions={initialData.competitions}
            groups={initialData.groups}
            athletes={initialData.athletes}
            registrations={initialData.registrations}
            matchAthletes={initialData.matchAthletes}
            matches={initialData.matches}
            results={initialData.results}
            referees={initialData.referees}
            onCreate={createRecord}
            onUpdate={updateRecord}
            onDelete={deleteRecord}
          />
        ) : null}
      </div>
    </div>
  );
}

function FieldShell({
  title,
  description,
  submitLabel,
  children,
}: {
  title: string;
  description: string;
  submitLabel: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{description}</p>
      <div className="mt-6 grid gap-4">{children}</div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" className="rounded-full bg-amber-300 px-5 py-2 text-sm font-semibold text-zinc-950">{submitLabel}</button>
        <button type="reset" className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white">Limpar</button>
      </div>
    </div>
  );
}

function TextField({
  label,
  name,
  placeholder,
  type = "text",
  defaultValue,
}: TextProps) {
  return (
    <label className="grid gap-2 text-sm text-zinc-200">
      <span>{label}</span>
      <input name={name} type={type} placeholder={placeholder} defaultValue={defaultValue} className={inputClassName} />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  placeholder,
  defaultValue = "",
}: SelectProps) {
  return (
    <label className="grid gap-2 text-sm text-zinc-200">
      <span>{label}</span>
      <select name={name} defaultValue={defaultValue} required className={selectClassName}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function CompetitionForm({
  competition,
  ownerId,
  modalityOptions,
  categoryOptions,
  onCreate,
  onUpdate,
}: {
  competition: AdminPanelData["competitions"][number] | null;
  ownerId: string;
  modalityOptions: Option[];
  categoryOptions: Option[];
  onCreate: (resource: AdminResource, payload: AdminRecordPayload) => Promise<void>;
  onUpdate: (resource: AdminResource, id: number, payload: AdminRecordPayload) => Promise<void>;
}) {
  const isEditing = Boolean(competition);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      nome: String(formData.get("nome") ?? ""),
      id_modalidade: Number(formData.get("id_modalidade")),
      id_categoria: Number(formData.get("id_categoria")),
      id_usuario: ownerId,
      status: String(formData.get("status") ?? ""),
    };

    if (competition) {
      await onUpdate("competition", competition.id, payload);
    } else {
      await onCreate("competition", payload);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldShell title="Competicoes" description="Cadastrar ou editar competicoes." submitLabel={isEditing ? "Atualizar" : "Salvar"}>
        <TextField label="Nome da competicao" name="nome" placeholder="Nome da competicao" defaultValue={competition?.nome} />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Modalidade" name="id_modalidade" options={modalityOptions} placeholder="Selecione a modalidade" defaultValue={competition ? String(competition.id_modalidade) : ""} />
          <SelectField label="Categoria" name="id_categoria" options={categoryOptions} placeholder="Selecione a categoria" defaultValue={competition ? String(competition.id_categoria) : ""} />
        </div>
        <TextField label="Status" name="status" placeholder="Status" defaultValue={competition?.status} />
      </FieldShell>
    </form>
  );
}

function AthleteForm({
  athlete,
  clubOptions,
  onCreate,
  onUpdate,
}: {
  athlete: AdminPanelData["athletes"][number] | null;
  clubOptions: Option[];
  onCreate: (resource: AdminResource, payload: AdminRecordPayload) => Promise<void>;
  onUpdate: (resource: AdminResource, id: number, payload: AdminRecordPayload) => Promise<void>;
}) {
  const isEditing = Boolean(athlete);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      nome: String(formData.get("nome") ?? ""),
      sobrenome: String(formData.get("sobrenome") ?? ""),
      idade: Number(formData.get("idade")),
      id_clube: Number(formData.get("id_clube")),
    };

    if (athlete) {
      await onUpdate("athlete", athlete.id, payload);
    } else {
      await onCreate("athlete", payload);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldShell title="Atletas" description="Cadastro de atletas com relacao obrigatoria a um clube." submitLabel={isEditing ? "Atualizar" : "Salvar"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Nome" name="nome" placeholder="Nome" defaultValue={athlete?.nome} />
          <TextField label="Sobrenome" name="sobrenome" placeholder="Sobrenome" defaultValue={athlete?.sobrenome} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Idade" name="idade" placeholder="Idade" type="number" defaultValue={athlete?.idade ?? ""} />
          <SelectField label="Clube" name="id_clube" options={clubOptions} placeholder="Selecione o clube" defaultValue={athlete ? String(athlete.id_clube) : ""} />
        </div>
      </FieldShell>
    </form>
  );
}

function ClubForm({
  club,
  onCreate,
  onUpdate,
}: {
  club: AdminPanelData["clubs"][number] | null;
  onCreate: (resource: AdminResource, payload: AdminRecordPayload) => Promise<void>;
  onUpdate: (resource: AdminResource, id: number, payload: AdminRecordPayload) => Promise<void>;
}) {
  const isEditing = Boolean(club);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      nome: String(formData.get("nome") ?? ""),
      estado: String(formData.get("estado") ?? ""),
    };

    if (club) {
      await onUpdate("club", club.id, payload);
    } else {
      await onCreate("club", payload);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldShell title="Clubes" description="Cadastro simples de clubes." submitLabel={isEditing ? "Atualizar" : "Salvar"}>
        <TextField label="Nome do clube" name="nome" placeholder="Nome do clube" defaultValue={club?.nome} />
        <TextField label="Estado" name="estado" placeholder="Estado" defaultValue={club?.estado} />
      </FieldShell>
    </form>
  );
}

function MatchForm({
  match,
  groupOptions,
  refereeOptions,
  onCreate,
  onUpdate,
}: {
  match: AdminPanelData["matches"][number] | null;
  groupOptions: Option[];
  refereeOptions: Option[];
  onCreate: (resource: AdminResource, payload: AdminRecordPayload) => Promise<void>;
  onUpdate: (resource: AdminResource, id: number, payload: AdminRecordPayload) => Promise<void>;
}) {
  const isEditing = Boolean(match);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      id_grupo: Number(formData.get("id_grupo")),
      id_arbitro: Number(formData.get("id_arbitro")),
      numero_mesa: Number(formData.get("numero_mesa")),
      status: String(formData.get("status") ?? ""),
      fase: String(formData.get("fase") ?? ""),
    };

    if (match) {
      await onUpdate("match", match.id, payload);
    } else {
      await onCreate("match", payload);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldShell title="Partidas" description="Controle de partida, grupo, arbitro, mesa, status e fase." submitLabel={isEditing ? "Atualizar" : "Salvar"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Grupo" name="id_grupo" options={groupOptions} placeholder="Selecione o grupo" defaultValue={match?.id_grupo ? String(match.id_grupo) : ""} />
          <SelectField label="Arbitro" name="id_arbitro" options={refereeOptions} placeholder="Selecione o arbitro" defaultValue={match?.id_arbitro ? String(match.id_arbitro) : ""} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Numero da mesa" name="numero_mesa" placeholder="Numero da mesa" type="number" defaultValue={match?.numero_mesa ?? ""} />
          <TextField label="Status" name="status" placeholder="Status" defaultValue={match?.status} />
        </div>
        <TextField label="Fase" name="fase" placeholder="Fase" defaultValue={match?.fase} />
      </FieldShell>
    </form>
  );
}

function GroupForm({
  group,
  competitionOptions,
  onCreate,
  onUpdate,
}: {
  group: AdminPanelData["groups"][number] | null;
  competitionOptions: Option[];
  onCreate: (resource: AdminResource, payload: AdminRecordPayload) => Promise<void>;
  onUpdate: (resource: AdminResource, id: number, payload: AdminRecordPayload) => Promise<void>;
}) {
  const isEditing = Boolean(group);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      id_competicao: Number(formData.get("id_competicao")),
      nome: String(formData.get("nome") ?? ""),
    };

    if (group) {
      await onUpdate("group", group.id, payload);
    } else {
      await onCreate("group", payload);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldShell title="Grupos" description="Cadastro de grupos por competicao." submitLabel={isEditing ? "Atualizar" : "Salvar"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Competicao" name="id_competicao" options={competitionOptions} placeholder="Selecione a competicao" defaultValue={group?.id_competicao ? String(group.id_competicao) : ""} />
          <TextField label="Nome do grupo" name="nome" placeholder="Nome do grupo" defaultValue={group?.nome} />
        </div>
      </FieldShell>
    </form>
  );
}

function ResultForm({
  result,
  matchOptions,
  onCreate,
  onUpdate,
}: {
  result: AdminPanelData["results"][number] | null;
  matchOptions: Option[];
  onCreate: (resource: AdminResource, payload: AdminRecordPayload) => Promise<void>;
  onUpdate: (resource: AdminResource, id: number, payload: AdminRecordPayload) => Promise<void>;
}) {
  const isEditing = Boolean(result);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      id_partida: Number(formData.get("id_partida")),
      time1_set1: Number(formData.get("time1_set1")),
      time1_set2: Number(formData.get("time1_set2")),
      time1_set3: Number(formData.get("time1_set3")),
      time2_set1: Number(formData.get("time2_set1")),
      time2_set2: Number(formData.get("time2_set2")),
      time2_set3: Number(formData.get("time2_set3")),
    };

    if (result) {
      await onUpdate("result", result.id, payload);
    } else {
      await onCreate("result", payload);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldShell title="Resultados" description="Registro dos sets por partida." submitLabel={isEditing ? "Atualizar" : "Salvar"}>
        <SelectField label="Partida" name="id_partida" options={matchOptions} placeholder="Selecione a partida" defaultValue={result ? String(result.id_partida) : ""} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Time 1 Set 1" name="time1_set1" placeholder="Time 1 Set 1" type="number" defaultValue={result?.time1_set1 ?? 0} />
          <TextField label="Time 2 Set 1" name="time2_set1" placeholder="Time 2 Set 1" type="number" defaultValue={result?.time2_set1 ?? 0} />
          <TextField label="Time 1 Set 2" name="time1_set2" placeholder="Time 1 Set 2" type="number" defaultValue={result?.time1_set2 ?? 0} />
          <TextField label="Time 2 Set 2" name="time2_set2" placeholder="Time 2 Set 2" type="number" defaultValue={result?.time2_set2 ?? 0} />
          <TextField label="Time 1 Set 3" name="time1_set3" placeholder="Time 1 Set 3" type="number" defaultValue={result?.time1_set3 ?? 0} />
          <TextField label="Time 2 Set 3" name="time2_set3" placeholder="Time 2 Set 3" type="number" defaultValue={result?.time2_set3 ?? 0} />
        </div>
      </FieldShell>
    </form>
  );
}

function RefereeForm({
  referee,
  onCreate,
  onUpdate,
}: {
  referee: AdminPanelData["referees"][number] | null;
  onCreate: (resource: AdminResource, payload: AdminRecordPayload) => Promise<void>;
  onUpdate: (resource: AdminResource, id: number, payload: AdminRecordPayload) => Promise<void>;
}) {
  const isEditing = Boolean(referee);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      nome: String(formData.get("nome") ?? ""),
      sobrenome: String(formData.get("sobrenome") ?? ""),
    };

    if (referee) {
      await onUpdate("referee", referee.id, payload);
    } else {
      await onCreate("referee", payload);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldShell title="Arbitros" description="Cadastro de arbitros." submitLabel={isEditing ? "Atualizar" : "Salvar"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Nome" name="nome" placeholder="Nome" defaultValue={referee?.nome} />
          <TextField label="Sobrenome" name="sobrenome" placeholder="Sobrenome" defaultValue={referee?.sobrenome} />
        </div>
      </FieldShell>
    </form>
  );
}

function CategoryForm({
  category,
  onCreate,
  onUpdate,
}: {
  category: AdminPanelData["categories"][number] | null;
  onCreate: (resource: AdminResource, payload: AdminRecordPayload) => Promise<void>;
  onUpdate: (resource: AdminResource, id: number, payload: AdminRecordPayload) => Promise<void>;
}) {
  const isEditing = Boolean(category);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      sexo: String(formData.get("sexo") ?? ""),
      idade: String(formData.get("idade") ?? ""),
    };

    if (category) {
      await onUpdate("category", category.id, payload);
    } else {
      await onCreate("category", payload);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldShell title="Categorias" description="Cadastro de categorias." submitLabel={isEditing ? "Atualizar" : "Salvar"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Sexo" name="sexo" placeholder="Sexo" defaultValue={category?.sexo} />
          <TextField label="Idade" name="idade" placeholder="Idade" defaultValue={category?.idade} />
        </div>
      </FieldShell>
    </form>
  );
}

function ModalityForm({
  modality,
  onCreate,
  onUpdate,
}: {
  modality: AdminPanelData["modalities"][number] | null;
  onCreate: (resource: AdminResource, payload: AdminRecordPayload) => Promise<void>;
  onUpdate: (resource: AdminResource, id: number, payload: AdminRecordPayload) => Promise<void>;
}) {
  const isEditing = Boolean(modality);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      nome: String(formData.get("nome") ?? ""),
    };

    if (modality) {
      await onUpdate("modality", modality.id, payload);
    } else {
      await onCreate("modality", payload);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldShell title="Modalidades" description="Cadastro de modalidades." submitLabel={isEditing ? "Atualizar" : "Salvar"}>
        <TextField label="Nome da modalidade" name="nome" placeholder="Nome da modalidade" defaultValue={modality?.nome} />
      </FieldShell>
    </form>
  );
}
