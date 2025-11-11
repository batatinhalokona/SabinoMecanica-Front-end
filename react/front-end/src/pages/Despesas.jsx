// src/pages/Despesas.jsx
import React, { useState, useEffect } from 'react';
import { getDespesas, saveDespesa, deleteDespesa } from '../api/despesasApi';
import { getCategorias } from '../api/categoriaApi'; // Necessário para Select

const DespesaVazia = {
    id: null,
    data: new Date().toISOString().substring(0, 10),
    valor: 0.00,
    descricao: '',
    categoria: { id: '' }, // ID da Categoria associada
};

function Despesas() {
    const [despesas, setDespesas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [despesaEditando, setDespesaEditando] = useState(DespesaVazia);

    const fetchData = async () => {
        const [despesasData, categoriasData] = await Promise.all([
            getDespesas(),
            getCategorias()
        ]);
        setDespesas(despesasData);
        setCategorias(categoriasData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDespesaEditando(prev => ({ ...prev, [name]: value }));
    };
    
    // Handler específico para o SELECT da Categoria
    const handleCategoriaChange = (e) => {
        const id = e.target.value;
        setDespesaEditando(prev => ({ ...prev, categoria: { id: id || null } }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await saveDespesa(despesaEditando);
            setDespesaEditando(DespesaVazia);
            fetchData(); 
        } catch (error) {
            alert('Erro ao salvar a despesa. Verifique os dados.');
        }
    };
    
    // ... Implementação de handleEdit e handleDelete ...

    return (
        <div style={{ padding: '20px' }}>
            <h2>🧾 Despesas</h2>

            {/* Formulário */}
            <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                <h4>{despesaEditando.id ? 'Editar Despesa' : 'Nova Despesa'}</h4>
                
                <label>Categoria: </label>
                <select 
                    value={despesaEditando.categoria.id || ''} 
                    onChange={handleCategoriaChange}
                    required
                >
                    <option value="">Selecione uma Categoria</option>
                    {categorias.map(c => (
                        <option key={c.id} value={c.id}>{c.descricao}</option>
                    ))}
                </select>
                <br /><br />
                
                <label>Data: <input type="date" name="data" value={despesaEditando.data} onChange={handleChange} required /></label>
                <label style={{ marginLeft: '10px' }}>Valor: <input type="number" step="0.01" name="valor" value={despesaEditando.valor} onChange={handleChange} required /></label>
                <br /><br />
                <input type="text" name="descricao" value={despesaEditando.descricao} onChange={handleChange} placeholder="Descrição da Despesa" required style={{ width: '90%' }}/>
                <br />
                <button type="submit">Salvar Despesa</button>
                {/* ... Botão Cancelar Edição ... */}
            </form>

            {/* Lista */}
            <h3>Despesas Registradas</h3>
            <table>
                {/* ... Tabela de Despesas (ID, Data, Valor, Descrição, Categoria) ... */}
                <tbody>
                    {despesas.map(d => (
                        <tr key={d.id}>
                            <td>{d.id}</td>
                            <td>{d.data}</td>
                            <td>R$ {d.valor.toFixed(2)}</td>
                            <td>{d.descricao}</td>
                            <td>{d.categoria.descricao}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Despesas;