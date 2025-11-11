// src/pages/Servicos.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { getServicos, saveServico, deleteServico } from '../api/ServicosApi';
import { getClientes } from '../api/ClienteApi'; // Necessário para o Select
import { getCarros } from '../api/CarrosApi'; // Necessário para o Select
// Supondo que você tem um api para Carros também:
// import { getCarros } from '../api/carrosApi'; 

// Estrutura de Item de Serviço vazio
const ItemVazio = {
    descricao: '',
    quantidade: 1,
    valorUnitario: 0.00,
};

// Estrutura de Serviço vazio
const ServicoFormVazio = {
    id: null,
    // IDs das entidades relacionadas, para o Spring mapear
    cliente: { id: '' }, // Vai conter o objeto Cliente completo ou apenas o ID
    carro: { id: '' },   // Vai conter o objeto Carro completo ou apenas o ID
    dataEntrada: new Date().toISOString().substring(0, 10),
    dataSaida: '',
    valor_total: 0.00, // Será recalculado
    // A lista aninhada que o Spring espera
    itemServicoList: [{ ...ItemVazio }], 
};

function Servicos() {
    const [servicos, setServicos] = useState([]);
    const [servicoEditando, setServicoEditando] = useState(ServicoFormVazio);
    const [clientes, setClientes] = useState([]);
    const [carros, setCarros] = useState([]); // Mock: [ {id: 1, placa: 'ABC1234'} ]

    // 1. Lógica de Recálculo do Total no Front-end
    const valorTotalCalculado = useMemo(() => {
        return servicoEditando.itemServicoList.reduce((total, item) => {
            // Conversão para garantir que a quantidade seja tratada como número
            const quantidade = Number(item.quantidade) || 0;
            const valorUnitario = Number(item.valorUnitario) || 0;
            return total + (quantidade * valorUnitario);
        }, 0).toFixed(2);
    }, [servicoEditando.itemServicoList]);
    
    // Atualiza o valor_total do formulário com o valor calculado
    useEffect(() => {
        setServicoEditando(prev => ({
            ...prev,
            valor_total: Number(valorTotalCalculado)
        }));
    }, [valorTotalCalculado]);

    // 2. Carregamento Inicial de Dados (Serviços, Clientes, Carros)
    useEffect(() => {
        const fetchData = async () => {
            const [servicosData, clientesData, carrosData] = await Promise.all([
                getServicos(),
                getClientes(),
                getCarros(), 
            ]);
            setServicos(servicosData);
            setClientes(clientesData);
            setCarros(carrosData); 
        };
        fetchData();
    }, []);


    // 3. Funções para Gerenciar Itens de Serviço Dinamicamente
    
    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const list = [...servicoEditando.itemServicoList];
        
        // Atualiza o campo do item específico
        list[index] = {
            ...list[index],
            [name]: value
        };
        
        setServicoEditando(prev => ({ ...prev, itemServicoList: list }));
    };

    const handleAddItem = () => {
        setServicoEditando(prev => ({
            ...prev,
            itemServicoList: [...prev.itemServicoList, { ...ItemVazio }]
        }));
    };

    const handleRemoveItem = (index) => {
        if (servicoEditando.itemServicoList.length > 1) {
            const list = [...servicoEditando.itemServicoList];
            list.splice(index, 1);
            setServicoEditando(prev => ({ ...prev, itemServicoList: list }));
        }
    };
    
    // 4. Submissão do Formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Garante que o valor total está atualizado antes de enviar
            const dataToSend = { ...servicoEditando, valor_total: Number(valorTotalCalculado) };
            
            await saveServico(dataToSend);
            setServicoEditando(ServicoFormVazio);
            // Recarrega lista
            const data = await getServicos();
            setServicos(data);
        } catch (error) {
            alert('Erro ao salvar o serviço. Verifique a API.');
            console.error(error);
        }
    };
    
    // ... Implementação de handleEdit, handleDelete para a lista de serviços

    return (
        <div style={{ padding: '20px' }}>
            <h2>⚙️ Ordens de Serviço</h2>

            {/* FORMULÁRIO PRINCIPAL */}
            <form onSubmit={handleSubmit} style={{ border: '1px solid #007bff', padding: '15px', marginBottom: '30px' }}>
                <h4>{servicoEditando.id ? 'Editar Serviço' : 'Nova Ordem de Serviço'}</h4>

                {/* SELECTS DE RELACIONAMENTO */}
                <select 
                    name="cliente" 
                    value={servicoEditando.cliente.id || ''} 
                    onChange={(e) => setServicoEditando(prev => ({ ...prev, cliente: { id: e.target.value } }))}
                    required
                >
                    <option value="">Selecione o Cliente</option>
                    {clientes.map(c => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                </select>
                <select 
                    name="carro" 
                    value={servicoEditando.carro.id || ''} 
                    onChange={(e) => setServicoEditando(prev => ({ ...prev, carro: { id: e.target.value } }))}
                    required
                >
                    <option value="">Selecione o Carro</option>
                    {carros.map(carro => (<option key={carro.id} value={carro.id}>{carro.placa} - {carro.modelo}</option>))}
                </select>

                {/* DATAS */}
                <label>Entrada: <input type="date" value={servicoEditando.dataEntrada} disabled /></label>
                <label style={{ marginLeft: '10px' }}>Saída: <input type="date" value={servicoEditando.dataSaida} onChange={(e) => setServicoEditando(prev => ({ ...prev, dataSaida: e.target.value }))} /></label>

                <hr />

                {/* TABELA DINÂMICA DE ITENS DE SERVIÇO */}
                <h3>Itens de Serviço</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Descrição</th>
                            <th>Qtd</th>
                            <th>Valor Unitário</th>
                            <th>Subtotal</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicoEditando.itemServicoList.map((item, index) => (
                            <tr key={index}>
                                <td><input name="descricao" value={item.descricao} onChange={(e) => handleItemChange(index, e)} required /></td>
                                <td><input name="quantidade" type="number" value={item.quantidade} onChange={(e) => handleItemChange(index, e)} style={{ width: '60px' }} /></td>
                                <td><input name="valorUnitario" type="number" step="0.01" value={item.valorUnitario} onChange={(e) => handleItemChange(index, e)} style={{ width: '100px' }} /></td>
                                <td>{(item.quantidade * item.valorUnitario).toFixed(2)}</td>
                                <td>
                                    {servicoEditando.itemServicoList.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveItem(index)}>Remover</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="button" onClick={handleAddItem}>+ Adicionar Item</button>

                {/* VALOR TOTAL */}
                <h3 style={{ marginTop: '10px' }}>VALOR TOTAL: R$ {valorTotalCalculado}</h3>
                
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none' }}>
                    Salvar Ordem ({servicoEditando.id ? 'ID ' + servicoEditando.id : 'Nova'})
                </button>
            </form>

            {/* LISTA DE SERVIÇOS (A implementar a listagem completa) */}
            <h3>Listagem de Ordens de Serviço</h3>
            {/* ... Implementação da listagem e botões de Edit/Delete ... */}
            {servicos.length === 0 ? <p>Nenhuma ordem de serviço cadastrada.</p> : <p>Total de {servicos.length} ordens.</p>}
        </div>
    );
}

export default Servicos;