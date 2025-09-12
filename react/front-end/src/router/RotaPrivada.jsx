// Importa o Navigate para redirecionamento automático
import { Navigate } from "react-router-dom";

// Componente que protege as rotas internas da aplicação
export default function RotaPrivada({ children }) {
  // Busca o usuário logado no localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Se não tiver usuário logado, redireciona automaticamente para o Login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
 
  // Se o usuário estiver logado, permite o acesso normalmente
  return children;
}
