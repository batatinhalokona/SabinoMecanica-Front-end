import { useEffect, useState } from "react";
import api from "../api/api";

export default function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const buscar = async () => {
      try {
        const { data } = await api.get("/servicos");
        setServicos(data || []);
      } catch (e) {
        setErro("Não foi possível carregar serviços (backend ainda não disponível).");
        console.error(e);
      }
    };
    buscar();
  }, []);

  return (
    <div>
      <h2>Serviços</h2>
      {erro && <p style={{color:"red"}}>{erro}</p>}
      <ul>
        {servicos.map(s => (
          <li key={s.id}>
            {s.nomeCliente} — {s.servico} — R$ {s.valor} — {s.data}
          </li>
        ))}
      </ul>
    </div>
  );
}
