import { useEffect, useState } from "react";
import api from "../api/api";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const buscar = async () => {
      try {
        const { data } = await api.get("/clientes");
        setClientes(data || []);
      } catch (e) {
        setErro("Não foi possível carregar clientes (backend ainda não disponível).");
        console.error(e);
      }
    };
    buscar();
  }, []);

  return (
    <div>
      <h2>Clientes</h2>
      {erro && <p style={{color:"red"}}>{erro}</p>}
      <ul>
        {clientes.map(c => <li key={c.id}>{c.nome} — {c.cpf} — {c.telefone}</li>)}
      </ul>
    </div>
  );
}
