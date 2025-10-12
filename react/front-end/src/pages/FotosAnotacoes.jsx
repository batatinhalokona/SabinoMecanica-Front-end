import { useEffect, useState } from "react";
import api from "../api/api";

export default function FotosAnotacoes() {
  const [itens, setItens] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const buscar = async () => {
      try {
        const { data } = await api.get("/fotos");
        setItens(data || []);
      } catch (e) {
        setErro("Não foi possível carregar fotos/anotações (backend ainda não disponível).");
        console.error(e);
      }
    };
    buscar();
  }, []);

  return (
    <div>
      <h2>Fotos e Anotações</h2>
      {erro && <p style={{color:"red"}}>{erro}</p>}
      <ul>
        {itens.map(i => (
          <li key={i.id}>
            {i.titulo} — {i.descricao}
          </li>
        ))}
      </ul>
    </div>
  );
}
