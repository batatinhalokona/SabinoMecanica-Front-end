// src/api/movtosEntradaApi.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/movtos-entrada';

export const getMovtosEntrada = async () => (await axios.get(API_URL)).data;

export const saveMovtoEntrada = async (movtoData) => {
    if (movtoData.id) {
        return await axios.put(`${API_URL}/${movtoData.id}`, movtoData);
    }
    return await axios.post(API_URL, movtoData);
};

export const deleteMovtoEntrada = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};