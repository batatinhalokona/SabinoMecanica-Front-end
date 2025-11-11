// src/api/categoriaApi.js
import axios from 'axios';

// URL base da sua API Spring Boot.
// Se o backend estiver rodando na porta 8080.
const API_URL = 'http://localhost:8080/api/categorias';

/**
 * Funções CRUD para a entidade Categoria
 */

// 1. READ (Buscar todas as categorias)
export const getCategorias = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        throw error;
    }
};

// 2. CREATE (Cadastrar nova categoria)
export const createCategoria = async (categoriaData) => {
    try {
        // O Spring Boot espera um objeto JSON como corpo da requisição POST
        const response = await axios.post(API_URL, categoriaData);
        return response.data; // Retorna a categoria criada com o ID
    } catch (error) {
        console.error("Erro ao criar categoria:", error);
        throw error;
    }
};

// 3. UPDATE (Atualizar categoria existente)
export const updateCategoria = async (categoriaData) => {
    try {
        // Chamada PUT para /api/categorias/{id}
        const response = await axios.put(`${API_URL}/${categoriaData.id}`, categoriaData);
        return response.data; // Retorna a categoria atualizada
    } catch (error) {
        console.error("Erro ao atualizar categoria:", error);
        throw error;
    }
};

// 4. DELETE (Deletar categoria por ID)
export const deleteCategoria = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error("Erro ao deletar categoria:", error);
        throw error;
    }
};