import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Elimina el token
        localStorage.removeItem('role'); // Si estás guardando el rol
        // Redirige al usuario al inicio de sesión
        navigate('/login');
    };

    const isAuthenticated = !!localStorage.getItem('token'); // Verifica si hay un token guardado

    return (
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-xl font-semibold">Sistema de Gestión de Créditos</h1>
                <div className="flex space-x-4">
                    <Link to="/" className="text-white hover:underline">Inicio</Link>
                    {!isAuthenticated ? (
                        <Link to="/login" className="text-white hover:underline">Iniciar Sesión</Link>
                    ) : (
                        <button onClick={handleLogout} className="text-white hover:underline">
                            Cerrar Sesión
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;