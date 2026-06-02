-- Admin user table used by custom login flow
-- Password must be inserted as bcrypt hash in senha_hash

create table if not exists usuario (
  id bigint generated always as identity primary key,
  nome text not null,
  login text not null unique,
  senha_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_usuario_updated_at on usuario;
create trigger trg_usuario_updated_at
before update on usuario
for each row
execute function set_updated_at();

create index if not exists idx_usuario_login on usuario(login);

-- Optional insert example (replace hash with your own bcrypt hash)
-- insert into usuario (nome, login, senha_hash)
-- values ('Administrador', 'admin', '$2b$10$exampleHashHere...');