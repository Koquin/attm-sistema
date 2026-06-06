export type Clube = {
  id: number;
  nome: string;
  estado: string;
};

export type Atleta = {
  id: number;
  id_clube: number;
  sexo: string;
  nome: string;
  sobrenome: string;
  idade: number;
};

export type Arbitro = {
  id: number;
  nome: string;
  sobrenome: string;
};

export type Categoria = {
  id: number;
  sexo: string;
  idade: string;
};

export type Modalidade = {
  id: number;
  nome: string;
};

export type Competicao = {
  id: number;
  id_modalidade: number;
  id_categoria: number;
  id_usuario: string;
  nome: string;
  created_at: string;
  status: string;
};

export type Grupo = {
  id: number;
  id_competicao: number;
  nome: string;
  quantidade_jogadores: number;
};

export type Partida = {
  id: number;
  id_grupo: number | null;
  id_arbitro: number | null;
  numero_mesa: number | null;
  status: string;
  fase: string;
};

export type PartidaAtleta = {
  id: number;
  id_partida: number;
  id_atleta: number;
};

export type Inscricao = {
  id: number;
  id_atleta: number;
  id_competicao: number;
  id_grupo: number | null;
  inscricao_confirmada: boolean;
};

export type ResultadoPartida = {
  id: number;
  id_partida: number;
  time1_set1: number;
  time1_set2: number;
  time1_set3: number;
  time2_set1: number;
  time2_set2: number;
  time2_set3: number;
};
