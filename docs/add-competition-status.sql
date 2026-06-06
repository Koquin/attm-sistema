-- Standardizes competition lifecycle status values.
-- Run this in the Supabase SQL Editor.

update competicao
set status = 'Aguardando inscricoes'
where status is null or status = '';

alter table competicao
  alter column status set default 'Aguardando inscricoes';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'competicao_status_check'
  ) then
    alter table competicao
      add constraint competicao_status_check
      check (status in ('Aguardando inscricoes', 'Em andamento', 'Finalizado'));
  end if;
end $$;