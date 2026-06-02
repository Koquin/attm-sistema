# Banco de dados (Supabase)

## Entidades e atributos

### Atleta
- id (pk)
- id_clube (fk clube.id)
- nome
- sobrenome
- idade

### Clube
- id (pk)
- nome
- estado

### PartidaAtleta
- id (pk)
- id_partida (fk partida.id)
- id_atleta (fk atleta.id)

### Partida
- id (pk)
- id_grupo (fk grupo.id)
- id_arbitro (fk arbitro.id)
- numero_mesa
- status
- fase

### Grupo
- id (pk)
- id_competicao (fk competicao.id)
- nome
- quantidade_jogadores

### Competicao
- id (pk)
- id_modalidade (fk modalidade.id)
- id_categoria (fk categoria.id)
- id_usuario (uuid)
- nome
- created_at
- status

### Categoria
- id (pk)
- sexo
- idade

### Modalidade
- id (pk)
- nome

### Inscricao
- id (pk)
- id_atleta (fk atleta.id)
- id_competicao (fk competicao.id)
- id_grupo (fk grupo.id)
- inscricao_confirmada

### Arbitro
- id (pk)
- nome
- sobrenome

### ResultadoPartida
- id (pk)
- id_partida (fk partida.id)
- time1_set1
- time1_set2
- time1_set3
- time2_set1
- time2_set2
- time2_set3

## Relacoes
- Atleta -> Clube (N:1)
- PartidaAtleta -> Partida (N:1)
- PartidaAtleta -> Atleta (N:1)
- Partida -> Grupo (N:1)
- Partida -> Arbitro (N:1)
- Grupo -> Competicao (N:1)
- Grupo guarda a quantidade prevista de jogadores para gerar a tabela e o chaveamento.
- Competicao -> Modalidade (N:1)
- Competicao -> Categoria (N:1)
- Inscricao -> Atleta (N:1)
- Inscricao -> Competicao (N:1)
- Inscricao -> Grupo (N:1, opcional)
- ResultadoPartida -> Partida (N:1)

## Triggers e mensagens

| Trigger | Significado |
| --- | --- |
| Trigger 1 | Limite de atletas por partida ultrapassado (maximo 4). |
| Trigger 2 | Atleta duplicado na mesma partida. |
| Trigger 3 | Resultado ja cadastrado para a partida. |

## Observacoes
- A relacao Atleta -> Clube garante que um atleta pertena a um unico clube.
- ResultadoPartida guarda os sets por time. Se o modelo precisar de mais sets, ampliar os campos.
- id_usuario referencia a sessao autenticada do painel administrativo (uuid).

## SQL
O script completo esta em docs/supabase-schema.sql.
