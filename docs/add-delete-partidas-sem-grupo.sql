-- Deletes partidas automatically before a grupo is removed.
-- Run this in the Supabase SQL Editor.

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