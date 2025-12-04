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

  // ===== FORMULÁRIO PRINCIPAL =====
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

  // ===== PEÇAS =====
  const [pecas, setPecas] = useState([]);
  const [pecaNome, setPecaNome] = useState("");
  const [pecaPrecoCusto, setPecaPrecoCusto] = useState("");
  const [pecaPrecoVenda, setPecaPrecoVenda] = useState("");

  // ===== PAGAMENTO =====
  const [formaPagamento, setFormaPagamento] = useState("DINHEIRO");
  const [numeroParcelas, setNumeroParcelas] = useState(1);
  const [jurosPercentual, setJurosPercentual] = useState(0);
  const [chequeData, setChequeData] = useState("");

  // ===== STATUS =====
  const [status, setStatus] = useState("EM_ANDAMENTO");

  // ===== LISTAS =====
  const [clientes, setClientes] = useState([]);
  const [carros, setCarros] = useState([]);
  const [servicos, setServicos] = useState([]);

  // ===== CONTROLE =====
  const [servicoEditandoId, setServicoEditandoId] = useState(null);
  const [buscaServicos, setBuscaServicos] = useState("");
  const [filtroPagamentoHistorico, setFiltroPagamentoHistorico] =
    useState("TODOS");

  // ===== MODAIS =====
  const [servicoPecasVisivel, setServicoPecasVisivel] = useState(null);
  const [servicoParcelasVisivel, setServicoParcelasVisivel] = useState(null);

  // ===== CARREGAR DADOS =====
  useEffect(() => {
    carregarClientes();
    carregarCarros();
    carregarServicos();
  }, []);

  // Pré-selecionar carro vindo da URL
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

  // ============================
  // PROTEÇÃO CONTRA ERRO (NUNCA undefined)
  // ============================
  const listaClientes = Array.isArray(clientes) ? clientes : [];
  const listaCarros = Array.isArray(carros) ? carros : [];
  const listaServicos = Array.isArray(servicos) ? servicos : [];

  // ============================
  // REQUISIÇÕES
  // ============================
  async function carregarClientes() {
    try {
      const response = await api.get("/clientes");
      setClientes(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.log("Erro ao carregar clientes:", err);
      setClientes([]);
    }
  }

  async function carregarCarros() {
    try {
      const response = await api.get("/carros");
      setCarros(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.log("Erro ao carregar carros:", err);
      setCarros([]);
    }
  }

  async function carregarServicos() {
    try {
      const response = await api.get("/servicos");
      setServicos(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.log("Erro ao carregar serviços:", err);
      setServicos([]);
    }
  }

  // ============================
  // CÁLCULOS
  // ============================
  const valorGasto = pecas.reduce(
    (t, p) => t + (Number(p.precoCusto) || 0),
    0
  );
  const valorPecasCobrado = pecas.reduce(
    (t, p) => t + (Number(p.precoVenda) || 0),
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

  // ============================
  // PEÇAS
  // ============================
  function adicionarPeca() {
    if (!pecaNome.trim()) return alert("Informe o nome da peça.");

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

  function removerPeca(i) {
    setPecas((prev) => prev.filter((_, idx) => idx !== i));
  }

  // ============================
  // LIMPAR FORM
  // ============================
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

    if (isNovaOS) navigate("/servicos");
  }

  // ============================
  // SALVAR
  // ============================
  async function salvarServico(e) {
    e.preventDefault();

    if (!clienteSelecionado) return alert("Selecione o cliente.");
    if (!carroSelecionado) return alert("Selecione o carro.");
    if (!dataInicio) return alert("Informe a data de início.");
    if (!descricao.trim()) return alert("Informe a descrição.");
    if (formaPagamento === "CHEQUE" && !chequeData)
      return alert("Informe a data do cheque.");

    const dadosServico = {
      cliente: { id: clienteSelecionado.id },
      carro: { id: carroSelecionado.id },

      dataInicio,
      dataFim: dataFim || null,
      temGarantia,
      tempoGarantiaDias: temGarantia ? Number(tempoGarantiaDias) || 0 : 0,
      descricao,
      valorMaoObra: valorMaoObraNum,
      tempoMaoObra: tempoMaoObra || null,

      pecas,
      valorGasto,
      valorTotal: valorComJuros,

      formaPagamento,
      numeroParcelas:
        formaPagamento === "CREDITO_PARCELADO" ? numeroParcelas : 1,
      jurosPercentual: jurosNum,
      parcelas:
        formaPagamento === "CREDITO_PARCELADO" ? parcelasGeradas : [],
      chequeData: formaPagamento === "CHEQUE" ? chequeData : null,
      status,
    };

    try {
      if (servicoEditandoId) {
        await api.put(`/servicos/${servicoEditandoId}`, dadosServico);
        alert("Serviço atualizado!");
      } else {
        await api.post("/servicos", dadosServico);
        alert("Serviço cadastrado!");
      }
      carregarServicos();
      limparFormulario();
    } catch (err) {
      console.log("Erro ao salvar:", err);
      alert("Erro ao salvar serviço.");
    }
  }

  // ============================
  // EDITAR
  // ============================
  function prepararEdicao(servico) {
    setClienteSelecionado(servico.cliente || null);
    setCarroSelecionado(servico.carro || null);
    setDataInicio(servico.dataInicio || "");
    setDataFim(servico.dataFim || "");
    setTemGarantia(servico.temGarantia || false);
    setTempoGarantiaDias(
      servico.tempoGarantiaDias != null ? String(servico.tempoGarantiaDias) : ""
    );
    setDescricao(servico.descricao || "");
    setValorMaoObra(servico.valorMaoObra || "");
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

  // ============================
  // EXCLUIR
  // ============================
  async function excluirServico(servico) {
    if (!window.confirm("Excluir serviço?")) return;

    try {
      await api.delete(`/servicos/${servico.id}`);
      carregarServicos();
    } catch (err) {
      alert("Erro ao excluir.");
    }
  }

  // ============================
  // CONCLUIR (só muda status pra CONCLUIDO)
  // ============================
  async function concluirServico(servico) {
    if (!window.confirm("Concluir este serviço?")) return;

    try {
      await api.put(`/servicos/${servico.id}/status`, {
        status: "CONCLUIDO",
      });
      carregarServicos();
    } catch (err) {
      alert("Erro ao concluir serviço.");
    }
  }

  // ============================
  // FILTROS
  // ============================
  const clientesFiltradosForm = listaClientes.filter((cli) => {
    // Se um carro já foi selecionado, só mostra o dono desse carro
    if (carroSelecionado) {
      const dono = carroSelecionado.cliente;
      if (!dono || cli.id !== dono.id) {
        return false;
      }
    }

    if (!buscaClienteForm.trim()) return true;
    const txt = buscaClienteForm.toLowerCase();
    return (
      cli.nome?.toLowerCase().includes(txt) ||
      cli.telefone?.toLowerCase().includes(txt) ||
      cli.cpf?.toLowerCase().includes(txt)
    );
  });

  const carrosFiltradosForm = listaCarros.filter((carro) => {
    // Se um cliente já foi selecionado, só mostra carros desse cliente
    if (clienteSelecionado) {
      if (!carro.cliente || carro.cliente.id !== clienteSelecionado.id) {
        return false;
      }
    }

    if (!buscaCarroForm.trim()) return true;
    const txt = buscaCarroForm.toLowerCase();
    return (
      carro.placa?.toLowerCase().includes(txt) ||
      carro.modelo?.toLowerCase().includes(txt) ||
      carro.cliente?.nome?.toLowerCase().includes(txt)
    );
  });

  const servicosFiltrados = listaServicos.filter((servico) => {
    if (carroIdDaUrl && servico.carro?.id !== carroIdDaUrl) return false;
    if (!buscaServicos.trim()) return true;

    const txt = buscaServicos.toLowerCase();
    return (
      servico.descricao?.toLowerCase().includes(txt) ||
      servico.cliente?.nome?.toLowerCase().includes(txt) ||
      servico.carro?.modelo?.toLowerCase().includes(txt) ||
      servico.carro?.placa?.toLowerCase().includes(txt)
    );
  });

  // TABELAS SEPARADAS POR STATUS
  const servicosEmAndamento = servicosFiltrados.filter(
    (s) => s.status === "EM_ANDAMENTO"
  );

  const servicosPendentes = servicosFiltrados.filter(
    (s) => s.status === "PAGAMENTO_PENDENTE"
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

  // ============================
  // AUXILIARES
  // ============================
  function resumoDescricao(txt, limit = 40) {
    if (!txt) return "-";
    return txt.length > limit ? txt.slice(0, limit) + "..." : txt;
  }

  function textoFormaPagamento(servico) {
    const fp = servico.formaPagamento || "DINHEIRO";

    const nomes = {
      DINHEIRO: "Dinheiro",
      PIX: "Pix",
      DEBITO: "Débito",
      CREDITO_AVISTA: "Crédito à vista",
      CREDITO_PARCELADO: "Crédito parcelado",
      CHEQUE: "Cheque",
    };

    let base = nomes[fp];

    if (fp === "CREDITO_PARCELADO") {
      return `${base} (${servico.numeroParcelas}x, ${servico.jurosPercentual}% juros)`;
    }

    if (fp === "CHEQUE") {
      return `${base} (${servico.chequeData || "Sem data"})`;
    }

    return base;
  }

  const tituloPagina = "Serviços";

  // =============================================
  // ======= JSX ============
  // =============================================
  return (
    <div className="servicos-container">
      <h1 className="titulo">{tituloPagina}</h1>

      {/* ===================== FORMULÁRIO ===================== */}
      <div className="secao">
        <h2 className="secao-titulo">
          {servicoEditandoId ? "Editar serviço" : "Nova ordem de serviço"}
        </h2>

        <form className="form" onSubmit={salvarServico}>
          {/* CLIENTE / CARRO */}
          <div className="grupo-horizontal">
            {/* CLIENTE */}
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
                    onClick={() => {
                      setClienteSelecionado(null);
                      setCarroSelecionado(null);
                      setBuscaClienteForm("");
                      setBuscaCarroForm("");
                    }}
                  >
                    Trocar
                  </button>
                </div>
              ) : (
                <>
                  <input
                    className="input"
                    type="text"
                    placeholder="Buscar cliente..."
                    value={buscaClienteForm}
                    onChange={(e) => setBuscaClienteForm(e.target.value)}
                  />

                  <div className="lista-popup">
                    {clientesFiltradosForm.slice(0, 5).map((cli) => (
                      <div
                        key={cli.id}
                        className="item-popup"
                        onClick={() => {
                          setClienteSelecionado(cli);
                          setCarroSelecionado(null);
                          setBuscaClienteForm("");
                          setBuscaCarroForm("");
                        }}
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

            {/* CARRO */}
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
                    onClick={() => {
                      setCarroSelecionado(null);
                      setBuscaCarroForm("");
                    }}
                  >
                    Trocar
                  </button>
                </div>
              ) : (
                <>
                  <input
                    className="input"
                    type="text"
                    placeholder="Buscar carro..."
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
                            setBuscaClienteForm("");
                          }
                          setBuscaCarroForm("");
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
                <label className="label">Dias de garantia:</label>
                <input
                  className="input"
                  type="number"
                  value={tempoGarantiaDias}
                  onChange={(e) => setTempoGarantiaDias(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* DESCRIÇÃO */}
          <label className="label">Descrição:</label>
          <textarea
            className="textarea"
            placeholder="Descreva o serviço..."
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
              <label className="label">Tempo gasto:</label>
              <input
                className="input"
                type="text"
                placeholder="Ex: 2h30"
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
                  value={pecaNome}
                  onChange={(e) => setPecaNome(e.target.value)}
                />
              </div>

              <div className="campo-flex">
                <label className="label">Preço pago:</label>
                <input
                  className="input"
                  type="number"
                  step="0.01"
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
                  Adicionar
                </button>
              </div>
            </div>

            {pecas.length > 0 && (
              <table className="tabela-pecas-form">
                <thead>
                  <tr>
                    <th>Peça</th>
                    <th>Pago</th>
                    <th>Cobrado</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {pecas.map((p, i) => (
                    <tr key={i}>
                      <td>{p.nome}</td>
                      <td>R$ {p.precoCusto.toFixed(2)}</td>
                      <td>R$ {p.precoVenda.toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-remover-peca"
                          onClick={() => removerPeca(i)}
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
                    const f = e.target.value;
                    setFormaPagamento(f);

                    if (f !== "CREDITO_PARCELADO") {
                      setNumeroParcelas(1);
                      setJurosPercentual(0);
                    }
                    if (f !== "CHEQUE") {
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
                    <label className="label">Parcelas:</label>
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
                  <label className="label">Data do cheque:</label>
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
                Valor gasto: <strong>R$ {valorGasto.toFixed(2)}</strong>
              </p>
              <p>
                Peças (cobrado):{" "}
                <strong>R$ {valorPecasCobrado.toFixed(2)}</strong>
              </p>
              <p>
                Base total: <strong>R$ {valorBase.toFixed(2)}</strong>
              </p>

              {formaPagamento === "CREDITO_PARCELADO" &&
              numeroParcelas > 1 ? (
                <p>
                  Total com juros:{" "}
                  <strong>R$ {valorComJuros.toFixed(2)}</strong> (
                  {numeroParcelas}x de{" "}
                  <strong>R$ {valorParcela.toFixed(2)}</strong>)
                </p>
              ) : (
                <p>
                  Total: <strong>R$ {valorComJuros.toFixed(2)}</strong>
                </p>
              )}

              {formaPagamento === "CHEQUE" && chequeData && (
                <p>
                  Cheque para depósito em: <strong>{chequeData}</strong>
                </p>
              )}
            </div>
          </div>

          {/* STATUS */}
          <div className="secao-sub">
            <h3 className="subtitulo-form">Status</h3>

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
                  status === "PAGAMENTO_PENDENTE"
                    ? "status-btn status-pendente active"
                    : "status-btn status-pendente"
                }
                onClick={() => setStatus("PAGAMENTO_PENDENTE")}
              >
                Pagamento pendente
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

          {/* BOTÕES */}
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
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ===================== TABELA EM ANDAMENTO ===================== */}
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
            {servicosEmAndamento.map((s) => (
              <tr key={s.id}>
                <td>{s.cliente?.nome || "-"}</td>

                <td>
                  {s.carro
                    ? `${s.carro.placa} - ${s.carro.modelo}`
                    : "-"}
                </td>

                <td title={s.descricao}>
                  {resumoDescricao(s.descricao, 50)}
                </td>

                <td>
                  {s.valorMaoObra != null
                    ? `R$ ${s.valorMaoObra.toFixed(2)}`
                    : "-"}
                </td>

                <td>
                  {s.valorGasto != null
                    ? `R$ ${s.valorGasto.toFixed(2)}`
                    : "-"}
                </td>

                <td>
                  {s.valorTotal != null
                    ? `R$ ${s.valorTotal.toFixed(2)}`
                    : "-"}
                </td>

                <td>
                  <button
                    type="button"
                    className="btn-pequeno"
                    onClick={() => setServicoPecasVisivel(s)}
                  >
                    Ver peças
                  </button>
                </td>

                <td>
                  <button
                    type="button"
                    className="btn-pequeno secundario"
                    onClick={() => {
                      if (s.formaPagamento === "CREDITO_PARCELADO") {
                        setServicoParcelasVisivel(s);
                      } else if (s.formaPagamento === "CHEQUE") {
                        alert(s.chequeData);
                      } else {
                        alert(textoFormaPagamento(s));
                      }
                    }}
                  >
                    {textoFormaPagamento(s)}
                  </button>
                </td>

                <td className="acoes-cell-servico">
                  <button
                    className="btn-concluir"
                    type="button"
                    onClick={() => concluirServico(s)}
                  >
                    Concluir
                  </button>

                  <button
                    className="btn-editar-servico"
                    type="button"
                    onClick={() => prepararEdicao(s)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-excluir-servico"
                    type="button"
                    onClick={() => excluirServico(s)}
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

      {/* ===================== PAGAMENTO PENDENTE ===================== */}
      <div className="secao">
        <h2 className="secao-titulo">Serviços com pagamento pendente</h2>

        <table className="tabela-servicos">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Carro</th>
              <th>Descrição</th>
              <th>Pagamento</th>
              <th>Total</th>
              <th>Cheque / Parcelas</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {servicosPendentes.map((s) => (
              <tr key={s.id}>
                <td>{s.cliente?.nome || "-"}</td>

                <td>
                  {s.carro
                    ? `${s.carro.placa} - ${s.carro.modelo}`
                    : "-"}
                </td>

                <td>{resumoDescricao(s.descricao, 50)}</td>

                <td>{textoFormaPagamento(s)}</td>

                <td>
                  {s.valorTotal ? `R$ ${s.valorTotal.toFixed(2)}` : "-"}
                </td>

                <td>
                  {s.formaPagamento === "CHEQUE" ? (
                    s.chequeData
                  ) : s.formaPagamento === "CREDITO_PARCELADO" ? (
                    <button
                      className="btn-pequeno"
                      type="button"
                      onClick={() => setServicoParcelasVisivel(s)}
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
                    onClick={() => prepararEdicao(s)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-excluir-servico"
                    type="button"
                    onClick={() => excluirServico(s)}
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

      {/* ===================== HISTÓRICO ===================== */}
      <div className="secao">
        <h2 className="secao-titulo">Histórico de serviços concluídos</h2>

        <div className="filtros-historico">
          <label className="label">Pagamento:</label>
          <select
            className="input"
            value={filtroPagamentoHistorico}
            onChange={(e) => setFiltroPagamentoHistorico(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="DINHEIRO">Dinheiro</option>
            <option value="PIX">Pix</option>
            <option value="MAQUININHA">Maquininha</option>
            <option value="CHEQUE">Cheque</option>
          </select>
        </div>

        <table className="tabela-servicos">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Carro</th>
              <th>Descrição</th>
              <th>Mão de obra</th>
              <th>Gasto</th>
              <th>Total</th>
              <th>Peças</th>
              <th>Pagamento</th>
              <th>Data fim</th>
              <th>Cheque</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {servicosConcluidos.map((s) => (
              <tr key={s.id}>
                <td>{s.cliente?.nome || "-"}</td>

                <td>
                  {s.carro
                    ? `${s.carro.placa} - ${s.carro.modelo}`
                    : "-"}
                </td>

                <td>{resumoDescricao(s.descricao, 50)}</td>

                <td>
                  {s.valorMaoObra != null
                    ? `R$ ${s.valorMaoObra.toFixed(2)}`
                    : "-"}
                </td>

                <td>
                  {s.valorGasto != null
                    ? `R$ ${s.valorGasto.toFixed(2)}`
                    : "-"}
                </td>

                <td>
                  {s.valorTotal != null
                    ? `R$ ${s.valorTotal.toFixed(2)}`
                    : "-"}
                </td>

                <td>
                  <button
                    className="btn-pequeno"
                    onClick={() => setServicoPecasVisivel(s)}
                  >
                    Ver peças
                  </button>
                </td>

                <td>
                  <button
                    className="btn-pequeno secundario"
                    onClick={() => {
                      if (s.formaPagamento === "CREDITO_PARCELADO") {
                        setServicoParcelasVisivel(s);
                      } else if (s.formaPagamento === "CHEQUE") {
                        alert(s.chequeData);
                      } else {
                        alert(textoFormaPagamento(s));
                      }
                    }}
                  >
                    {textoFormaPagamento(s)}
                  </button>
                </td>

                <td>{s.dataFim || "-"}</td>
                <td>{s.chequeData || "-"}</td>

                <td className="acoes-cell-servico">
                  <button
                    className="btn-editar-servico"
                    onClick={() => prepararEdicao(s)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-excluir-servico"
                    onClick={() => excluirServico(s)}
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

      {/* ===================== MODAL PEÇAS ===================== */}
      {servicoPecasVisivel && (
        <div
          className="modal-overlay"
          onClick={() => setServicoPecasVisivel(null)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>
              Peças - {servicoPecasVisivel.cliente?.nome || "Cliente"}
            </h3>

            <table className="tabela-modal">
              <thead>
                <tr>
                  <th>Peça</th>
                  <th>Pago</th>
                  <th>Cobrado</th>
                </tr>
              </thead>

              <tbody>
                {(servicoPecasVisivel.pecas || []).map((p, i) => (
                  <tr key={i}>
                    <td>{p.nome}</td>
                    <td>R$ {Number(p.precoCusto).toFixed(2)}</td>
                    <td>R$ {Number(p.precoVenda).toFixed(2)}</td>
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
              onClick={() => setServicoPecasVisivel(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* ===================== MODAL PARCELAS ===================== */}
      {servicoParcelasVisivel && (
        <div
          className="modal-overlay"
          onClick={() => setServicoParcelasVisivel(null)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>
              Parcelas - {servicoParcelasVisivel.cliente?.nome || "Cliente"}
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
                {(servicoParcelasVisivel.parcelas || []).map((p, i) => (
                  <tr key={i}>
                    <td>{p.numero}</td>
                    <td>R$ {Number(p.valor).toFixed(2)}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!p.pago}
                        onChange={() => {
                          const novas =
                            servicoParcelasVisivel.parcelas.map(
                              (parc, idx) =>
                                idx === i ? { ...parc, pago: !parc.pago } : parc
                            );

                          setServicoParcelasVisivel({
                            ...servicoParcelasVisivel,
                            parcelas: novas,
                          });
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="btn-fechar-modal"
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
