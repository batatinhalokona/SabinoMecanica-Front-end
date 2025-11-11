// src/api/despesasApi.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/despesas';

export const getDespesas = async () => (await axios.get(API_URL)).data;

export const saveDespesa = async (despesaData) => {
    if (despesaData.id) {
        return await axios.put(`${API_URL}/${despesaData.id}`, despesaData);
    }
    return await axios.post(API_URL, despesaData);
};

export const deleteDespesa = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};