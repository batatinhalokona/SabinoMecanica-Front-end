// src/api/api.js
import axios from "axios";

// Configura a URL base para o backend Java
const api = axios.create({
  baseURL: "http://localhost:8080/api", // ajusta depois conforme suas rotas do Spring
});

export default api;
