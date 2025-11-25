// ============================
// Importações principais
// ============================
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Layout base + rota privada
import App from "./App";
import RotaPrivada from "./router/RotaPrivada";

// Páginas principais
import Login from "./pages/Login";
import Home from "./pages/Home";

// Páginas de Clientes
import Clientes from "./pages/Clientes/Clientes";

// Páginas de Serviços
import Servicos from "./pages/Servicos/Servicos";
import ServicoAndamento from "./pages/Servicos/ServicoAndamento";
import ServicoGarantia from "./pages/Servicos/ServicoGarantia";
import ServicoHistorico from "./pages/Servicos/ServicoHistorico";

// Páginas de Registro
import Registro from "./pages/Registro/Registro";

// Páginas de Estoque
import Estoque from "./pages/Estoque/Estoque";

// Nova página de Carros
import Carros from "./pages/Carros/Carros";

// CSS global
import "./index.css";
import "./App.css";

// Rotas
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: (
          <RotaPrivada>
            <Home />
          </RotaPrivada>
        ),
      },
      {
        path: "/clientes",
        element: (
          <RotaPrivada>
            <Clientes />
          </RotaPrivada>
        ),
      },
      {
        path: "/servicos",
        element: (
          <RotaPrivada>
            <Servicos />
          </RotaPrivada>
        ),
      },
      {
        path: "/servicos/andamento",
        element: (
          <RotaPrivada>
            <ServicoAndamento />
          </RotaPrivada>
        ),
      },
      {
        path: "/servicos/garantia",
        element: (
          <RotaPrivada>
            <ServicoGarantia />
          </RotaPrivada>
        ),
      },
      {
        path: "/servicos/historico",
        element: (
          <RotaPrivada>
            <ServicoHistorico />
          </RotaPrivada>
        ),
      },
      {
        path: "/registro",
        element: (
          <RotaPrivada>
            <Registro />
          </RotaPrivada>
        ),
      },
      {
        path: "/estoque",
        element: (
          <RotaPrivada>
            <Estoque />
          </RotaPrivada>
        ),
      },
      {
        path: "/carros",
        element: (
          <RotaPrivada>
            <Carros />
          </RotaPrivada>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
