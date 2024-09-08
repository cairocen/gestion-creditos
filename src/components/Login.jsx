import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate(); // hook para redirigir

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/login', credentials);
            // Almacenar el token en localStorage
            localStorage.setItem('token', res.data.token);
            // Almacenar el rol en localStorage
            localStorage.setItem('role', res.data.role);

            // Redirigir según el rol del usuario
            const role = res.data.role; // Asegúrate de que el backend está retornando el rol
            if (role === 'supervisor') {
                navigate('/supervisor');
            } else if (role === 'gestor') {
                navigate('/gestor');
            } else {
                navigate('/'); // Redirigir a la página de inicio si el rol no es válido
            }
        } catch (error) {
            console.error(error);
            // Manejar error de inicio de sesión: puedes mostrar un mensaje al usuario
        }
    };

    const handleInputChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Nombre de Usuario"
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;