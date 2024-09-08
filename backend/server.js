// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Cadena de conexión sin autenticación
mongoose.connect('mongodb://localhost:27017/gestorCreditos')
    .then(() => {
        console.log('Conexión a MongoDB exitosa');
    })
    .catch(err => {
        console.error('Error de conexión a MongoDB:', err);
    });

// Ejemplo de modelo de Cliente
const ClienteSchema = new mongoose.Schema({
    dni: String,
    nombre: String,
    apellido1: String,
    apellido2: String,
    sexo: String,
    lugarNacimiento: {
        municipio: String,
        departamento: String,
        pais: String,
    },
    fechaNacimiento: Date,
    padre: {
        nombre: String,
        apellido1: String,
        apellido2: String,
        nacionalidad: String,
    },
    madre: {
        nombre: String,
        apellido1: String,
        apellido2: String,
        nacionalidad: String,
    },
    hermanos: [
        {
            nombre: String,
            apellido1: String,
            apellido2: String,
            nacionalidad: String,
        },
    ],
});

const Cliente = mongoose.model('Cliente', ClienteSchema);

// Rutas básicas
app.get('/api/clientes', async (req, res) => {
    const clientes = await Cliente.find();
    res.json(clientes);
});

// Endpoint de registro
app.post('/api/register', async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado' });
});

// Endpoint de inicio de sesión
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'secret_key', { expiresIn: '1h' });

    res.json({
        token,
        role: user.role // Asegúrate de que el rol también se está devolviendo
    });
});

// Filtrar los clientes según su DNI
app.get('/api/clientes/:dni', async (req, res) => {
    const cliente = await Cliente.findOne({ dni: req.params.dni });
    if (!cliente) return res.status(404).send('Cliente no encontrado');
    res.json(cliente);
});

// Crear un nuevo cliente
app.post('/api/clientes', async (req, res) => {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.status(201).json(cliente);
});

// Actualizar un cliente existente
app.put('/api/clientes/:dni', async (req, res) => {
    const cliente = await Cliente.findOneAndUpdate({ dni: req.params.dni }, req.body, { new: true });
    if (!cliente) return res.status(404).send('Cliente no encontrado');
    res.json(cliente);
});

// Eliminar un cliente
app.delete('/api/clientes/:dni', async (req, res) => {
    const cliente = await Cliente.findOneAndDelete({ dni: req.params.dni });
    if (!cliente) return res.status(404).send('Cliente no encontrado');
    res.json(cliente);
});

// Ruta para crear usuarios de prueba
app.post('/api/create-user', async (req, res) => {
    const { username, password, role } = req.body;

    // Verificación rápida
    if (!['supervisor', 'gestor'].includes(role)) {
        return res.status(400).json({ message: 'Rol inválido' });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'Usuario creado exitosamente' });
});

// Ruta para obtener todos los usuarios
app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});