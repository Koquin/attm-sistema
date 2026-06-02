import { supabase } from "../supabaseClient";
import {
  Atleta,
  Arbitro,
  Categoria,
  Clube,
  Competicao,
  Grupo,
  Inscricao,
  Modalidade,
  Partida,
  PartidaAtleta,
  ResultadoPartida,
} from "./types";

export async function listClubs(): Promise<Clube[]> {
  const { data, error } = await supabase.from("clube").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getClubById(id: number): Promise<Clube | null> {
  const { data, error } = await supabase
    .from("clube")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data ?? null;
}

export async function createClub(payload: Omit<Clube, "id">): Promise<Clube> {
  const { data, error } = await supabase.from("clube").insert(payload).select("*").single();
  if (error) throw error;
  return data as Clube;
}

export async function updateClub(id: number, payload: Partial<Omit<Clube, "id">>): Promise<Clube> {
  const { data, error } = await supabase
    .from("clube")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Clube;
}

export async function deleteClub(id: number): Promise<void> {
  const { error } = await supabase.from("clube").delete().eq("id", id);
  if (error) throw error;
}

export async function listAthletes(): Promise<Atleta[]> {
  const { data, error } = await supabase.from("atleta").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getAthleteById(id: number): Promise<Atleta | null> {
  const { data, error } = await supabase
    .from("atleta")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data ?? null;
}

export async function createAthlete(payload: Omit<Atleta, "id">): Promise<Atleta> {
  const { data, error } = await supabase.from("atleta").insert(payload).select("*").single();
  if (error) throw error;
  return data as Atleta;
}

export async function updateAthlete(id: number, payload: Partial<Omit<Atleta, "id">>): Promise<Atleta> {
  const { data, error } = await supabase
    .from("atleta")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Atleta;
}

export async function deleteAthlete(id: number): Promise<void> {
  const { error } = await supabase.from("atleta").delete().eq("id", id);
  if (error) throw error;
}

export async function listReferees(): Promise<Arbitro[]> {
  const { data, error } = await supabase.from("arbitro").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getRefereeById(id: number): Promise<Arbitro | null> {
  const { data, error } = await supabase
    .from("arbitro")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data ?? null;
}

export async function createReferee(payload: Omit<Arbitro, "id">): Promise<Arbitro> {
  const { data, error } = await supabase.from("arbitro").insert(payload).select("*").single();
  if (error) throw error;
  return data as Arbitro;
}

export async function updateReferee(id: number, payload: Partial<Omit<Arbitro, "id">>): Promise<Arbitro> {
  const { data, error } = await supabase
    .from("arbitro")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Arbitro;
}

export async function deleteReferee(id: number): Promise<void> {
  const { error } = await supabase.from("arbitro").delete().eq("id", id);
  if (error) throw error;
}

export async function listCategories(): Promise<Categoria[]> {
  const { data, error } = await supabase.from("categoria").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getCategoryById(id: number): Promise<Categoria | null> {
  const { data, error } = await supabase
    .from("categoria")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data ?? null;
}

export async function createCategory(payload: Omit<Categoria, "id">): Promise<Categoria> {
  const { data, error } = await supabase.from("categoria").insert(payload).select("*").single();
  if (error) throw error;
  return data as Categoria;
}

export async function updateCategory(id: number, payload: Partial<Omit<Categoria, "id">>): Promise<Categoria> {
  const { data, error } = await supabase
    .from("categoria")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Categoria;
}

export async function deleteCategory(id: number): Promise<void> {
  const { error } = await supabase.from("categoria").delete().eq("id", id);
  if (error) throw error;
}

export async function listModalities(): Promise<Modalidade[]> {
  const { data, error } = await supabase.from("modalidade").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getModalityById(id: number): Promise<Modalidade | null> {
  const { data, error } = await supabase
    .from("modalidade")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data ?? null;
}

export async function createModality(payload: Omit<Modalidade, "id">): Promise<Modalidade> {
  const { data, error } = await supabase.from("modalidade").insert(payload).select("*").single();
  if (error) throw error;
  return data as Modalidade;
}

export async function updateModality(id: number, payload: Partial<Omit<Modalidade, "id">>): Promise<Modalidade> {
  const { data, error } = await supabase
    .from("modalidade")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Modalidade;
}

export async function deleteModality(id: number): Promise<void> {
  const { error } = await supabase.from("modalidade").delete().eq("id", id);
  if (error) throw error;
}

export async function listCompetitions(): Promise<Competicao[]> {
  const { data, error } = await supabase.from("competicao").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getCompetitionById(id: number): Promise<Competicao | null> {
  const { data, error } = await supabase
    .from("competicao")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data ?? null;
}

export async function createCompetition(payload: Omit<Competicao, "id" | "created_at">): Promise<Competicao> {
  const { data, error } = await supabase.from("competicao").insert(payload).select("*").single();
  if (error) throw error;
  return data as Competicao;
}

export async function updateCompetition(id: number, payload: Partial<Omit<Competicao, "id" | "created_at">>): Promise<Competicao> {
  const { data, error } = await supabase
    .from("competicao")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Competicao;
}

export async function deleteCompetition(id: number): Promise<void> {
  const { error } = await supabase.from("competicao").delete().eq("id", id);
  if (error) throw error;
}

export async function listGroups(): Promise<Grupo[]> {
  const { data, error } = await supabase.from("grupo").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getGroupById(id: number): Promise<Grupo | null> {
  const { data, error } = await supabase
    .from("grupo")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data ?? null;
}

export async function createGroup(payload: Omit<Grupo, "id">): Promise<Grupo> {
  const { data, error } = await supabase.from("grupo").insert(payload).select("*").single();
  if (error) throw error;
  return data as Grupo;
}

export async function updateGroup(id: number, payload: Partial<Omit<Grupo, "id">>): Promise<Grupo> {
  const { data, error } = await supabase
    .from("grupo")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Grupo;
}

export async function deleteGroup(id: number): Promise<void> {
  const { error } = await supabase.from("grupo").delete().eq("id", id);
  if (error) throw error;
}

export async function listMatches(): Promise<Partida[]> {
  const { data, error } = await supabase.from("partida").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getMatchById(id: number): Promise<Partida | null> {
  const { data, error } = await supabase
    .from("partida")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data ?? null;
}

export async function createMatch(payload: Omit<Partida, "id">): Promise<Partida> {
  const { data, error } = await supabase.from("partida").insert(payload).select("*").single();
  if (error) throw error;
  return data as Partida;
}

export async function updateMatch(id: number, payload: Partial<Omit<Partida, "id">>): Promise<Partida> {
  const { data, error } = await supabase
    .from("partida")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Partida;
}

export async function deleteMatch(id: number): Promise<void> {
  const { error } = await supabase.from("partida").delete().eq("id", id);
  if (error) throw error;
}

export async function listMatchAthletes(): Promise<PartidaAtleta[]> {
  const { data, error } = await supabase.from("partida_atleta").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getMatchAthleteById(id: number): Promise<PartidaAtleta | null> {
  const { data, error } = await supabase
    .from("partida_atleta")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data ?? null;
}

export async function createMatchAthlete(payload: Omit<PartidaAtleta, "id">): Promise<PartidaAtleta> {
  const { data, error } = await supabase.from("partida_atleta").insert(payload).select("*").single();
  if (error) throw error;
  return data as PartidaAtleta;
}

export async function updateMatchAthlete(id: number, payload: Partial<Omit<PartidaAtleta, "id">>): Promise<PartidaAtleta> {
  const { data, error } = await supabase
    .from("partida_atleta")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as PartidaAtleta;
}

export async function deleteMatchAthlete(id: number): Promise<void> {
  const { error } = await supabase.from("partida_atleta").delete().eq("id", id);
  if (error) throw error;
}

export async function listRegistrations(): Promise<Inscricao[]> {
  const { data, error } = await supabase.from("inscricao").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getRegistrationById(id: number): Promise<Inscricao | null> {
  const { data, error } = await supabase
    .from("inscricao")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data ?? null;
}

export async function createRegistration(payload: Omit<Inscricao, "id">): Promise<Inscricao> {
  const { data, error } = await supabase.from("inscricao").insert(payload).select("*").single();
  if (error) throw error;
  return data as Inscricao;
}

export async function updateRegistration(id: number, payload: Partial<Omit<Inscricao, "id">>): Promise<Inscricao> {
  const { data, error } = await supabase
    .from("inscricao")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Inscricao;
}

export async function deleteRegistration(id: number): Promise<void> {
  const { error } = await supabase.from("inscricao").delete().eq("id", id);
  if (error) throw error;
}

export async function listResults(): Promise<ResultadoPartida[]> {
  const { data, error } = await supabase.from("resultado_partida").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getResultById(id: number): Promise<ResultadoPartida | null> {
  const { data, error } = await supabase
    .from("resultado_partida")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data ?? null;
}

export async function createResult(payload: Omit<ResultadoPartida, "id">): Promise<ResultadoPartida> {
  const { data, error } = await supabase.from("resultado_partida").insert(payload).select("*").single();
  if (error) throw error;
  return data as ResultadoPartida;
}

export async function updateResult(id: number, payload: Partial<Omit<ResultadoPartida, "id">>): Promise<ResultadoPartida> {
  const { data, error } = await supabase
    .from("resultado_partida")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as ResultadoPartida;
}

export async function deleteResult(id: number): Promise<void> {
  const { error } = await supabase.from("resultado_partida").delete().eq("id", id);
  if (error) throw error;
}
