// src/components/WelcomePage.jsx
import React from 'react';

const WelcomePage = () => {
    // Obtén la fecha actual
    const today = new Date().toLocaleDateString('es-HN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="max-w-md bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-4xl font-bold text-center mb-4">Bienvenido al Sistema de Gestión de Créditos</h1>
                <p className="text-lg text-gray-700 text-center mb-6">
                    Aquí podrás gestionar todas tus solicitudes de crédito.
                </p>
                <div className="text-center">
                    <p className="font-semibold">Asignatura: Sistemas de Información Gerencial</p>
                    <p className="font-semibold">Grupo: No. 4</p>
                    <p className="font-semibold">Universidad Tecnológica de Honduras</p>
                    <p className="font-semibold">Fecha: {today}</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;