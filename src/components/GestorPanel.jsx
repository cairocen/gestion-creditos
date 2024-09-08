import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GestorPanel = () => {
    const [dni, setDni] = useState('');
    const [clienteInfo, setClienteInfo] = useState(null);
    const [montoSolicitud, setMontoSolicitud] = useState('');
    const [plazoSolicitud, setPlazoSolicitud] = useState('');
    const navigate = useNavigate();

    const handleDniChange = async (e) => {
        const value = e.target.value;
        setDni(value);

        // Verifica si el DNI tiene una longitud de 13 caracteres
        if (value.length === 13) {
            try {
                const res = await axios.get(`http://localhost:5000/api/clientes/${value}`);
                setClienteInfo(res.data);
                // Reiniciar valores de la solicitud
                setMontoSolicitud('');
                setPlazoSolicitud('');
            } catch (error) {
                console.error("Error al obtener la información del cliente:", error);
                setClienteInfo(null);
                alert('Cliente no encontrado. Verifique el DNI e intente nuevamente.');
            }
        } else {
            setClienteInfo(null); // Resetea la info si el DNI no tiene el formato correcto
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Lógica para registrar la solicitud de crédito
        const solicitudData = {
            dniCliente: dni,
            nombreCliente: clienteInfo?.nombre,
            apellidoCliente: clienteInfo?.apellido1,
            montoSolicitud,
            plazoSolicitud,
            // Agrega más campos según sea necesario
        };

        try {
            await axios.post('/api/solicitudes', solicitudData); // Cambia la ruta según tu API
            alert('Solicitud de crédito registrada con éxito.');
            // Limpiar los campos
            setDni('');
            setClienteInfo(null);
            setMontoSolicitud('');
            setPlazoSolicitud('');
        } catch (error) {
            console.error("Error al registrar la solicitud de crédito:", error);
            alert('Error al registrar la solicitud. Intente nuevamente.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Panel del Gestor de Crédito</h2>
            <input
                type="text"
                value={dni}
                onChange={handleDniChange}
                placeholder="Ingrese el DNI"
                className="border border-gray-300 rounded p-2 mb-4 w-full"
            />
            {clienteInfo && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Información del Cliente</h3>
                    <p><strong>Nombre:</strong> {clienteInfo.nombre} {clienteInfo.apellido1} {clienteInfo.apellido2}</p>
                    <p><strong>Padre:</strong> {clienteInfo.padre.nombre} {clienteInfo.padre.apellido1}</p>
                    <p><strong>Madre:</strong> {clienteInfo.madre.nombre} {clienteInfo.madre.apellido1}</p>
                    <p><strong>Hermanos:</strong>
                        {clienteInfo.hermanos && clienteInfo.hermanos.length > 0 ? (
                            clienteInfo.hermanos.map((hermano, index) => (
                                <span key={index}>
                                    {hermano.nombre || 'Nombre no disponible'} {hermano.apellido1 || 'Apellido no disponible'}
                                    {index < clienteInfo.hermanos.length - 1 ? ', ' : ''}
                                </span>
                            ))
                        ) : (
                            'No hay hermanos registrados.'
                        )}
                    </p>
                </div>
            )}
            <form onSubmit={handleSubmit} className="mb-4">
                <label className="block mb-2">Monto del Crédito:</label>
                <input
                    type="number"
                    placeholder="Monto del crédito"
                    value={montoSolicitud}
                    onChange={(e) => setMontoSolicitud(e.target.value)}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                    required
                />
                <label className="block mb-2">Plazo (en meses):</label>
                <input
                    type="number"
                    placeholder="Plazo en meses"
                    value={plazoSolicitud}
                    onChange={(e) => setPlazoSolicitud(e.target.value)}
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                    required
                />
                {/* Agregar otros campos necesarios para la solicitud aquí */}

                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                    Realizar Solicitud de Crédito
                </button>
            </form>
            <button
                onClick={handleLogout}
                className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
                Cerrar Sesión
            </button>
        </div>
    );
};

export default GestorPanel;