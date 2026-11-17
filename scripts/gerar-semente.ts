/**
 * Gera supabase/semente.sql a partir dos dados de exemplo em src/lib/dados.
 * Uso: node --experimental-strip-types scripts/gerar-semente.ts > supabase/semente.sql
 */
import { writeSync } from 'node:fs'
import { canteiros, plantas } from '../src/lib/dados/exemplo.ts'
import { jogos } from '../src/lib/dados/jogos.ts'
import { temas } from '../src/lib/dados/sentidos.ts'

const dados = {
  canteiros: canteiros.map((c) => ({ id: c.id, numero: c.numero, nome: c.nome, descricao: c.descricao })),
  plantas: plantas.map((p) => ({
    slug: p.slug, nome_popular: p.nomePopular, nome_cientifico: p.nomeCientifico, autor_taxon: p.autorTaxon ?? null,
    familia: p.familia, canteiro_id: p.canteiroId, categorias: p.categorias, caracteristicas: p.caracteristicas,
    frase_impacto: p.fraseImpacto, resumo: p.resumo, conhecendo: p.conhecendo, cultivo: p.cultivo, historia: p.historia,
    experiencia: p.experiencia, atividade: p.atividade, perguntas: p.perguntas, psicologia: p.psicologia,
    fontes: p.fontes, exemplo: p.exemplo, publicado: p.publicado,
  })),
  usos: plantas.flatMap((p) => p.usos.map((u, i) => ({ planta: p.slug, nivel: u.nivel, texto: u.texto, ordem: i }))),
  jogos: jogos.map((j, i) => ({ slug: j.slug, titulo: j.titulo, descricao: j.descricao, tipo: j.tipo, ordem: i, exemplo: j.exemplo })),
  perguntas: jogos.flatMap((j) =>
    j.perguntas.map((q, i) => ({
      jogo: j.slug, enunciado: q.enunciado, opcoes: q.opcoes, correta: q.correta, feedback: q.feedback,
      fonte_titulo: q.fonte?.titulo ?? null, fonte_url: q.fonte?.url ?? null, ordem: i,
    })),
  ),
  textos: temas.map((t, i) => ({
    chave: t.slug, estacao: 'sentidos', titulo: t.titulo, corpo: '', resumo: t.resumo, ordem: i, exemplo: t.exemplo,
    dados: { secoes: t.secoes, experimente: t.experimente ?? null, pergunta: t.pergunta ?? null, fontes: t.fontes },
  })),
}

const json = JSON.stringify(dados)
const delim = '$semente$'
if (json.includes(delim)) throw new Error('O conteúdo contém o delimitador do SQL')

const recordset = (chave: string, colunas: string) => `jsonb_to_recordset((select j->'${chave}' from _semente)) as x(${colunas})`

const sql = `-- Gerado por scripts/gerar-semente.ts. Conteúdo de exemplo inicial.
begin;
create temp table _semente as select ${delim}${json}${delim}::jsonb as j;

insert into canteiros (id, numero, nome, descricao)
select * from ${recordset('canteiros', 'id text, numero int, nome text, descricao text')};

insert into plantas (slug, nome_popular, nome_cientifico, autor_taxon, familia, canteiro_id, categorias, caracteristicas,
  frase_impacto, resumo, conhecendo, cultivo, historia, experiencia, atividade, perguntas, psicologia, fontes, exemplo, publicado)
select * from ${recordset(
  'plantas',
  `slug text, nome_popular text, nome_cientifico text, autor_taxon text, familia text, canteiro_id text,
  categorias text[], caracteristicas text[], frase_impacto text, resumo text, conhecendo jsonb, cultivo jsonb, historia jsonb,
  experiencia jsonb, atividade text, perguntas text[], psicologia jsonb, fontes jsonb, exemplo boolean, publicado boolean`,
)};

insert into usos (planta, nivel, texto, ordem)
select planta, nivel::nivel_evidencia, texto, ordem from ${recordset('usos', 'planta text, nivel text, texto text, ordem int')};

insert into jogos (slug, titulo, descricao, tipo, ordem, exemplo)
select * from ${recordset('jogos', 'slug text, titulo text, descricao text, tipo text, ordem int, exemplo boolean')};

insert into quiz_perguntas (jogo, enunciado, opcoes, correta, feedback, fonte_titulo, fonte_url, ordem)
select * from ${recordset(
  'perguntas',
  'jogo text, enunciado text, opcoes text[], correta int, feedback text, fonte_titulo text, fonte_url text, ordem int',
)};

insert into textos (chave, estacao, titulo, corpo, resumo, ordem, exemplo, dados)
select * from ${recordset(
  'textos',
  'chave text, estacao text, titulo text, corpo text, resumo text, ordem int, exemplo boolean, dados jsonb',
)};

commit;
`
writeSync(1, sql)
