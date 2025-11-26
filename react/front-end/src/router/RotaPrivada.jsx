import { Navigate } from "react-router-dom";

export default function RotaPrivada({ children }) {
  const usuario = localStorage.getItem("usuario");

  // Se não estiver logado → vai para login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado → renderiza as rotas internas
  return children;
}
