import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SupervisorPanel from './components/SupervisorPanel';
import GestorPanel from './components/GestorPanel';
import Login from './components/Login';
import WelcomePage from './components/WelcomePage';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Navbar />
        <main className="flex-grow p-4 bg-gray-100">
          <Routes>
            <Route path="/supervisor" element={<SupervisorPanel />} />
            <Route path="/gestor" element={<GestorPanel />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<WelcomePage />} /> {/* Cambia 'exact' por el uso de 'element' */}
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
};

export default App;