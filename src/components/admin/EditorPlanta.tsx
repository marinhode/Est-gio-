'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { type DadosPlanta, type ErroCampo, excluirPlanta, salvarPlanta } from '@/app/admin/plantas/acoes'
import { CampoArea, CampoSecao, CampoTexto, GrupoFicha, Repetidor, ResumoErros } from '@/components/admin/campos'
import { NIVEIS } from '@/components/Selo'
import { clienteNavegador } from '@/lib/supabase/navegador'
import { paraEndereco } from '@/lib/formulario-planta'
import type { Area, Canteiro, NivelEvidencia } from '@/lib/tipos'

const AREAS: Area[] = ['Psicologia', 'Botânica', 'Biomedicina', 'Farmácia']
const hoje = () => new Date().toISOString().slice(0, 10)

export function EditorPlanta({ inicial, slugOriginal, canteiros, editor }: {
  inicial: DadosPlanta
  slugOriginal: string | null
  canteiros: Canteiro[]
  editor: { nome: string }
}) {
  const router = useRouter()
  const [d, setD] = useState<DadosPlanta>(inicial)
  const [erros, setErros] = useState<ErroCampo[]>([])
  const [aviso, setAviso] = useState('')
  const [enviandoFoto, setEnviandoFoto] = useState(false)
  const [confirmarExclusao, setConfirmarExclusao] = useState(false)
  const [salvando, iniciar] = useTransition()
  const enderecoManual = useRef(Boolean(slugOriginal))
  const resumoRef = useRef<HTMLDivElement>(null)

  const mudar = <K extends keyof DadosPlanta>(campo: K, valor: DadosPlanta[K]) => {
    setD((atual) => {
      const novo = { ...atual, [campo]: valor }
      if (campo === 'nomePopular' && !enderecoManual.current) novo.slug = paraEndereco(String(valor))
      return novo
    })
    setAviso('')
  }
  const erro = (campo: string) => erros.find((e) => e.campo === campo)?.mensagem

  function salvar(publicar: boolean) {
    iniciar(async () => {
      const r = await salvarPlanta({ ...d, publicado: publicar }, slugOriginal)
      if (!r.ok) {
        setErros(r.erros)
        setAviso('')
        requestAnimationFrame(() => document.getElementById('resumo-erros')?.focus())
        return
      }
      setErros([])
      setD((atual) => ({ ...atual, publicado: publicar }))
      setAviso(publicar ? 'Publicada. A ficha já aparece no site.' : 'Rascunho salvo. A ficha não aparece no site.')
      if (r.slug !== slugOriginal) router.replace(`/admin/plantas/${r.slug}`)
      else router.refresh()
    })
  }

  async function enviarFoto(arquivo: File) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(arquivo.type)) {
      setErros([{ campo: 'foto', mensagem: 'Use uma foto em JPG, PNG ou WebP.' }])
      return
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      setErros([{ campo: 'foto', mensagem: 'A foto passa de 5 MB. Reduza o tamanho e tente de novo.' }])
      return
    }
    setEnviandoFoto(true)
    const extensao = arquivo.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const caminho = `plantas/${d.slug || 'nova'}-${Date.now()}.${extensao}`
    const supabase = clienteNavegador()
    const { error } = await supabase.storage.from('midias').upload(caminho, arquivo, { cacheControl: '31536000' })
    setEnviandoFoto(false)
    if (error) {
      setErros([{ campo: 'foto', mensagem: `Não foi possível enviar a foto (${error.message}).` }])
      return
    }
    mudar('imagemUrl', supabase.storage.from('midias').getPublicUrl(caminho).data.publicUrl)
    setErros([])
  }

  function excluir() {
    iniciar(async () => {
      const r = await excluirPlanta(slugOriginal!)
      if (r.ok) router.replace('/admin/plantas?excluida=1')
      else setErros([{ campo: 'geral', mensagem: r.mensagem ?? 'Não foi possível excluir.' }])
    })
  }

  const listaCsv = (v: string[]) => v.join(', ')
  const deCsv = (s: string) => s.split(',').map((x) => x.trimStart())

  return (
    <form
      className="grid gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        salvar(d.publicado)
      }}
      noValidate
    >
      <div ref={resumoRef}>
        <ResumoErros erros={erros} />
      </div>

      <GrupoFicha numero="01" titulo="Identificação" descricao="Nome popular, nome científico, família, foto e localização na horta.">
        <div className="grid gap-4 md:grid-cols-2">
          <CampoTexto id="nomePopular" rotulo="Nome popular" obrigatorio valor={d.nomePopular} mudar={(v) => mudar('nomePopular', v)} erro={erro('nomePopular')} />
          <CampoTexto id="nomeCientifico" rotulo="Nome científico" obrigatorio dica="Gênero e espécie, como Mentha spicata." valor={d.nomeCientifico} mudar={(v) => mudar('nomeCientifico', v)} erro={erro('nomeCientifico')} />
          <CampoTexto id="autorTaxon" rotulo="Autor do nome científico" dica="Opcional, como L. ou Mill." valor={d.autorTaxon} mudar={(v) => mudar('autorTaxon', v)} />
          <CampoTexto id="familia" rotulo="Família botânica" obrigatorio dica="Como Lamiaceae." valor={d.familia} mudar={(v) => mudar('familia', v)} erro={erro('familia')} />
          <div className="grid gap-1">
            <label htmlFor="canteiroId" className="font-bold">Canteiro</label>
            <select id="canteiroId" className="campo" value={d.canteiroId} onChange={(e) => mudar('canteiroId', e.target.value)}>
              <option value="">Sem canteiro definido</option>
              {canteiros.map((c) => (
                <option key={c.id} value={c.id}>Canteiro {c.numero}: {c.nome}</option>
              ))}
            </select>
          </div>
          <CampoTexto
            id="slug"
            rotulo="Endereço da ficha"
            obrigatorio
            dica={slugOriginal ? `Atenção: mudar o endereço quebra os QR Codes já impressos. Atual: /plantas/${slugOriginal}` : `A ficha ficará em /plantas/${d.slug || '…'}`}
            valor={d.slug}
            mudar={(v) => {
              enderecoManual.current = true
              mudar('slug', paraEndereco(v) + (v.endsWith('-') ? '-' : ''))
            }}
            erro={erro('slug')}
          />
          <CampoTexto id="categorias" rotulo="Categorias" dica="Separe por vírgula. Ex.: Aromática, Chá, Tempero." valor={listaCsv(d.categorias)} mudar={(v) => mudar('categorias', deCsv(v))} />
          <CampoTexto id="caracteristicas" rotulo="Características" dica="Usadas na busca. Ex.: Aroma refrescante, Folha serrilhada." valor={listaCsv(d.caracteristicas)} mudar={(v) => mudar('caracteristicas', deCsv(v))} />
        </div>

        <div className="grid gap-3 border-t border-linha pt-4">
          <p id="foto" className="font-bold" tabIndex={-1}>Foto</p>
          {d.imagemUrl ? (
            <div className="flex flex-wrap items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element -- prévia de upload */}
              <img src={d.imagemUrl} alt="" className="h-40 w-auto rounded border border-linha object-cover" />
              <button type="button" className="btn btn-sec" onClick={() => mudar('imagemUrl', '')}>Remover foto</button>
            </div>
          ) : (
            <p className="nota">Nenhuma foto ainda. Use fotos próprias ou com uso autorizado (orientação 3.3).</p>
          )}
          <label className="btn btn-sec cursor-pointer justify-self-start has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-foco">
            {enviandoFoto ? 'Enviando…' : d.imagemUrl ? 'Trocar foto' : 'Escolher foto'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={enviandoFoto}
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) enviarFoto(f)
                e.target.value = ''
              }}
            />
          </label>
          {erro('foto') && <p className="text-sm font-bold">⚠ {erro('foto')}</p>}
          {d.imagemUrl && (
            <div className="grid gap-4 md:grid-cols-2">
              <CampoArea id="imagemAlt" rotulo="Texto alternativo da foto" obrigatorio dica="Descreva o que aparece na foto para quem não pode vê-la. Ex.: Ramo de hortelã com folhas verdes serrilhadas." valor={d.imagemAlt} mudar={(v) => mudar('imagemAlt', v)} erro={erro('imagemAlt')} linhas={2} />
              <CampoTexto id="imagemCredito" rotulo="Crédito da foto" dica="Quem fotografou. Ex.: Foto: equipe de Psicologia." valor={d.imagemCredito} mudar={(v) => mudar('imagemCredito', v)} />
            </div>
          )}
        </div>
      </GrupoFicha>

      <GrupoFicha titulo="Abertura da ficha" descricao="O que a pessoa lê primeiro ao escanear o QR Code.">
        <CampoArea id="fraseImpacto" rotulo="Frase de impacto" obrigatorio dica="Uma curiosidade que desperte vontade de explorar." valor={d.fraseImpacto} mudar={(v) => mudar('fraseImpacto', v)} erro={erro('fraseImpacto')} linhas={2} />
        <CampoArea id="resumo" rotulo="Apresentação curta" obrigatorio dica="Leitura de 30 segundos sobre a planta." valor={d.resumo} mudar={(v) => mudar('resumo', v)} erro={erro('resumo')} linhas={2} />
      </GrupoFicha>

      <GrupoFicha numero="02" titulo="Conhecendo a planta" descricao="Folhas, flores, caule, raízes, aroma, textura, cores e ciclo de vida.">
        <CampoSecao id="conhecendo" secao={d.conhecendo} mudar={(s) => mudar('conhecendo', s)} erro={erro('conhecendo')} />
      </GrupoFicha>
      <GrupoFicha numero="03" titulo="Cultivo e sustentabilidade" descricao="Luz, solo, rega, propagação e cuidados.">
        <CampoSecao id="cultivo" secao={d.cultivo} mudar={(s) => mudar('cultivo', s)} erro={erro('cultivo')} />
      </GrupoFicha>
      <GrupoFicha numero="04" titulo="História e cultura" descricao="Usos tradicionais documentados, conhecimento popular contextualizado e curiosidades.">
        <CampoSecao id="historia" secao={d.historia} mudar={(s) => mudar('historia', s)} erro={erro('historia')} />
      </GrupoFicha>

      <GrupoFicha numero="05" titulo="Experiência sensorial" descricao="Características perceptíveis, atividade de observação e perguntas sem resposta certa.">
        <CampoSecao id="experiencia" secao={d.experiencia} mudar={(s) => mudar('experiencia', s)} erro={erro('experiencia')} />
        <CampoArea id="atividade" rotulo="Atividade sensorial" obrigatorio dica="Um convite à ação. Ex.: Esfregue uma folha entre os dedos e aproxime do nariz." valor={d.atividade} mudar={(v) => mudar('atividade', v)} erro={erro('atividade')} linhas={2} />
        <div id="perguntas" tabIndex={-1} className="grid gap-2">
          <p className="font-bold">Perguntas interativas <span className="font-normal text-suave">(pelo menos uma)</span></p>
          <p className="nota">Perguntas abertas, que aceitam qualquer resposta. Ex.: Que lembrança esse aroma traz para você?</p>
          {erro('perguntas') && <p className="text-sm font-bold">⚠ {erro('perguntas')}</p>}
          <Repetidor
            itens={d.perguntas}
            mudar={(v) => mudar('perguntas', v)}
            novo={() => ''}
            rotuloAdicionar="Adicionar pergunta"
            rotuloItem={(i) => `Pergunta ${i + 1}`}
            render={(p, alterar, i) => <CampoTexto id={`pergunta-${i}`} rotulo="Texto da pergunta" valor={p} mudar={alterar} />}
          />
        </div>
      </GrupoFicha>

      <GrupoFicha numero="06" titulo="Psicologia e bem-estar" descricao="Percepção, atenção, memória, emoções e contato com a natureza, sem prometer efeitos terapêuticos.">
        <CampoSecao id="psicologia" secao={d.psicologia} mudar={(s) => mudar('psicologia', s)} erro={erro('psicologia')} />
      </GrupoFicha>

      <GrupoFicha titulo="Usos e nível de evidência" descricao="Cada uso precisa dizer se é uso popular, hipótese, evidência científica ou uso reconhecido.">
        <Repetidor
          itens={d.usos}
          mudar={(v) => mudar('usos', v)}
          novo={() => ({ nivel: 'popular' as NivelEvidencia, texto: '' })}
          rotuloAdicionar="Adicionar uso"
          rotuloItem={(i) => `Uso ${i + 1}`}
          render={(u, alterar, i) => (
            <div id={`uso-${i}`} tabIndex={-1} className="grid gap-3 sm:grid-cols-[14rem_1fr]">
              <div className="grid gap-1">
                <label htmlFor={`uso-nivel-${i}`} className="font-bold">Nível</label>
                <select id={`uso-nivel-${i}`} className="campo" value={u.nivel} onChange={(e) => alterar({ ...u, nivel: e.target.value as NivelEvidencia })}>
                  {(Object.keys(NIVEIS) as NivelEvidencia[]).map((n) => (
                    <option key={n} value={n}>{NIVEIS[n].rotulo}</option>
                  ))}
                </select>
              </div>
              <CampoArea id={`uso-texto-${i}`} rotulo="Descrição do uso" valor={u.texto} mudar={(texto) => alterar({ ...u, texto })} erro={erro(`uso-${i}`)} linhas={2} />
            </div>
          )}
        />
      </GrupoFicha>

      <GrupoFicha numero="07" titulo="Biomedicina" descricao="Será desenvolvido no próximo semestre. Deixe em branco para não aparecer na ficha.">
        <CampoSecao id="biomedicina" secao={d.biomedicina} mudar={(s) => mudar('biomedicina', s)} obrigatorio={false} />
      </GrupoFicha>
      <GrupoFicha numero="08" titulo="Farmácia" descricao="Será desenvolvido no próximo semestre. Deixe em branco para não aparecer na ficha.">
        <CampoSecao id="farmacia" secao={d.farmacia} mudar={(s) => mudar('farmacia', s)} obrigatorio={false} />
      </GrupoFicha>
      <GrupoFicha numero="09" titulo="Alertas de segurança" descricao="Toxicidade, confusão entre espécies e restrições. Próximo semestre.">
        <CampoSecao id="alertas" secao={d.alertas} mudar={(s) => mudar('alertas', s)} obrigatorio={false} />
      </GrupoFicha>

      <GrupoFicha numero="10" titulo="Fontes científicas e revisão" descricao="Referências, data de consulta e quem validou cada área.">
        <div className="grid gap-2">
          <p className="font-bold">Fontes</p>
          <Repetidor
            itens={d.fontes}
            mudar={(v) => mudar('fontes', v)}
            novo={() => ({ titulo: '', url: '', consultadoEm: hoje() })}
            rotuloAdicionar="Adicionar fonte"
            rotuloItem={(i) => `Fonte ${i + 1}`}
            render={(f, alterar, i) => (
              <div id={`fonte-${i}`} tabIndex={-1} className="grid gap-3">
                <CampoArea id={`fonte-titulo-${i}`} rotulo="Referência" valor={f.titulo} mudar={(titulo) => alterar({ ...f, titulo })} erro={erro(`fonte-${i}`)} linhas={2} />
                <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
                  <CampoTexto id={`fonte-url-${i}`} rotulo="Link" tipo="url" valor={f.url ?? ''} mudar={(url) => alterar({ ...f, url })} placeholder="https://" />
                  <CampoTexto id={`fonte-data-${i}`} rotulo="Consultado em" tipo="date" valor={f.consultadoEm ?? ''} mudar={(consultadoEm) => alterar({ ...f, consultadoEm })} />
                </div>
              </div>
            )}
          />
        </div>
        <div className="grid gap-2 border-t border-linha pt-4">
          <p className="font-bold">Validações</p>
          <p className="nota">Informações botânicas, biomédicas e farmacêuticas precisam ser validadas pela área responsável (orientação 3.3).</p>
          <Repetidor
            itens={d.validacoes}
            mudar={(v) => mudar('validacoes', v)}
            novo={() => ({ nome: '', area: 'Psicologia' as Area, data: hoje() })}
            rotuloAdicionar="Adicionar validação"
            rotuloItem={(i) => `Validação ${i + 1}`}
            render={(v, alterar, i) => (
              <div id={`validacao-${i}`} tabIndex={-1} className="grid gap-3 sm:grid-cols-[1fr_12rem_12rem]">
                <CampoTexto id={`val-nome-${i}`} rotulo="Nome" valor={v.nome} mudar={(nome) => alterar({ ...v, nome })} erro={erro(`validacao-${i}`)} />
                <div className="grid content-start gap-1">
                  <label htmlFor={`val-area-${i}`} className="font-bold">Área</label>
                  <select id={`val-area-${i}`} className="campo" value={v.area} onChange={(e) => alterar({ ...v, area: e.target.value as Area })}>
                    {AREAS.map((a) => (<option key={a} value={a}>{a}</option>))}
                  </select>
                </div>
                <CampoTexto id={`val-data-${i}`} rotulo="Data" tipo="date" valor={v.data} mudar={(data) => alterar({ ...v, data })} />
              </div>
            )}
          />
          <button type="button" className="btn btn-sec justify-self-start" onClick={() => mudar('validacoes', [...d.validacoes, { nome: editor.nome, area: 'Psicologia', data: hoje() }])}>
            Registrar minha validação
          </button>
        </div>
        <label className="flex items-start gap-3 border-t border-linha pt-4">
          <input type="checkbox" className="mt-1 size-5 accent-[var(--azul)]" checked={d.exemplo} onChange={(e) => mudar('exemplo', e.target.checked)} />
          <span>
            <span className="font-bold">Conteúdo provisório</span>
            <span className="nota block">Mostra na ficha o aviso de texto aguardando revisão. Desmarque quando o conteúdo estiver validado.</span>
          </span>
        </label>
      </GrupoFicha>

      {/* Barra de ações fixa */}
      <div className="sticky bottom-0 z-20 -mx-4 grid gap-2 border-t border-linha bg-superficie px-4 py-3 pb-[max(.75rem,env(safe-area-inset-bottom))] sm:mx-0 sm:rounded-t-md sm:border-x">
        <p role="status" className="text-sm font-bold empty:hidden">{aviso}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`selo ${d.publicado ? 'selo-uso_reconhecido' : 'selo-popular'} !text-xs`}>{d.publicado ? 'Publicada' : 'Rascunho'}</span>
          <button type="button" className="btn" disabled={salvando || enviandoFoto} onClick={() => salvar(true)}>
            {salvando ? 'Salvando…' : d.publicado ? 'Salvar alterações' : 'Publicar'}
          </button>
          <button type="button" className="btn btn-sec" disabled={salvando || enviandoFoto} onClick={() => salvar(false)}>
            {d.publicado ? 'Despublicar' : 'Salvar rascunho'}
          </button>
          {slugOriginal && d.publicado && (
            <Link href={`/plantas/${slugOriginal}`} className="btn btn-sec" target="_blank">Ver no site</Link>
          )}
          {slugOriginal && !confirmarExclusao && (
            <button type="button" className="ml-auto min-h-11 px-2 text-sm text-suave underline" onClick={() => setConfirmarExclusao(true)}>Excluir planta</button>
          )}
          {confirmarExclusao && (
            <span className="ml-auto flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold">Excluir {d.nomePopular} de vez?</span>
              <button type="button" className="btn btn-sec !min-h-9 !py-1 text-sm" onClick={excluir}>Sim, excluir</button>
              <button type="button" className="btn btn-sec !min-h-9 !py-1 text-sm" onClick={() => setConfirmarExclusao(false)}>Cancelar</button>
            </span>
          )}
        </div>
      </div>
    </form>
  )
}
