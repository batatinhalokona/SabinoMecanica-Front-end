import { Link } from "react-router-dom";
import "./Registro.css";

export default function Registro() {
  return (
    <div className="registro-container">
      <h1>📋 Área de Registro</h1>
      <p>Selecione o que deseja cadastrar:</p>

      <div className="registro-menu">
        <Link to="/registro/cliente" className="registro-card cliente-card">
          <h2>👤 Novo Cliente</h2>
          <p>Cadastre um novo cliente no sistema.</p>
        </Link>

        <Link to="/registro/servico" className="registro-card servico-card">
          <h2>🧰 Novo Serviço</h2>
          <p>Registre um novo serviço prestado pela oficina.</p>
        </Link>

        <Link to="/registro/carro" className="registro-card carro-card">
          <h2>🚗 Novo Carro</h2>
          <p>Adicione um veículo ao cadastro de clientes.</p>
        </Link>
      </div>
    </div>
  );
}
