-- Deletes partidas automatically when their group is removed and id_grupo becomes null.
-- Run this in the Supabase SQL Editor.

create or replace function trigger_4_delete_partida_without_group()
returns trigger
language plpgsql
as $$
begin
  if new.id_grupo is null and old.id_grupo is not null then
    delete from partida
    where id = new.id;
    return null;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_partida_delete_without_group on partida;

create trigger trg_partida_delete_without_group
after update of id_grupo on partida
for each row
when (old.id_grupo is not null and new.id_grupo is null)
execute function trigger_4_delete_partida_without_group();