import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupervisorPanel = () => {
    const [clientes, setClientes] = useState([]);
    const [newCliente, setNewCliente] = useState({
        dni: '',
        nombre: '',
        apellido1: '',
        apellido2: '',
        sexo: '',
        lugarNacimiento: {
            municipio: '',
            departamento: '',
            pais: '',
        },
        fechaNacimiento: '',
        padre: {
            nombre: '',
            apellido1: '',
            apellido2: '',
            nacionalidad: '',
        },
        madre: {
            nombre: '',
            apellido1: '',
            apellido2: '',
            nacionalidad: '',
        },
        hermanos: [],
    });
    const [numHermanos, setNumHermanos] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClientes = async () => {
            const res = await axios.get('/api/clientes');
            setClientes(res.data);
        };

        fetchClientes();
    }, []);

    const toUpperCase = (value) => {
        return value.toUpperCase();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "dni") {
            // Aquí aseguramos que el DNI se almacene sin formato
            setNewCliente({ ...newCliente, dni: value.replace(/\D/g, '') }); // elimina todo lo que no sea dígito
        } else if (name.startsWith('hermano')) {
            const index = parseInt(name.split('-')[2]); // Asegúrate de que este sea el índice correcto
            const field = e.target.dataset.field;

            // Asegúrate de que el array de hermanos tenga objetos para cada índice
            const newHermanos = [...newCliente.hermanos];
            if (!newHermanos[index]) {
                newHermanos[index] = {}; // Inicializa el objeto si no existe
            }
            newHermanos[index][field] = value; // Establece el campo correspondiente
            setNewCliente({ ...newCliente, hermanos: newHermanos });
        } else if (name.startsWith('lugarNacimiento')) {
            setNewCliente({ ...newCliente, lugarNacimiento: { ...newCliente.lugarNacimiento, [name.split('.')[1]]: toUpperCase(value) } });
        } else if (name.startsWith('padre')) {
            setNewCliente({ ...newCliente, padre: { ...newCliente.padre, [name.split('.')[1]]: toUpperCase(value) } });
        } else if (name.startsWith('madre')) {
            setNewCliente({ ...newCliente, madre: { ...newCliente.madre, [name.split('.')[1]]: toUpperCase(value) } });
        } else {
            const upperCaseValue = ['nombre', 'apellido1', 'apellido2', 'sexo', 'fechaNacimiento'].includes(name) ? toUpperCase(value) : value;
            setNewCliente({ ...newCliente, [name]: upperCaseValue });
        }
    };

    const handleHermanosChange = (e) => {
        const value = e.target.value;

        // Asegurarse de que el número de hermanos sea un número positivo
        if (!value || value < 0) {
            setError("El número de hermanos debe ser un número positivo.");
            setNumHermanos(0);
            setNewCliente(prev => ({ ...prev, hermanos: [] }));
            return;
        }

        setError('');
        const hermanosCount = parseInt(value);
        setNumHermanos(hermanosCount);

        const hermanosArray = new Array(hermanosCount).fill(null).map(() => ({}));
        setNewCliente(prev => ({ ...prev, hermanos: hermanosArray }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (numHermanos < 0) {
            setError("Por favor, especifique un número válido de hermanos.");
            return;
        }

        console.log("Cliente a enviar:", newCliente); // Para depuración

        // Aquí ya se incluye el DNI limpio sin separadores
        await axios.post('/api/clientes', newCliente);

        // Resetear formulario
        setNewCliente({
            dni: '',
            nombre: '',
            apellido1: '',
            apellido2: '',
            sexo: '',
            lugarNacimiento: {
                municipio: '',
                departamento: '',
                pais: '',
            },
            fechaNacimiento: '',
            padre: {
                nombre: '',
                apellido1: '',
                apellido2: '',
                nacionalidad: '',
            },
            madre: {
                nombre: '',
                apellido1: '',
                apellido2: '',
                nacionalidad: '',
            },
            hermanos: [],
        });
        setNumHermanos(0);

        const res = await axios.get('/api/clientes');
        setClientes(res.data);
    };

    return (
        <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Panel del Supervisor</h2>
            {error && <p className="text-red-600">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="dni"
                    placeholder="DNI"
                    value={newCliente.dni}
                    onChange={(e) => setNewCliente({ ...newCliente, dni: e.target.value.replace(/\D/g, '') })}
                    required
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={newCliente.nombre}
                    onChange={handleInputChange}
                    required
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <input
                    type="text"
                    name="apellido1"
                    placeholder="Apellido 1"
                    value={newCliente.apellido1}
                    onChange={handleInputChange}
                    required
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <input
                    type="text"
                    name="apellido2"
                    placeholder="Apellido 2"
                    value={newCliente.apellido2}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <input
                    type="text"
                    name="sexo"
                    placeholder="Sexo"
                    value={newCliente.sexo}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <input
                    type="date"
                    name="fechaNacimiento"
                    placeholder="Fecha de Nacimiento"
                    value={newCliente.fechaNacimiento}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <h3 className="text-lg font-semibold mb-2">Lugar de Nacimiento</h3>
                <input
                    type="text"
                    name="lugarNacimiento.municipio"
                    placeholder="Municipio"
                    value={newCliente.lugarNacimiento.municipio}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <input
                    type="text"
                    name="lugarNacimiento.departamento"
                    placeholder="Departamento"
                    value={newCliente.lugarNacimiento.departamento}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <input
                    type="text"
                    name="lugarNacimiento.pais"
                    placeholder="País"
                    value={newCliente.lugarNacimiento.pais}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <h3 className="text-lg font-semibold mb-2">Información del Padre</h3>
                <input
                    type="text"
                    name="padre.nombre"
                    placeholder="Nombre del Padre"
                    value={newCliente.padre.nombre}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <input
                    type="text"
                    name="padre.apellido1"
                    placeholder="Apellido 1 del Padre"
                    value={newCliente.padre.apellido1}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <input
                    type="text"
                    name="padre.apellido2"
                    placeholder="Apellido 2 del Padre"
                    value={newCliente.padre.apellido2}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <input
                    type="text"
                    name="padre.nacionalidad"
                    placeholder="Nacionalidad del Padre"
                    value={newCliente.padre.nacionalidad}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <h3 className="text-lg font-semibold mb-2">Información de la Madre</h3>
                <input
                    type="text"
                    name="madre.nombre"
                    placeholder="Nombre de la Madre"
                    value={newCliente.madre.nombre}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <input
                    type="text"
                    name="madre.apellido1"
                    placeholder="Apellido 1 de la Madre"
                    value={newCliente.madre.apellido1}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <input
                    type="text"
                    name="madre.apellido2"
                    placeholder="Apellido 2 de la Madre"
                    value={newCliente.madre.apellido2}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <input
                    type="text"
                    name="madre.nacionalidad"
                    placeholder="Nacionalidad de la Madre"
                    value={newCliente.madre.nacionalidad}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <label className="block mb-1">Cantidad de hermanos</label>
                <input
                    type="number"
                    placeholder="Ingrese la cantidad"
                    value={numHermanos > 0 ? numHermanos : ''}
                    onChange={handleHermanosChange}
                    min="0"
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                {numHermanos > 0 && (
                    Array.from({ length: numHermanos }).map((_, index) => (
                        <div key={index} className="mb-4">
                            <h4 className="text-lg font-semibold">Hermano {index + 1}</h4>
                            <input
                                type="text"
                                name={`hermano-nombre-${index}`}
                                data-field="nombre"
                                placeholder="Nombre"
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                name={`hermano-apellido1-${index}`}
                                data-field="apellido1"
                                placeholder="Apellido 1"
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                name={`hermano-apellido2-${index}`}
                                data-field="apellido2"
                                placeholder="Apellido 2"
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                name={`hermano-nacionalidad-${index}`}
                                data-field="nacionalidad"
                                placeholder="Nacionalidad"
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded p-2 mb-2 w-full"
                            />
                        </div>
                    ))
                )}
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                    Registrar Cliente
                </button>
            </form>
            <h3 className="text-lg font-semibold mt-4">Lista de Clientes</h3>
            <ul className="mt-2">
                {clientes.map(cliente => (
                    <li key={cliente.dni} className="border-b py-2">
                        {cliente.nombre} {cliente.apellido1}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SupervisorPanel;