import mongoose from 'mongoose';
import Role from '../models/Role.js';
import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const roles = [
    {
        name: 'GERENCIA',
        description: 'Acceso completo al sistema',
        permissions: [
            'VIEW_DASHBOARD',
            'EXPLORADOR_DE_PROSPECTOS',
            'OBTENCION_DE_PROBABILIDAD',
            'INTERPRETACION_CUALITATIVA',
            'RECOMENDACION_ACCION_COMERCIAL',
            'JUSTIFICACION_RESULTADO',
            'SIMULACION_WHAT_IF',
            'MANAGE_USERS'
        ]
    },
    {
        name: 'EJECUTIVO',
        description: 'Acceso limitado',
        permissions: [
            'VIEW_DASHBOARD',
            'EXPLORADOR_DE_PROSPECTOS',
            'OBTENCION_DE_PROBABILIDAD'
        ]
    }
];

async function seedRoles() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');

        // 1. Crear roles
        await Role.deleteMany({});
        const insertedRoles = await Role.insertMany(roles);
        console.log('Roles creados exitosamente');

        // 2. Buscar rol de Gerencia
        const gerenciaRole = insertedRoles.find(r => r.name === 'GERENCIA');

        if (!gerenciaRole) {
            throw new Error('No se encontró el rol GERENCIA');
        }

        // 3. Crear usuario de Gerencia
        const hashedPassword = await bcrypt.hash('Admin123', 10);

        await Usuario.deleteMany({}); // opcional: limpiar usuarios

        await Usuario.create({
            nombre: 'Admin General',
            email: 'admin@admin.com',
            password: hashedPassword,
            role: gerenciaRole._id,
            activo: true
        });

        console.log('Usuario administrador creado: admin@admin.com / Admin123');
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

seedRoles();
