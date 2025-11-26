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

// Páginas de Serviços (APENAS 1)
import Servicos from "./pages/Servicos/Servicos";

// Páginas de Registro
import Registro from "./pages/Registro/Registro";

// Páginas de Estoque
import Estoque from "./pages/Estoque/Estoque";

// Nova página de Carros
import Carros from "./pages/Carros/Carros";

// CSS global
import "./index.css";
import "./App.css";

// ============================
// Definição das rotas
// ============================
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App controla nav/footer/login
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

// ============================
// Renderização do app
// ============================
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
