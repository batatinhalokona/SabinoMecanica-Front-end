// src/main.jsx

// Importações essenciais do React e React Router
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Importa os componentes principais da aplicação
import App from './App';                     // Layout base com NavBar e Footer
import Login from './pages/Login';           // Tela de login
import Home from './pages/Home';             // Tela inicial com os 3 cards
import Servicos from './pages/Servicos/Servicos';     // Tela de Serviços
import Clientes from './pages/Clientes/Clientes';     // Tela de Clientes
import FotosAnotacoes from './pages/Registro/Registro'; // Tela de Fotos e Anotações
import RotaPrivada from './router/RotaPrivada';      // Importa a proteção de rotas

// Importa o CSS global (se tiver)
import './index.css';
import './App.css';

// Cria todas as rotas da aplicação
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // Estrutura base que contém NavBar + Outlet
    children: [
      {
        path: '/home',
        element: (
          <RotaPrivada>
            <Home />
          </RotaPrivada>
        ),
      },
      {
        path: '/Servicos',
        element: (
          <RotaPrivada>
            <Servicos />
          </RotaPrivada>
        ),
      },
      {
        path: '/clientes',
        element: (
          <RotaPrivada>
            <Clientes />
          </RotaPrivada>
        ),
      },
      {
        path: '/Registro',
        element: (
          <RotaPrivada>
            <FotosAnotacoes />
          </RotaPrivada>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <Login />, // Tela de Login (não precisa de proteção)
  },
]);

// Renderiza a aplicação
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
