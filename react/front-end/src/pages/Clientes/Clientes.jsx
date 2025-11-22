import React, { useEffect, useState } from "react";
import { FaUserPlus, FaUsers } from "react-icons/fa";
import api from "../api/api";
import "./Clientes.css";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState(null);

  const carregarClientes = async () => {
    try {
      const response = await api.get("/api/clientes"); // <-- IGUAL AO BACK
      setClientes(response.data);
      setErro(null);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setErro("Não foi possível carregar os clientes.");
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novoCliente = {
      nome,
      cpf,
      telefone,
      endereco: null, // por enquanto não vamos mexer com endereço
    };

    try {
      await api.post("/api/clientes", novoCliente);
      setNome("");
      setCpf("");
      setTelefone("");
      carregarClientes(); // recarrega lista
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      setErro("Erro ao salvar cliente.");
    }
  };

  return (
    <div className="clientes-container">
      <div className="clientes-content">
        <section className="clientes-info">
          <h1>Clientes</h1>
          <p className="clientes-subtitulo">
            Cadastre e gerencie os clientes da Oficina Sabino.
          </p>

          <div className="clientes-cards-row">
            <div className="clientes-card">
              <FaUsers className="clientes-card-icon" />
              <h2>Lista de clientes</h2>
              <p>Veja todos os clientes cadastrados.</p>
            </div>

            <div className="clientes-card">
              <FaUserPlus className="clientes-card-icon" />
              <h2>Novo cliente</h2>
              <p>Cadastre rapidamente um novo cliente.</p>
            </div>
          </div>

          <form className="clientes-form" onSubmit={handleSubmit}>
            <div className="form-grupo">
              <label>Nome do cliente</label>
              <input
                type="text"
                placeholder="Ex.: João da Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="form-grupo">
              <label>CPF</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>

            <div className="form-grupo">
              <label>Telefone</label>
              <input
                type="text"
                placeholder="(48) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            <button type="submit" className="clientes-botao-salvar">
              Salvar cliente
            </button>
          </form>

          {erro && <p className="erro-texto">{erro}</p>}

          {/* tabela simples de clientes */}
          <div className="clientes-lista">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Telefone</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nome}</td>
                    <td>{c.cpf}</td>
                    <td>{c.telefone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="clientes-imagem">
          <div className="carro-placeholder">
            <span className="carro-texto">
              Aqui depois vamos colocar a imagem do carro estilizado
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
