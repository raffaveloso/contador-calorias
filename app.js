(() => {
  'use strict';

  const CHAVE = 'contadorCalorias.v1';
  const REFEICOES = [
    { id: 'cafe', nome: 'Café da manhã', icone: '☕' },
    { id: 'almoco', nome: 'Almoço', icone: '🍽️' },
    { id: 'jantar', nome: 'Jantar', icone: '🌙' },
    { id: 'lanches', nome: 'Lanches', icone: '🍎' },
  ];
  // Distribuição padrão das calorias: 50% carboidratos, 20% proteínas, 30% gorduras
  const DIST = { c: 0.5, p: 0.2, g: 0.3 };
  const CIRC = 2 * Math.PI * 52;

  const $ = (id) => document.getElementById(id);

  // ---------- Estado ----------
  let estado = carregar();
  let dataAtual = chaveData(new Date());
  let refeicaoAlvo = 'cafe';
  let alimentoSel = null;

  function carregar() {
    const padrao = { meta: 2000, dias: {}, meus: [], perfil: {} };
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE));
      if (salvo && typeof salvo === 'object') return { ...padrao, ...salvo };
    } catch (e) { /* dados corrompidos ou armazenamento indisponível */ }
    return padrao;
  }

  function salvar() {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(estado));
    } catch (e) {
      alert('Não foi possível salvar os dados neste navegador.');
    }
  }

  // ---------- Datas ----------
  function chaveData(d) {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${dia}`;
  }

  function paraData(chave) {
    const [a, m, d] = chave.split('-').map(Number);
    return new Date(a, m - 1, d);
  }

  function somarDias(chave, n) {
    const d = paraData(chave);
    d.setDate(d.getDate() + n);
    return chaveData(d);
  }

  function rotuloData(chave) {
    const hoje = chaveData(new Date());
    if (chave === hoje) return 'Hoje';
    if (chave === somarDias(hoje, -1)) return 'Ontem';
    if (chave === somarDias(hoje, 1)) return 'Amanhã';
    const txt = paraData(chave).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    return txt.charAt(0).toUpperCase() + txt.slice(1);
  }

  // ---------- Utilidades ----------
  const num = (v, casas = 0) =>
    Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: casas });

  const lerNumero = (el) => {
    const v = parseFloat(String(el.value).replace(',', '.'));
    return Number.isFinite(v) ? v : NaN;
  };

  const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  function el(tag, attrs = {}, ...filhos) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') n.className = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    }
    for (const f of filhos) n.append(f);
    return n;
  }

  const itensDoDia = (chave) => estado.dias[chave] || [];

  function totais(itens) {
    return itens.reduce(
      (t, i) => ({ kcal: t.kcal + i.kcal, p: t.p + i.p, c: t.c + i.c, g: t.g + i.g }),
      { kcal: 0, p: 0, c: 0, g: 0 }
    );
  }

  // ---------- Renderização ----------
  function render() {
    renderData();
    renderResumo();
    renderRefeicoes();
    renderGrafico();
  }

  function renderData() {
    $('dataRotulo').textContent = rotuloData(dataAtual);
    $('dataInput').value = dataAtual;
  }

  function renderResumo() {
    const t = totais(itensDoDia(dataAtual));
    const meta = estado.meta;
    const resto = Math.round(meta - t.kcal);
    const acima = resto < 0;

    $('restante').textContent = num(Math.abs(resto));
    $('restanteRotulo').textContent = acima ? 'kcal acima da meta' : 'kcal restantes';
    $('metaValor').textContent = `${num(meta)} kcal`;
    $('consumidoValor').textContent = `${num(t.kcal)} kcal`;

    const anel = $('anelValor');
    const frac = Math.min(t.kcal / meta, 1);
    anel.style.strokeDasharray = CIRC;
    anel.style.strokeDashoffset = CIRC * (1 - frac);
    anel.classList.toggle('acima', acima);

    const metas = {
      c: (meta * DIST.c) / 4,
      p: (meta * DIST.p) / 4,
      g: (meta * DIST.g) / 9,
    };
    const macro = (txt, barra, valor, alvo) => {
      $(txt).textContent = `${num(valor)} / ${num(alvo)} g`;
      $(barra).style.width = `${Math.min((valor / alvo) * 100, 100)}%`;
    };
    macro('carbTxt', 'carbBarra', t.c, metas.c);
    macro('protTxt', 'protBarra', t.p, metas.p);
    macro('gordTxt', 'gordBarra', t.g, metas.g);
  }

  function renderRefeicoes() {
    const cont = $('refeicoes');
    cont.replaceChildren();
    const itens = itensDoDia(dataAtual);

    for (const r of REFEICOES) {
      const lista = itens.filter((i) => i.ref === r.id);
      const soma = totais(lista).kcal;

      const card = el('section', { class: 'card refeicao' });
      card.append(
        el('div', { class: 'refeicao-topo' },
          el('h2', {}, `${r.icone} ${r.nome}`),
          el('span', { class: 'refeicao-kcal' }, `${num(soma)} kcal`)
        )
      );

      if (lista.length) {
        const ul = el('ul', { class: 'itens' });
        for (const i of lista) {
          ul.append(
            el('li', {},
              el('div', { class: 'item-info' },
                el('span', { class: 'item-nome' }, i.nome),
                el('span', { class: 'pequeno' },
                  `${num(i.gramas)} g · C ${num(i.c, 1)} · P ${num(i.p, 1)} · G ${num(i.g, 1)}`)
              ),
              el('span', { class: 'item-kcal' }, `${num(i.kcal)} kcal`),
              el('button', {
                class: 'icone remover',
                'aria-label': `Remover ${i.nome}`,
                title: 'Remover',
                onclick: () => removerItem(i.id),
              }, '×')
            )
          );
        }
        card.append(ul);
      }

      card.append(
        el('button', { class: 'adicionar', onclick: () => abrirAdicionar(r.id) }, '+ Adicionar alimento')
      );
      cont.append(card);
    }
  }

  function renderGrafico() {
    const cont = $('grafico');
    cont.replaceChildren();
    const dias = [];
    for (let i = 6; i >= 0; i--) {
      const chave = somarDias(dataAtual, -i);
      dias.push({ chave, kcal: totais(itensDoDia(chave)).kcal });
    }
    const max = Math.max(estado.meta, ...dias.map((d) => d.kcal)) * 1.15;

    const area = el('div', { class: 'grafico-area' });
    const linha = el('div', { class: 'linha-meta' }, el('span', {}, `meta ${num(estado.meta)}`));
    linha.style.bottom = `${(estado.meta / max) * 100}%`;
    area.append(linha);

    const rotulos = el('div', { class: 'grafico-rotulos' });
    for (const d of dias) {
      const barra = el('div', { class: 'coluna-barra' + (d.kcal > estado.meta ? ' acima' : '') });
      barra.style.height = `${(d.kcal / max) * 100}%`;
      const col = el('button', {
        class: 'coluna' + (d.chave === dataAtual ? ' atual' : ''),
        title: `${rotuloData(d.chave)}: ${num(d.kcal)} kcal`,
        'aria-label': `${rotuloData(d.chave)}: ${num(d.kcal)} kcal`,
        onclick: () => irPara(d.chave),
      });
      if (d.kcal > 0) col.append(el('span', { class: 'coluna-valor' }, num(d.kcal)));
      col.append(barra);
      area.append(col);

      const dia = paraData(d.chave).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
      rotulos.append(el('span', { class: d.chave === dataAtual ? 'atual' : '' }, dia));
    }
    cont.append(area, rotulos);
  }

  // ---------- Ações ----------
  function irPara(chave) {
    dataAtual = chave;
    render();
  }

  function adicionarItem(alimento, gramas) {
    const f = gramas / 100;
    const item = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ref: refeicaoAlvo,
      nome: alimento.nome,
      gramas,
      kcal: alimento.kcal * f,
      p: alimento.p * f,
      c: alimento.c * f,
      g: alimento.g * f,
    };
    (estado.dias[dataAtual] ||= []).push(item);
    salvar();
    render();
  }

  function removerItem(id) {
    const lista = itensDoDia(dataAtual).filter((i) => i.id !== id);
    if (lista.length) estado.dias[dataAtual] = lista;
    else delete estado.dias[dataAtual];
    salvar();
    render();
  }

  // ---------- Diálogo: adicionar ----------
  function abrirAdicionar(refId) {
    refeicaoAlvo = refId;
    $('addTitulo').textContent = REFEICOES.find((r) => r.id === refId).nome;
    $('busca').value = '';
    alimentoSel = null;
    $('selecionado').hidden = true;
    $('manErro').hidden = true;
    trocarAba('buscar');
    renderResultados();
    $('dlgAdd').showModal();
    $('busca').focus();
  }

  function trocarAba(aba) {
    document.querySelectorAll('.abas button').forEach((b) => b.classList.toggle('ativa', b.dataset.aba === aba));
    $('abaBuscar').hidden = aba !== 'buscar';
    $('abaManual').hidden = aba !== 'manual';
  }

  function renderResultados() {
    const termo = semAcento($('busca').value.trim());
    const meus = estado.meus.map((a) => ({ ...a, meu: true }));
    const todos = [...meus, ...ALIMENTOS_BASE];
    const achados = (termo ? todos.filter((a) => semAcento(a.nome).includes(termo)) : todos).slice(0, 40);

    const ul = $('resultados');
    ul.replaceChildren();
    if (!achados.length) {
      ul.append(el('li', { class: 'vazio' }, 'Nada encontrado. Use a aba “Novo alimento” para cadastrar.'));
      return;
    }
    for (const a of achados) {
      const li = el('li', {});
      const btn = el('button', { class: 'resultado', onclick: () => selecionar(a) },
        el('span', {}, a.nome, a.meu ? el('em', { class: 'etiqueta' }, 'meu') : ''),
        el('span', { class: 'pequeno' }, `${num(a.kcal)} kcal / 100 g`)
      );
      li.append(btn);
      if (a.meu) {
        li.append(el('button', {
          class: 'icone remover',
          title: 'Excluir dos meus alimentos',
          'aria-label': `Excluir ${a.nome} dos meus alimentos`,
          onclick: () => {
            estado.meus = estado.meus.filter((m) => m.nome !== a.nome);
            salvar();
            renderResultados();
          },
        }, '×'));
      }
      ul.append(li);
    }
  }

  function selecionar(a) {
    alimentoSel = a;
    $('selNome').textContent = a.nome;
    $('selGramas').value = a.porcao;

    const chips = $('selPorcoes');
    chips.replaceChildren();
    const opcoes = [[a.porcao, `${a.rotulo} (${num(a.porcao)} g)`], [100, '100 g']];
    if (a.porcao !== 50) opcoes.push([a.porcao * 2, `2× (${num(a.porcao * 2)} g)`]);
    for (const [g, txt] of opcoes) {
      chips.append(el('button', {
        class: 'chip',
        onclick: () => { $('selGramas').value = g; atualizarPrevia(); },
      }, txt));
    }

    $('selecionado').hidden = false;
    atualizarPrevia();
    $('selGramas').focus();
    $('selGramas').select();
    $('selecionado').scrollIntoView({ block: 'nearest' });
  }

  function atualizarPrevia() {
    const g = lerNumero($('selGramas'));
    const ok = alimentoSel && g > 0;
    $('btnAddSel').disabled = !ok;
    if (!ok) { $('selPrevia').textContent = 'Informe a quantidade.'; return; }
    const f = g / 100;
    const a = alimentoSel;
    $('selPrevia').textContent =
      `${num(a.kcal * f)} kcal · C ${num(a.c * f, 1)} g · P ${num(a.p * f, 1)} g · G ${num(a.g * f, 1)} g`;
  }

  function confirmarSelecionado() {
    const g = lerNumero($('selGramas'));
    if (!alimentoSel || !(g > 0)) return;
    adicionarItem(alimentoSel, g);
    $('dlgAdd').close();
  }

  function confirmarManual() {
    const nome = $('manNome').value.trim();
    const porcao = lerNumero($('manPorcao'));
    const kcal = lerNumero($('manKcal'));
    const macro = (id) => { const v = lerNumero($(id)); return v > 0 ? v : 0; };
    const erro = $('manErro');

    let msg = '';
    if (!nome) msg = 'Informe o nome do alimento.';
    else if (!(porcao > 0)) msg = 'Informe o tamanho da porção.';
    else if (!(kcal >= 0)) msg = 'Informe as calorias da porção.';
    if (msg) { erro.textContent = msg; erro.hidden = false; return; }
    erro.hidden = true;

    const f = 100 / porcao;
    const alimento = {
      nome,
      kcal: kcal * f,
      p: macro('manProt') * f,
      c: macro('manCarb') * f,
      g: macro('manGord') * f,
      porcao,
      rotulo: '1 porção',
    };
    estado.meus = [alimento, ...estado.meus.filter((m) => semAcento(m.nome) !== semAcento(nome))];
    adicionarItem(alimento, porcao);
    ['manNome', 'manKcal', 'manCarb', 'manProt', 'manGord'].forEach((id) => { $(id).value = ''; });
    $('manPorcao').value = 100;
    $('dlgAdd').close();
  }

  // ---------- Diálogo: configurações ----------
  function abrirConfig() {
    $('cfgMeta').value = estado.meta;
    const p = estado.perfil || {};
    if (p.sexo) $('calcSexo').value = p.sexo;
    if (p.idade) $('calcIdade').value = p.idade;
    if (p.peso) $('calcPeso').value = p.peso;
    if (p.altura) $('calcAltura').value = p.altura;
    if (p.atividade) $('calcAtividade').value = p.atividade;
    if (p.objetivo) $('calcObjetivo').value = p.objetivo;
    $('calcResultado').textContent = '';
    $('dlgConfig').showModal();
  }

  // Equação de Mifflin-St Jeor
  function calcularMeta() {
    const sexo = $('calcSexo').value;
    const idade = lerNumero($('calcIdade'));
    const peso = lerNumero($('calcPeso'));
    const altura = lerNumero($('calcAltura'));
    const out = $('calcResultado');
    if (!(idade > 0 && peso > 0 && altura > 0)) {
      out.textContent = 'Preencha idade, peso e altura.';
      return;
    }
    const tmb = 10 * peso + 6.25 * altura - 5 * idade + (sexo === 'm' ? 5 : -161);
    const gasto = tmb * parseFloat($('calcAtividade').value);
    const meta = Math.max(1200, Math.round((gasto + parseFloat($('calcObjetivo').value)) / 10) * 10);
    $('cfgMeta').value = meta;
    out.textContent =
      `Metabolismo basal: ${num(tmb)} kcal · Gasto diário: ${num(gasto)} kcal · Meta sugerida: ${num(meta)} kcal`;
    estado.perfil = {
      sexo, idade, peso, altura,
      atividade: $('calcAtividade').value,
      objetivo: $('calcObjetivo').value,
    };
  }

  function salvarConfig() {
    const meta = Math.round(lerNumero($('cfgMeta')));
    if (!(meta >= 800 && meta <= 10000)) {
      alert('Informe uma meta entre 800 e 10.000 kcal.');
      return;
    }
    estado.meta = meta;
    salvar();
    $('dlgConfig').close();
    render();
  }

  function limparTudo() {
    if (!confirm('Apagar todos os registros, alimentos cadastrados e a meta? Isso não pode ser desfeito.')) return;
    try { localStorage.removeItem(CHAVE); } catch (e) { /* ignora */ }
    estado = carregar();
    $('dlgConfig').close();
    render();
  }

  // ---------- Eventos ----------
  $('diaAnt').addEventListener('click', () => irPara(somarDias(dataAtual, -1)));
  $('diaProx').addEventListener('click', () => irPara(somarDias(dataAtual, 1)));
  $('dataInput').addEventListener('change', (e) => { if (e.target.value) irPara(e.target.value); });
  $('dataRotulo').addEventListener('click', () => irPara(chaveData(new Date())));

  $('btnConfig').addEventListener('click', abrirConfig);
  $('btnCalcular').addEventListener('click', calcularMeta);
  $('btnSalvarCfg').addEventListener('click', salvarConfig);
  $('btnLimpar').addEventListener('click', limparTudo);

  $('busca').addEventListener('input', renderResultados);
  $('selGramas').addEventListener('input', atualizarPrevia);
  $('selGramas').addEventListener('keydown', (e) => { if (e.key === 'Enter') confirmarSelecionado(); });
  $('btnAddSel').addEventListener('click', confirmarSelecionado);
  $('btnAddManual').addEventListener('click', confirmarManual);
  document.querySelectorAll('.abas button').forEach((b) =>
    b.addEventListener('click', () => trocarAba(b.dataset.aba)));

  document.querySelectorAll('dialog').forEach((dlg) => {
    dlg.querySelectorAll('[data-fechar]').forEach((b) => b.addEventListener('click', () => dlg.close()));
    // Fecha ao clicar fora do conteúdo
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  });

  render();
})();
