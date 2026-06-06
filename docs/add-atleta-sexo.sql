-- Adds a sex field to atleta so registration tables can show athlete sex.
-- Run this in the Supabase SQL Editor.

alter table atleta
  add column if not exists sexo text not null default 'Nao informado';

update atleta
set sexo = 'Nao informado'
where sexo is null or sexo = '';