-- Supabase/Postgres schema for competitions

create table if not exists clube (
  id bigint generated always as identity primary key,
  nome text not null,
  estado text not null
);

create table if not exists atleta (
  id bigint generated always as identity primary key,
  id_clube bigint not null references clube(id) on update cascade on delete restrict,
  sexo text not null default 'Nao informado',
  nome text not null,
  sobrenome text not null,
  idade integer not null check (idade >= 0)
);

create table if not exists arbitro (
  id bigint generated always as identity primary key,
  nome text not null,
  sobrenome text not null
);

create table if not exists categoria (
  id bigint generated always as identity primary key,
  sexo text not null,
  idade text not null
);

create table if not exists modalidade (
  id bigint generated always as identity primary key,
  nome text not null
);

create table if not exists competicao (
  id bigint generated always as identity primary key,
  id_modalidade bigint not null references modalidade(id) on update cascade on delete restrict,
  id_categoria bigint not null references categoria(id) on update cascade on delete restrict,
  id_usuario uuid not null,
  nome text not null,
  created_at timestamptz not null default now(),
  status text not null default 'Aguardando inscricoes' check (status in ('Aguardando inscricoes', 'Em andamento', 'Finalizado'))
);

create table if not exists grupo (
  id bigint generated always as identity primary key,
  id_competicao bigint not null references competicao(id) on update cascade on delete cascade,
  nome text not null,
  quantidade_jogadores integer not null default 0 check (quantidade_jogadores >= 0)
);

create table if not exists partida (
  id bigint generated always as identity primary key,
  id_grupo bigint references grupo(id) on update cascade on delete set null,
  id_arbitro bigint references arbitro(id) on update cascade on delete set null,
  numero_mesa integer,
  status text not null,
  fase text not null
);

create table if not exists partida_atleta (
  id bigint generated always as identity primary key,
  id_partida bigint not null references partida(id) on update cascade on delete cascade,
  id_atleta bigint not null references atleta(id) on update cascade on delete restrict
);

create table if not exists inscricao (
  id bigint generated always as identity primary key,
  id_atleta bigint not null references atleta(id) on update cascade on delete restrict,
  id_competicao bigint not null references competicao(id) on update cascade on delete cascade,
  id_grupo bigint references grupo(id) on update cascade on delete set null,
  inscricao_confirmada boolean not null default false
);

create table if not exists resultado_partida (
  id bigint generated always as identity primary key,
  id_partida bigint not null references partida(id) on update cascade on delete cascade,
  time1_set1 integer not null default 0,
  time1_set2 integer not null default 0,
  time1_set3 integer not null default 0,
  time2_set1 integer not null default 0,
  time2_set2 integer not null default 0,
  time2_set3 integer not null default 0,
  check (time1_set1 >= 0 and time1_set2 >= 0 and time1_set3 >= 0),
  check (time2_set1 >= 0 and time2_set2 >= 0 and time2_set3 >= 0)
);

-- Triggers

create or replace function trigger_1_max_atletas_por_partida()
returns trigger
language plpgsql
as $$
begin
  if (
    select count(*)
    from partida_atleta
    where id_partida = new.id_partida
  ) >= 4 then
    raise exception 'Trigger 1';
  end if;

  return new;
end;
$$;

create or replace function trigger_2_atleta_unico_por_partida()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from partida_atleta
    where id_partida = new.id_partida
      and id_atleta = new.id_atleta
  ) then
    raise exception 'Trigger 2';
  end if;

  return new;
end;
$$;

create or replace function trigger_3_resultado_unico_por_partida()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from resultado_partida
    where id_partida = new.id_partida
  ) then
    raise exception 'Trigger 3';
  end if;

  return new;
end;
$$;

create trigger trg_partida_atleta_max_4
before insert on partida_atleta
for each row
execute function trigger_1_max_atletas_por_partida();

create trigger trg_partida_atleta_unico
before insert on partida_atleta
for each row
execute function trigger_2_atleta_unico_por_partida();

create trigger trg_resultado_partida_unico
before insert on resultado_partida
for each row
execute function trigger_3_resultado_unico_por_partida();

create or replace function trigger_4_delete_partidas_by_group()
returns trigger
language plpgsql
as $$
begin
  delete from partida
  where id_grupo = old.id;

  return old;
end;
$$;

drop trigger if exists trg_grupo_delete_partidas on grupo;

create trigger trg_grupo_delete_partidas
before delete on grupo
for each row
execute function trigger_4_delete_partidas_by_group();

-- Useful indexes
create index if not exists idx_atleta_id_clube on atleta(id_clube);
create index if not exists idx_grupo_id_competicao on grupo(id_competicao);
create index if not exists idx_partida_id_grupo on partida(id_grupo);
create index if not exists idx_partida_atleta_id_partida on partida_atleta(id_partida);
create index if not exists idx_partida_atleta_id_atleta on partida_atleta(id_atleta);
create index if not exists idx_inscricao_id_atleta on inscricao(id_atleta);
create index if not exists idx_inscricao_id_competicao on inscricao(id_competicao);
create index if not exists idx_resultado_partida_id_partida on resultado_partida(id_partida);
