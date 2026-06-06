import { supabaseServer } from "@/lib/supabaseServer";
import type {
  Arbitro,
  Atleta,
  Categoria,
  Clube,
  Competicao,
  Grupo,
  Inscricao,
  Modalidade,
  PartidaAtleta,
  Partida,
  ResultadoPartida,
} from "./types";

export type AdminPanelData = {
  clubs: Clube[];
  athletes: Atleta[];
  referees: Arbitro[];
  categories: Categoria[];
  modalities: Modalidade[];
  competitions: Competicao[];
  groups: Grupo[];
  registrations: Inscricao[];
  matchAthletes: PartidaAtleta[];
  matches: Partida[];
  results: ResultadoPartida[];
};

export type AdminResource =
  | "club"
  | "athlete"
  | "referee"
  | "category"
  | "modality"
  | "competition"
  | "group"
  | "match"
  | "matchAthlete"
  | "result"
  | "registration";

const resourceTables: Record<AdminResource, string> = {
  club: "clube",
  athlete: "atleta",
  referee: "arbitro",
  category: "categoria",
  modality: "modalidade",
  competition: "competicao",
  group: "grupo",
  match: "partida",
  matchAthlete: "partida_atleta",
  result: "resultado_partida",
  registration: "inscricao",
};

function getTableName(resource: AdminResource) {
  return resourceTables[resource];
}

async function listTable<T>(tableName: string) {
  const { data, error } = await supabaseServer.from(tableName).select("*");

  if (error) {
    throw error;
  }

  return (data ?? []) as T[];
}

export async function getAdminPanelData(): Promise<AdminPanelData> {
  const [clubs, athletes, referees, categories, modalities, competitions, groups, registrations, matchAthletes, matches, results] =
    await Promise.all([
      listTable<Clube>("clube"),
      listTable<Atleta>("atleta"),
      listTable<Arbitro>("arbitro"),
      listTable<Categoria>("categoria"),
      listTable<Modalidade>("modalidade"),
      listTable<Competicao>("competicao"),
      listTable<Grupo>("grupo"),
      listTable<Inscricao>("inscricao"),
      listTable<PartidaAtleta>("partida_atleta"),
      listTable<Partida>("partida"),
      listTable<ResultadoPartida>("resultado_partida"),
    ]);

  return {
    clubs,
    athletes,
    referees,
    categories,
    modalities,
    competitions,
    groups,
    registrations,
    matchAthletes,
    matches,
    results,
  };
}

export async function createAdminRecord(
  resource: AdminResource,
  payload: Record<string, unknown>,
) {
  const tableName = getTableName(resource);
  const { data, error } = await supabaseServer
    .from(tableName)
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateAdminRecord(
  resource: AdminResource,
  id: number,
  payload: Record<string, unknown>,
) {
  const tableName = getTableName(resource);
  const { data, error } = await supabaseServer
    .from(tableName)
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteAdminRecord(resource: AdminResource, id: number) {
  const tableName = getTableName(resource);
  const { error } = await supabaseServer.from(tableName).delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function upsertRegistration(payload: Omit<Inscricao, "id">) {
  const { data: existing, error: existingError } = await supabaseServer
    .from("inscricao")
    .select("id")
    .eq("id_atleta", payload.id_atleta)
    .eq("id_competicao", payload.id_competicao)
    .maybeSingle<{ id: number }>();

  if (existingError) {
    throw existingError;
  }

  const registrationPayload = {
    ...payload,
    inscricao_confirmada: payload.inscricao_confirmada ?? false,
  };

  if (existing) {
    const { data, error } = await supabaseServer
      .from("inscricao")
      .update(registrationPayload)
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as Inscricao;
  }

  const { data, error } = await supabaseServer.from("inscricao").insert(registrationPayload).select("*").single();

  if (error) {
    throw error;
  }

  return data as Inscricao;
}

export async function deleteRegistrationById(id: number) {
  const { error } = await supabaseServer.from("inscricao").delete().eq("id", id);

  if (error) {
    throw error;
  }
}