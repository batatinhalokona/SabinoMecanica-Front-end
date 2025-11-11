// src/pages/MovtoEntrada.jsx
import React, { useState, useEffect } from 'react';
import { getMovtosEntrada, saveMovtoEntrada, deleteMovtoEntrada } from '../api/movtosEntradaApi';
import { getServicos } from '../api/servicosApi'; // Necessário para Select

const MovtoVazio = {
    id: null,
    data: new Date().toISOString().substring(0, 10),
    valorPago: 0.00,
    servico: { id: '' }, // ID do Serviço associado
};

function MovtoEntrada() {
    const [movtos, setMovtos] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [movtoEditando, setMovtoEditando] = useState(MovtoVazio);

    const fetchData = async () => {
        const [movtosData, servicosData] = await Promise.all([
            getMovtosEntrada(),
            getServicos()
        ]);
        setMovtos(movtosData);
        setServicos(servicosData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovtoEditando(prev => ({ ...prev, [name]: value }));
    };
    
    // Handler específico para o SELECT do Serviço
    const handleServicoChange = (e) => {
        const id = e.target.value;
        setMovtoEditando(prev => ({ ...prev, servico: { id: id || null } }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await saveMovtoEntrada(movtoEditando);
            setMovtoEditando(MovtoVazio);
            fetchData(); 
        } catch (error) {
            alert('Erro ao salvar o pagamento. Verifique se o Serviço é válido.');
        }
    };
    
    // ... Implementação de handleEdit e handleDelete (similar aos anteriores) ...

    return (
        <div style={{ padding: '20px' }}>
            <h2>💸 Recebimentos (Movto Entrada)</h2>

            {/* Formulário */}
            <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                <h4>{movtoEditando.id ? 'Editar Pagamento' : 'Novo Pagamento'}</h4>
                
                <label>Serviço Associado: </label>
                <select 
                    value={movtoEditando.servico.id || ''} 
                    onChange={handleServicoChange}
                    required
                >
                    <option value="">Selecione um Serviço</option>
                    {servicos.map(s => (
                        <option key={s.id} value={s.id}>OS #{s.id} - Total: R$ {s.valorTotal.toFixed(2)}</option>
                    ))}
                </select>
                <br /><br />
                
                <label>Data: <input type="date" name="data" value={movtoEditando.data} onChange={handleChange} required /></label>
                <label style={{ marginLeft: '10px' }}>Valor Pago: <input type="number" step="0.01" name="valorPago" value={movtoEditando.valorPago} onChange={handleChange} required /></label>
                <br />
                <button type="submit">Salvar Pagamento</button>
                {/* ... Botão Cancelar Edição ... */}
            </form>

            {/* Lista */}
            <h3>Pagamentos Registrados</h3>
            <table>
                {/* ... Tabela de Movtos (ID, Data, Valor Pago, Serviço ID) ... */}
                <tbody>
                    {movtos.map(m => (
                        <tr key={m.id}>
                            <td>{m.id}</td>
                            <td>{m.data}</td>
                            <td>R$ {m.valorPago.toFixed(2)}</td>
                            <td>OS #{m.servico.id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MovtoEntrada;