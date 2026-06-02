-- Adds the player count column to grupo for the competition automation flow.
-- Run this in Supabase SQL Editor.

alter table grupo
  add column if not exists quantidade_jogadores integer;

update grupo
set quantidade_jogadores = 0
where quantidade_jogadores is null;

alter table grupo
  alter column quantidade_jogadores set default 0,
  alter column quantidade_jogadores set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'grupo_quantidade_jogadores_check'
  ) then
    alter table grupo
      add constraint grupo_quantidade_jogadores_check
      check (quantidade_jogadores >= 0);
  end if;
end $$;
