import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Servicos.css";

export default function Servicos() {
  // ===== ROTEAMENTO =====
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const carroIdDaUrl = searchParams.get("carroId");
  const isNovaOS = location.pathname.includes("/servicos/novo");

  // ===== FORMULÁRIO - CAMPOS PRINCIPAIS =====
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [carroSelecionado, setCarroSelecionado] = useState(null);

  const [buscaClienteForm, setBuscaClienteForm] = useState("");
  const [buscaCarroForm, setBuscaCarroForm] = useState("");

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [temGarantia, setTemGarantia] = useState(false);
  const [tempoGarantiaDias, setTempoGarantiaDias] = useState("");

  const [descricao, setDescricao] = useState("");

  const [valorMaoObra, setValorMaoObra] = useState("");
  const [tempoMaoObra, setTempoMaoObra] = useState("");

  // ===== PEÇAS DO SERVIÇO =====
  const [pecas, setPecas] = useState([]);
  const [pecaNome, setPecaNome] = useState("");
  const [pecaPrecoCusto, setPecaPrecoCusto] = useState("");
  const [pecaPrecoVenda, setPecaPrecoVenda] = useState("");

  // ===== PAGAMENTO =====
  // DINHEIRO, PIX, DEBITO, CREDITO_AVISTA, CREDITO_PARCELADO, CHEQUE
  const [formaPagamento, setFormaPagamento] = useState("DINHEIRO");
  const [numeroParcelas, setNumeroParcelas] = useState(1);
  const [jurosPercentual, setJurosPercentual] = useState(0);
  const [chequeData, setChequeData] = useState("");

  // ===== STATUS =====
  const [status, setStatus] = useState("EM_ANDAMENTO"); // EM_ANDAMENTO ou CONCLUIDO

  // ===== LISTAS GERAIS =====
  const [clientes, setClientes] = useState([]);
  const [carros, setCarros] = useState([]);
  const [servicos, setServicos] = useState([]);

  // ===== CONTROLE DE EDIÇÃO =====
  const [servicoEditandoId, setServicoEditandoId] = useState(null);

  // ===== FILTROS PARA LISTAS =====
  const [buscaServicos, setBuscaServicos] = useState("");
  const [filtroPagamentoHistorico, setFiltroPagamentoHistorico] =
    useState("TODOS"); // TODOS / DINHEIRO / PIX / MAQUININHA / CHEQUE

  // ===== MODAIS (PEÇAS e PARCELAS) =====
  const [servicoPecasVisivel, setServicoPecasVisivel] = useState(null);
  const [servicoParcelasVisivel, setServicoParcelasVisivel] = useState(null);

  // ===== CARREGAR DADOS NO INÍCIO =====
  useEffect(() => {
    carregarClientes();
    carregarCarros();
    carregarServicos();
  }, []);

  // Pré-selecionar carro vindo da URL (Nova OS a partir do carro)
  useEffect(() => {
    if (carros.length > 0 && carroIdDaUrl) {
      const encontrado = carros.find((c) => c.id === carroIdDaUrl);
      if (encontrado) {
        setCarroSelecionado(encontrado);
        if (encontrado.cliente) {
          setClienteSelecionado(encontrado.cliente);
        }
      }
    }
  }, [carros, carroIdDaUrl]);

  // ===== REQUISIÇÕES =====
  async function carregarClientes() {
    try {
      const response = await api.get("/clientes");
      setClientes(response.data);
    } catch (err) {
      console.log("Erro ao carregar clientes:", err);
    }
  }

  async function carregarCarros() {
    try {
      const response = await api.get("/carros");
      setCarros(response.data);
    } catch (err) {
      console.log("Erro ao carregar carros:", err);
    }
  }

  async function carregarServicos() {
    try {
      const response = await api.get("/servicos");
      setServicos(response.data);
    } catch (err) {
      console.log("Erro ao carregar serviços:", err);
    }
  }

  // ===== CÁLCULOS DE VALORES =====
  const valorGasto = pecas.reduce(
    (total, p) => total + (Number(p.precoCusto) || 0),
    0
  );
  const valorPecasCobrado = pecas.reduce(
    (total, p) => total + (Number(p.precoVenda) || 0),
    0
  );
  const valorMaoObraNum = Number(valorMaoObra) || 0;
  const valorBase = valorPecasCobrado + valorMaoObraNum;

  const jurosNum =
    formaPagamento === "CREDITO_PARCELADO" && numeroParcelas > 1
      ? Number(jurosPercentual) || 0
      : 0;

  const valorComJuros =
    formaPagamento === "CREDITO_PARCELADO" && numeroParcelas > 1
      ? valorBase * (1 + jurosNum / 100)
      : valorBase;

  const valorParcela =
    formaPagamento === "CREDITO_PARCELADO" && numeroParcelas > 1
      ? valorComJuros / numeroParcelas
      : valorComJuros;

  const parcelasGeradas =
    formaPagamento === "CREDITO_PARCELADO" && numeroParcelas > 1
      ? Array.from({ length: numeroParcelas }, (_, i) => ({
          numero: i + 1,
          valor: Number(valorParcela.toFixed(2)),
          pago: false,
        }))
      : [];

  // ===== PEÇAS NO FORM =====
  function adicionarPeca() {
    if (!pecaNome.trim()) {
      alert("Informe o nome da peça.");
      return;
    }

    const novaPeca = {
      nome: pecaNome,
      precoCusto: Number(pecaPrecoCusto) || 0,
      precoVenda: Number(pecaPrecoVenda) || 0,
    };

    setPecas((prev) => [...prev, novaPeca]);
    setPecaNome("");
    setPecaPrecoCusto("");
    setPecaPrecoVenda("");
  }

  function removerPeca(index) {
    setPecas((prev) => prev.filter((_, i) => i !== index));
  }

  // ===== LIMPAR FORMULÁRIO =====
  function limparFormulario() {
    setClienteSelecionado(null);
    setCarroSelecionado(null);
    setBuscaClienteForm("");
    setBuscaCarroForm("");

    setDataInicio("");
    setDataFim("");
    setTemGarantia(false);
    setTempoGarantiaDias("");
    setDescricao("");

    setValorMaoObra("");
    setTempoMaoObra("");

    setPecas([]);
    setPecaNome("");
    setPecaPrecoCusto("");
    setPecaPrecoVenda("");

    setFormaPagamento("DINHEIRO");
    setNumeroParcelas(1);
    setJurosPercentual(0);
    setChequeData("");

    setStatus("EM_ANDAMENTO");
    setServicoEditandoId(null);

    if (isNovaOS) {
      navigate("/servicos");
    }
  }

  // ===== SALVAR SERVIÇO =====
  async function salvarServico(e) {
    e.preventDefault();

    if (!clienteSelecionado) {
      alert("Selecione o cliente.");
      return;
    }

    if (!carroSelecionado) {
      alert("Selecione o carro.");
      return;
    }

    if (!dataInicio) {
      alert("Data de início é obrigatória.");
      return;
    }

    if (!descricao.trim()) {
      alert("Descrição do serviço é obrigatória.");
      return;
    }

    if (formaPagamento === "CHEQUE" && !chequeData) {
      alert("Informe a data para depósito do cheque.");
      return;
    }

    const dadosServico = {
      clienteId: clienteSelecionado.id,
      carroId: carroSelecionado.id,
      dataInicio,
      dataFim: dataFim || null,
      temGarantia,
      tempoGarantiaDias: temGarantia ? Number(tempoGarantiaDias) || 0 : 0,
      descricao,
      valorMaoObra: valorMaoObraNum,
      tempoMaoObra: tempoMaoObra || null,
      pecas: pecas,
      valorGasto,
      valorTotal: valorComJuros,
      formaPagamento,
      numeroParcelas:
        formaPagamento === "CREDITO_PARCELADO" && numeroParcelas > 1
          ? numeroParcelas
          : 1,
      jurosPercentual: jurosNum,
      parcelas:
        formaPagamento === "CREDITO_PARCELADO" && numeroParcelas > 1
          ? parcelasGeradas
          : [],
      chequeData: formaPagamento === "CHEQUE" ? chequeData : null,
      status,
    };

    try {
      if (servicoEditandoId) {
        await api.put(`/servicos/${servicoEditandoId}`, dadosServico);
        alert("Serviço atualizado com sucesso!");
      } else {
        await api.post("/servicos", dadosServico);
        alert("Serviço cadastrado com sucesso!");
      }
      carregarServicos();
      limparFormulario();
    } catch (err) {
      console.log("Erro ao salvar serviço:", err);
      alert("Erro ao salvar serviço.");
    }
  }

  // ===== PREPARAR EDIÇÃO =====
  function prepararEdicao(servico) {
    if (servico.cliente) setClienteSelecionado(servico.cliente);
    else setClienteSelecionado(null);

    if (servico.carro) setCarroSelecionado(servico.carro);
    else setCarroSelecionado(null);

    setDataInicio(servico.dataInicio || "");
    setDataFim(servico.dataFim || "");
    setTemGarantia(servico.temGarantia || false);
    setTempoGarantiaDias(
      servico.tempoGarantiaDias != null
        ? String(servico.tempoGarantiaDias)
        : ""
    );
    setDescricao(servico.descricao || "");

    setValorMaoObra(
      servico.valorMaoObra != null ? String(servico.valorMaoObra) : ""
    );
    setTempoMaoObra(servico.tempoMaoObra || "");

    setPecas(servico.pecas || []);

    setFormaPagamento(servico.formaPagamento || "DINHEIRO");
    setNumeroParcelas(servico.numeroParcelas || 1);
    setJurosPercentual(servico.jurosPercentual || 0);
    setChequeData(servico.chequeData || "");

    setStatus(servico.status || "EM_ANDAMENTO");
    setServicoEditandoId(servico.id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ===== EXCLUIR SERVIÇO =====
  async function excluirServico(servico) {
    if (!window.confirm("Tem certeza que deseja excluir este serviço?")) {
      return;
    }
    try {
      await api.delete(`/servicos/${servico.id}`);
      carregarServicos();
    } catch (err) {
      console.log("Erro ao excluir serviço:", err);
      if (err.response && err.response.data) {
        alert(err.response.data);
      } else {
        alert("Erro ao excluir serviço.");
      }
    }
  }

  // ===== CONCLUIR SERVIÇO =====
  async function concluirServico(servico) {
    if (!window.confirm("Marcar este serviço como concluído?")) return;

    try {
      // Endpoint específico (depois a gente casa com o back)
      await api.put(`/servicos/${servico.id}/status`, { status: "CONCLUIDO" });
      carregarServicos();
    } catch (err) {
      console.log("Erro ao concluir serviço:", err);
      alert("Erro ao concluir serviço.");
    }
  }

  // ===== FILTROS DE CLIENTE/CARRO NO FORM =====
  const clientesFiltradosForm = clientes.filter((cli) => {
    if (!buscaClienteForm.trim()) return true;
    const texto = buscaClienteForm.toLowerCase();
    return (
      cli.nome?.toLowerCase().includes(texto) ||
      cli.telefone?.toLowerCase().includes(texto) ||
      cli.cpf?.toLowerCase().includes(texto)
    );
  });

  const carrosFiltradosForm = carros.filter((carro) => {
    if (!buscaCarroForm.trim()) return true;
    const texto = buscaCarroForm.toLowerCase();

    const placaMatch = carro.placa?.toLowerCase().includes(texto);
    const modeloMatch = carro.modelo?.toLowerCase().includes(texto);
    const donoMatch = carro.cliente?.nome?.toLowerCase().includes(texto);

    return placaMatch || modeloMatch || donoMatch;
  });

  // ===== FILTRO DE SERVIÇOS PARA TABELAS =====
  const servicosFiltrados = servicos.filter((servico) => {
    if (carroIdDaUrl && servico.carro && servico.carro.id !== carroIdDaUrl) {
      return false;
    }

    if (!buscaServicos.trim()) return true;
    const texto = buscaServicos.toLowerCase();

    const descMatch = servico.descricao?.toLowerCase().includes(texto);
    const nomeMatch = servico.cliente?.nome?.toLowerCase().includes(texto);
    const carroMatch = servico.carro?.modelo?.toLowerCase().includes(texto);
    const placaMatch = servico.carro?.placa?.toLowerCase().includes(texto);

    return descMatch || nomeMatch || carroMatch || placaMatch;
  });

  const servicosEmAndamento = servicosFiltrados.filter(
    (s) => s.status === "EM_ANDAMENTO"
  );

  function ehPagamentoMaquininha(fp) {
    return (
      fp === "DEBITO" ||
      fp === "CREDITO_AVISTA" ||
      fp === "CREDITO_PARCELADO"
    );
  }

  const servicosConcluidosBase = servicosFiltrados.filter(
    (s) => s.status === "CONCLUIDO"
  );

  const servicosConcluidos = servicosConcluidosBase.filter((s) => {
    if (filtroPagamentoHistorico === "TODOS") return true;

    const fp = s.formaPagamento;

    if (filtroPagamentoHistorico === "DINHEIRO") return fp === "DINHEIRO";
    if (filtroPagamentoHistorico === "PIX") return fp === "PIX";
    if (filtroPagamentoHistorico === "MAQUININHA")
      return ehPagamentoMaquininha(fp);
    if (filtroPagamentoHistorico === "CHEQUE") return fp === "CHEQUE";

    return true;
  });

  // ===== SERVIÇOS COM PAGAMENTO PENDENTE =====
  const servicosPendentes = servicosFiltrados.filter((s) => {
    // cartão parcelado com pelo menos uma parcela não paga
    if (
      s.formaPagamento === "CREDITO_PARCELADO" &&
      Array.isArray(s.parcelas) &&
      s.parcelas.some((p) => !p.pago)
    ) {
      return true;
    }

    // qualquer serviço pago em cheque entra como pendente
    if (s.formaPagamento === "CHEQUE") return true;

    return false;
  });

  // ===== AUXILIARES =====
  function resumoDescricao(texto, limite = 40) {
    if (!texto) return "-";
    return texto.length > limite ? texto.slice(0, limite) + "..." : texto;
  }

  async function alternarParcelaPaga(servico, indiceParcela) {
    if (!servico.parcelas || !servico.parcelas.length) return;

    const novosServicos = servicos.map((s) => {
      if (s.id === servico.id) {
        const novasParcelas = s.parcelas.map((parcela, index) =>
          index === indiceParcela
            ? { ...parcela, pago: !parcela.pago }
            : parcela
        );
        return { ...s, parcelas: novasParcelas };
      }
      return s;
    });

    setServicos(novosServicos);

    // aqui depois dá pra fazer PUT no back com as parcelas atualizadas
  }

  function textoFormaPagamento(servico) {
    const fp = servico.formaPagamento || "DINHEIRO";
    const base = {
      DINHEIRO: "Dinheiro",
      PIX: "Pix",
      DEBITO: "Débito",
      CREDITO_AVISTA: "Crédito à vista",
      CREDITO_PARCELADO: "Crédito parcelado",
      CHEQUE: "Cheque",
    }[fp];

    if (fp === "CREDITO_PARCELADO") {
      return `${base} (${servico.numeroParcelas}x, ${servico.jurosPercentual}% juros)`;
    }

    if (fp === "CHEQUE" && servico.chequeData) {
      return `${base} (para ${servico.chequeData})`;
    }

    return base;
  }

  const tituloPagina = "Serviços";

  return (
    <div className="servicos-container">
      <h1 className="titulo">{tituloPagina}</h1>

      {/* ===================== SEÇÃO 1 - FORMULÁRIO ===================== */}
      <div className="secao">
        <h2 className="secao-titulo">
          {servicoEditandoId ? "Editar serviço" : "Nova ordem de serviço"}
        </h2>

        <form className="form" onSubmit={salvarServico}>
          {/* CLIENTE / CARRO */}
          <div className="grupo-horizontal">
            <div className="campo-flex">
              <label className="label">Cliente:</label>
              {clienteSelecionado ? (
                <div className="selecionado-box">
                  <span>
                    <strong>{clienteSelecionado.nome}</strong> (
                    {clienteSelecionado.telefone})
                  </span>
                  <button
                    type="button"
                    className="btn-trocar"
                    onClick={() => setClienteSelecionado(null)}
                  >
                    Trocar
                  </button>
                </div>
              ) : (
                <>
                  <input
                    className="input"
                    type="text"
                    placeholder="Buscar cliente por nome, telefone ou CPF"
                    value={buscaClienteForm}
                    onChange={(e) => setBuscaClienteForm(e.target.value)}
                  />
                  <div className="lista-popup">
                    {clientesFiltradosForm.slice(0, 5).map((cli) => (
                      <div
                        key={cli.id}
                        className="item-popup"
                        onClick={() => setClienteSelecionado(cli)}
                      >
                        <span className="linha-principal">{cli.nome}</span>
                        <span className="linha-secundaria">
                          {cli.telefone} {cli.cpf && `- ${cli.cpf}`}
                        </span>
                      </div>
                    ))}
                    {clientesFiltradosForm.length === 0 && (
                      <p className="nenhum-item">Nenhum cliente encontrado.</p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="campo-flex">
              <label className="label">Carro:</label>
              {carroSelecionado ? (
                <div className="selecionado-box">
                  <span>
                    <strong>{carroSelecionado.placa}</strong> -{" "}
                    {carroSelecionado.modelo}{" "}
                    {carroSelecionado.cliente &&
                      `(${carroSelecionado.cliente.nome})`}
                  </span>
                  <button
                    type="button"
                    className="btn-trocar"
                    onClick={() => setCarroSelecionado(null)}
                  >
                    Trocar
                  </button>
                </div>
              ) : (
                <>
                  <input
                    className="input"
                    type="text"
                    placeholder="Buscar carro por placa, modelo ou dono"
                    value={buscaCarroForm}
                    onChange={(e) => setBuscaCarroForm(e.target.value)}
                  />
                  <div className="lista-popup">
                    {carrosFiltradosForm.slice(0, 5).map((carro) => (
                      <div
                        key={carro.id}
                        className="item-popup"
                        onClick={() => {
                          setCarroSelecionado(carro);
                          if (carro.cliente) {
                            setClienteSelecionado(carro.cliente);
                          }
                        }}
                      >
                        <span className="linha-principal">
                          {carro.placa} - {carro.modelo}
                        </span>
                        <span className="linha-secundaria">
                          {carro.cliente
                            ? carro.cliente.nome
                            : "Sem dono cadastrado"}
                        </span>
                      </div>
                    ))}
                    {carrosFiltradosForm.length === 0 && (
                      <p className="nenhum-item">Nenhum carro encontrado.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* DATAS */}
          <div className="grupo-horizontal">
            <div className="campo-flex">
              <label className="label">Data início:</label>
              <input
                className="input"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                required
              />
            </div>
            <div className="campo-flex">
              <label className="label">Data fim (opcional):</label>
              <input
                className="input"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
          </div>

          {/* GARANTIA */}
          <div className="grupo-horizontal">
            <div className="campo-flex">
              <label className="label">Garantia:</label>
              <div className="toggle-wrapper">
                <button
                  type="button"
                  className={temGarantia ? "toggle active" : "toggle"}
                  onClick={() => setTemGarantia(true)}
                >
                  Tem garantia
                </button>
                <button
                  type="button"
                  className={!temGarantia ? "toggle inactive" : "toggle"}
                  onClick={() => setTemGarantia(false)}
                >
                  Sem garantia
                </button>
              </div>
            </div>
            {temGarantia && (
              <div className="campo-flex">
                <label className="label">Tempo de garantia (dias):</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  value={tempoGarantiaDias}
                  onChange={(e) => setTempoGarantiaDias(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* DESCRIÇÃO */}
          <label className="label">Descrição do serviço:</label>
          <textarea
            className="textarea"
            placeholder="Descreva o serviço realizado, problemas encontrados, observações..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          {/* MÃO DE OBRA */}
          <div className="grupo-horizontal">
            <div className="campo-flex">
              <label className="label">Valor mão de obra:</label>
              <input
                className="input"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={valorMaoObra}
                onChange={(e) => setValorMaoObra(e.target.value)}
              />
            </div>
            <div className="campo-flex">
              <label className="label">Tempo de serviço (ex: 2h30):</label>
              <input
                className="input"
                type="text"
                placeholder="Tempo gasto"
                value={tempoMaoObra}
                onChange={(e) => setTempoMaoObra(e.target.value)}
              />
            </div>
          </div>

          {/* PEÇAS */}
          <div className="secao-sub">
            <h3 className="subtitulo-form">Peças utilizadas</h3>
            <div className="grupo-horizontal">
              <div className="campo-flex">
                <label className="label">Nome da peça:</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Ex: Filtro de óleo"
                  value={pecaNome}
                  onChange={(e) => setPecaNome(e.target.value)}
                />
              </div>
              <div className="campo-flex">
                <label className="label">Preço pago (custo):</label>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={pecaPrecoCusto}
                  onChange={(e) => setPecaPrecoCusto(e.target.value)}
                />
              </div>
              <div className="campo-flex">
                <label className="label">Preço cobrado:</label>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={pecaPrecoVenda}
                  onChange={(e) => setPecaPrecoVenda(e.target.value)}
                />
              </div>
              <div className="campo-flex botao-peca">
                <button
                  type="button"
                  className="btn-adicionar-peca"
                  onClick={adicionarPeca}
                >
                  Adicionar peça
                </button>
              </div>
            </div>

            {pecas.length > 0 && (
              <table className="tabela-pecas-form">
                <thead>
                  <tr>
                    <th>Peça</th>
                    <th>Preço pago</th>
                    <th>Preço cobrado</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pecas.map((p, index) => (
                    <tr key={index}>
                      <td>{p.nome}</td>
                      <td>R$ {p.precoCusto.toFixed(2)}</td>
                      <td>R$ {p.precoVenda.toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-remover-peca"
                          onClick={() => removerPeca(index)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* PAGAMENTO */}
          <div className="secao-sub">
            <h3 className="subtitulo-form">Pagamento</h3>

            <div className="grupo-horizontal">
              <div className="campo-flex">
                <label className="label">Forma de pagamento:</label>
                <select
                  className="input"
                  value={formaPagamento}
                  onChange={(e) => {
                    const valor = e.target.value;
                    setFormaPagamento(valor);

                    if (valor !== "CREDITO_PARCELADO") {
                      setNumeroParcelas(1);
                      setJurosPercentual(0);
                    }
                    if (valor !== "CHEQUE") {
                      setChequeData("");
                    }
                  }}
                >
                  <option value="DINHEIRO">Dinheiro</option>
                  <option value="PIX">Pix</option>
                  <option value="DEBITO">Débito</option>
                  <option value="CREDITO_AVISTA">Crédito à vista</option>
                  <option value="CREDITO_PARCELADO">Crédito parcelado</option>
                  <option value="CHEQUE">Cheque</option>
                </select>
              </div>

              {formaPagamento === "CREDITO_PARCELADO" && (
                <>
                  <div className="campo-flex">
                    <label className="label">Número de parcelas:</label>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      value={numeroParcelas}
                      onChange={(e) =>
                        setNumeroParcelas(
                          Math.max(1, Number(e.target.value) || 1)
                        )
                      }
                    />
                  </div>

                  <div className="campo-flex">
                    <label className="label">Juros (%):</label>
                    <input
                      className="input"
                      type="number"
                      min="0"
                      step="0.1"
                      value={jurosPercentual}
                      onChange={(e) =>
                        setJurosPercentual(Number(e.target.value) || 0)
                      }
                    />
                  </div>
                </>
              )}

              {formaPagamento === "CHEQUE" && (
                <div className="campo-flex">
                  <label className="label">
                    Data para depósito do cheque:
                  </label>
                  <input
                    className="input"
                    type="date"
                    value={chequeData}
                    onChange={(e) => setChequeData(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="resumo-valores">
              <p>
                Valor gasto (peças):{" "}
                <strong>R$ {valorGasto.toFixed(2)}</strong>
              </p>
              <p>
                Valor peças (cobrado):{" "}
                <strong>R$ {valorPecasCobrado.toFixed(2)}</strong>
              </p>
              <p>
                Valor base (peças + mão de obra):{" "}
                <strong>R$ {valorBase.toFixed(2)}</strong>
              </p>
              {formaPagamento === "CREDITO_PARCELADO" && numeroParcelas > 1 ? (
                <p>
                  Total com juros ({jurosNum}%):{" "}
                  <strong>R$ {valorComJuros.toFixed(2)}</strong> em{" "}
                  <strong>
                    {numeroParcelas}x de R$ {valorParcela.toFixed(2)}
                  </strong>
                </p>
              ) : (
                <p>
                  Total a receber:{" "}
                  <strong>R$ {valorComJuros.toFixed(2)}</strong>
                </p>
              )}
              {formaPagamento === "CHEQUE" && chequeData && (
                <p>
                  Cheque para depósito em:{" "}
                  <strong>{chequeData}</strong>
                </p>
              )}
            </div>
          </div>

          {/* STATUS */}
          <div className="secao-sub">
            <h3 className="subtitulo-form">Status do serviço</h3>
            <div className="status-wrapper">
              <button
                type="button"
                className={
                  status === "EM_ANDAMENTO"
                    ? "status-btn status-andamento active"
                    : "status-btn status-andamento"
                }
                onClick={() => setStatus("EM_ANDAMENTO")}
              >
                Em andamento
              </button>
              <button
                type="button"
                className={
                  status === "CONCLUIDO"
                    ? "status-btn status-finalizado active"
                    : "status-btn status-finalizado"
                }
                onClick={() => setStatus("CONCLUIDO")}
              >
                Concluído
              </button>
            </div>
          </div>

          {/* BOTÕES FORM */}
          <div className="botoes-form">
            <button className="btn-cadastrar" type="submit">
              {servicoEditandoId ? "Salvar alterações" : "Salvar serviço"}
            </button>
            {servicoEditandoId && (
              <button
                type="button"
                className="btn-cancelar"
                onClick={limparFormulario}
              >
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ===================== SEÇÃO 2 - EM ANDAMENTO ===================== */}
      <div className="secao">
        <h2 className="secao-titulo">Serviços em andamento</h2>

        <div className="filtros-lista">
          <div className="filtro-esquerda">
            <label className="label">Buscar:</label>
            <input
              className="input"
              type="text"
              placeholder="Cliente, carro ou descrição"
              value={buscaServicos}
              onChange={(e) => setBuscaServicos(e.target.value)}
            />
          </div>
        </div>

        <table className="tabela-servicos">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Carro</th>
              <th>Descrição</th>
              <th>Mão de obra</th>
              <th>Valor gasto</th>
              <th>Valor total</th>
              <th>Peças</th>
              <th>Pagamento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {servicosEmAndamento.map((servico) => (
              <tr key={servico.id}>
                <td>{servico.cliente ? servico.cliente.nome : "-"}</td>
                <td>
                  {servico.carro
                    ? `${servico.carro.placa} - ${servico.carro.modelo}`
                    : "-"}
                </td>
                <td title={servico.descricao}>
                  {resumoDescricao(servico.descricao, 50)}
                </td>
                <td>
                  {servico.valorMaoObra != null
                    ? `R$ ${servico.valorMaoObra.toFixed(2)}`
                    : "-"}
                </td>
                <td>
                  {servico.valorGasto != null
                    ? `R$ ${servico.valorGasto.toFixed(2)}`
                    : "-"}
                </td>
                <td>
                  {servico.valorTotal != null
                    ? `R$ ${servico.valorTotal.toFixed(2)}`
                    : "-"}
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-pequeno"
                    onClick={() => setServicoPecasVisivel(servico)}
                  >
                    Ver peças
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-pequeno secundario"
                    onClick={() => {
                      if (servico.formaPagamento === "CREDITO_PARCELADO") {
                        setServicoParcelasVisivel(servico);
                      } else if (servico.formaPagamento === "CHEQUE") {
                        alert(
                          servico.chequeData
                            ? `Cheque para depósito em: ${servico.chequeData}`
                            : "Cheque (sem data cadastrada)"
                        );
                      } else {
                        alert(textoFormaPagamento(servico));
                      }
                    }}
                  >
                    {textoFormaPagamento(servico)}
                  </button>
                </td>
                <td className="acoes-cell-servico">
                  <button
                    className="btn-concluir"
                    type="button"
                    onClick={() => concluirServico(servico)}
                  >
                    Concluir
                  </button>
                  <button
                    className="btn-editar-servico"
                    type="button"
                    onClick={() => prepararEdicao(servico)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-excluir-servico"
                    type="button"
                    onClick={() => excluirServico(servico)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {servicosEmAndamento.length === 0 && (
              <tr>
                <td colSpan="9">Nenhum serviço em andamento.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===================== SEÇÃO 3 - PAGAMENTO PENDENTE ===================== */}
      <div className="secao">
        <h2 className="secao-titulo">Serviços com pagamento pendente</h2>

        <table className="tabela-servicos">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Carro</th>
              <th>Descrição</th>
              <th>Forma de pagamento</th>
              <th>Valor total</th>
              <th>Data cheque / parcelas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {servicosPendentes.map((servico) => (
              <tr key={servico.id}>
                <td>{servico.cliente ? servico.cliente.nome : "-"}</td>
                <td>
                  {servico.carro
                    ? `${servico.carro.placa} - ${servico.carro.modelo}`
                    : "-"}
                </td>
                <td title={servico.descricao}>
                  {resumoDescricao(servico.descricao, 50)}
                </td>
                <td>{textoFormaPagamento(servico)}</td>
                <td>
                  {servico.valorTotal != null
                    ? `R$ ${servico.valorTotal.toFixed(2)}`
                    : "-"}
                </td>
                <td>
                  {servico.formaPagamento === "CHEQUE" ? (
                    servico.chequeData || "-"
                  ) : servico.formaPagamento === "CREDITO_PARCELADO" ? (
                    <button
                      type="button"
                      className="btn-pequeno"
                      onClick={() => setServicoParcelasVisivel(servico)}
                    >
                      Ver parcelas
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="acoes-cell-servico">
                  <button
                    className="btn-editar-servico"
                    type="button"
                    onClick={() => prepararEdicao(servico)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-excluir-servico"
                    type="button"
                    onClick={() => excluirServico(servico)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {servicosPendentes.length === 0 && (
              <tr>
                <td colSpan="7">Nenhum pagamento pendente.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===================== SEÇÃO 4 - HISTÓRICO ===================== */}
      <div className="secao">
        <h2 className="secao-titulo">Histórico de serviços concluídos</h2>

        <div className="filtros-historico">
          <div className="campo-flex">
            <label className="label">Filtrar por pagamento:</label>
            <select
              className="input"
              value={filtroPagamentoHistorico}
              onChange={(e) => setFiltroPagamentoHistorico(e.target.value)}
            >
              <option value="TODOS">Todos</option>
              <option value="DINHEIRO">Só dinheiro</option>
              <option value="PIX">Só Pix</option>
              <option value="MAQUININHA">
                Só maquininha (débito/crédito)
              </option>
              <option value="CHEQUE">Só cheque</option>
            </select>
          </div>
        </div>

        <table className="tabela-servicos">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Carro</th>
              <th>Descrição</th>
              <th>Mão de obra</th>
              <th>Valor gasto</th>
              <th>Valor total</th>
              <th>Peças</th>
              <th>Pagamento</th>
              <th>Data fim</th>
              <th>Data cheque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {servicosConcluidos.map((servico) => (
              <tr key={servico.id}>
                <td>{servico.cliente ? servico.cliente.nome : "-"}</td>
                <td>
                  {servico.carro
                    ? `${servico.carro.placa} - ${servico.carro.modelo}`
                    : "-"}
                </td>
                <td title={servico.descricao}>
                  {resumoDescricao(servico.descricao, 50)}
                </td>
                <td>
                  {servico.valorMaoObra != null
                    ? `R$ ${servico.valorMaoObra.toFixed(2)}`
                    : "-"}
                </td>
                <td>
                  {servico.valorGasto != null
                    ? `R$ ${servico.valorGasto.toFixed(2)}`
                    : "-"}
                </td>
                <td>
                  {servico.valorTotal != null
                    ? `R$ ${servico.valorTotal.toFixed(2)}`
                    : "-"}
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-pequeno"
                    onClick={() => setServicoPecasVisivel(servico)}
                  >
                    Ver peças
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-pequeno secundario"
                    onClick={() => {
                      if (servico.formaPagamento === "CREDITO_PARCELADO") {
                        setServicoParcelasVisivel(servico);
                      } else if (servico.formaPagamento === "CHEQUE") {
                        alert(
                          servico.chequeData
                            ? `Cheque para depósito em: ${servico.chequeData}`
                            : "Cheque (sem data cadastrada)"
                        );
                      } else {
                        alert(textoFormaPagamento(servico));
                      }
                    }}
                  >
                    {textoFormaPagamento(servico)}
                  </button>
                </td>
                <td>{servico.dataFim || "-"}</td>
                <td>{servico.chequeData || "-"}</td>
                <td className="acoes-cell-servico">
                  <button
                    className="btn-editar-servico"
                    type="button"
                    onClick={() => prepararEdicao(servico)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-excluir-servico"
                    type="button"
                    onClick={() => excluirServico(servico)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {servicosConcluidos.length === 0 && (
              <tr>
                <td colSpan="11">Nenhum serviço concluído.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===================== MODAL - PEÇAS ===================== */}
      {servicoPecasVisivel && (
        <div
          className="modal-overlay"
          onClick={() => setServicoPecasVisivel(null)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>
              Peças do serviço -{" "}
              {servicoPecasVisivel.cliente
                ? servicoPecasVisivel.cliente.nome
                : "Cliente"}
            </h3>
            <table className="tabela-modal">
              <thead>
                <tr>
                  <th>Peça</th>
                  <th>Preço pago</th>
                  <th>Preço cobrado</th>
                </tr>
              </thead>
              <tbody>
                {(servicoPecasVisivel.pecas || []).map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.nome}</td>
                    <td>R$ {Number(p.precoCusto || 0).toFixed(2)}</td>
                    <td>R$ {Number(p.precoVenda || 0).toFixed(2)}</td>
                  </tr>
                ))}

                {(!servicoPecasVisivel.pecas ||
                  servicoPecasVisivel.pecas.length === 0) && (
                  <tr>
                    <td colSpan="3">Nenhuma peça cadastrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button
              className="btn-fechar-modal"
              type="button"
              onClick={() => setServicoPecasVisivel(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* ===================== MODAL - PARCELAS ===================== */}
      {servicoParcelasVisivel && (
        <div
          className="modal-overlay"
          onClick={() => setServicoParcelasVisivel(null)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>
              Parcelas -{" "}
              {servicoParcelasVisivel.cliente
                ? servicoParcelasVisivel.cliente.nome
                : "Cliente"}
            </h3>
            <table className="tabela-modal">
              <thead>
                <tr>
                  <th>Parcela</th>
                  <th>Valor</th>
                  <th>Pago?</th>
                </tr>
              </thead>
              <tbody>
                {(servicoParcelasVisivel.parcelas || []).map(
                  (parcela, idx) => (
                    <tr key={idx}>
                      <td>{parcela.numero}</td>
                      <td>R$ {Number(parcela.valor || 0).toFixed(2)}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={!!parcela.pago}
                          onChange={() =>
                            alternarParcelaPaga(servicoParcelasVisivel, idx)
                          }
                        />
                      </td>
                    </tr>
                  )
                )}

                {(!servicoParcelasVisivel.parcelas ||
                  servicoParcelasVisivel.parcelas.length === 0) && (
                  <tr>
                    <td colSpan="3">Nenhuma parcela cadastrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button
              className="btn-fechar-modal"
              type="button"
              onClick={() => setServicoParcelasVisivel(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
