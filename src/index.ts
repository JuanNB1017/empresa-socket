import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import axios from 'axios';
import { guardarToken, cargarToken } from './saveToken';

const App = express();
const server = createServer(App);
const io = new Server(server, { cors: { origin: "*" } });

let empleadosActuales = [];
let tokenJWT = null;
let filtroActual = "all"; // Variable global para el filtro

server.listen(3000, async () => {
    console.log("🚀 Servidor inicializado en el puerto 3000");
    await obtenerToken(); // Obtener token JWT al iniciar el servidor
    obtenerColaboradores(); // Primera consulta con el filtro inicial
});

// Escuchar conexiones de clientes
io.on("connection", (socket) => {
    console.log("🔗 Nueva conexión:", socket.id);

    // Enviar datos actuales al nuevo cliente
    if (empleadosActuales.length > 0) {
        socket.emit("actualizarColaboradores", empleadosActuales);
    }

    // Escuchar cambios de filtro desde Angular
    socket.on("filtrarColaboradores", async (nuevoFiltro) => {
        console.log(`⚡️ Filtro recibido desde Angular: ${nuevoFiltro}`);
        filtroActual = nuevoFiltro; // Guardamos el nuevo filtro globalmente
        await obtenerColaboradores(); // Llamar a la API con el filtro actualizado
    });
});

const registrarSocket = async () => {
    try {
        const respuesta = await axios.post("http://127.0.0.1:8000/api/auth/register", {
            name: "socket.io",
            email: "socket@io.com",
            password: "123456"
        });

        if (respuesta.data.code === 201) {
            console.log("🟢 Usuario socket.io registrado con éxito");
            return true;
        }
    } catch (error) {
        if (error.response?.data?.message?.includes("El email ya ha sido tomado")) {
            console.log("⚠️ Usuario socket.io ya existe, procediendo con login...");
            return true;
        }
        console.error("❌ Error al registrar usuario socket.io:", error.response?.data || error.message);
    }
    return false;
};

const obtenerToken = async () => {
    tokenJWT = cargarToken();

    if (tokenJWT) {
        console.log("🔑 Token JWT cargado desde archivo.");
        return;
    }

    try {
        const registroExitoso = await registrarSocket();
        if (!registroExitoso) return;

        const respuesta = await axios.post("http://127.0.0.1:8000/api/auth/login", {
            email: "socket@io.com",
            password: "123456"
        });

        tokenJWT = respuesta.data.access_token;
        guardarToken(tokenJWT);
        console.log("🔐 Token JWT obtenido y guardado.");
    } catch (error) {
        console.error("❌ Error al obtener token JWT:", error.response?.data || error.message);
    }
};

const obtenerColaboradores = async () => {
    console.log(`🔍 Obteniendo colaboradores con filtro: ${filtroActual}`);

    if (!tokenJWT) {
        console.log("❌ No se ha obtenido un token JWT, intentando de nuevo...");
        await obtenerToken();
        return;
    }

    try {
        let url = "http://127.0.0.1:8000/api/colaborator";
        let response;

        if (filtroActual === "all") {
            response = await axios.get(url, {
                headers: { Authorization: `Bearer ${tokenJWT}` }
            });
        } else {
            response = await axios.post(url + `/status?status=${filtroActual}`, {}, {
                headers: { Authorization: `Bearer ${tokenJWT}` }
            });
        }

        const nuevosColaboradores = response.data;

        if (JSON.stringify(nuevosColaboradores) !== JSON.stringify(empleadosActuales)) {
            empleadosActuales = nuevosColaboradores;
            io.emit("actualizarColaboradores", empleadosActuales);
            console.log("✅ Colaboradores actualizados y enviados a los clientes.");
        }
    } catch (error) {
        console.error("❌ Error al obtener colaboradores:", error.response?.data || error.message);
    }
};

// Consultar Laravel cada 5 segundos con el último filtro guardado
setInterval(() => obtenerColaboradores(), 1000);
