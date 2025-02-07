# Proyecto Express + Socket.IO + Axios

Este proyecto es un servidor Express que se comunica con un backend Laravel para autenticar usuarios y obtener colaboradores en tiempo real mediante Socket.IO.

## Requisitos Previos

Antes de iniciar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (versión 16 o superior recomendada)
- [npm](https://www.npmjs.com/) (viene con Node.js)
- Un backend en Laravel corriendo en `http://127.0.0.1:8000`

## Instalación

1. Clona este repositorio:
   ```sh
   git clone https://github.com/tu_usuario/tu_repositorio.git
   cd tu_repositorio
   ```

2. Instala las dependencias necesarias:
   ```sh
   npm install
   ```

## Configuración

El servidor obtiene un token JWT al iniciar. Asegúrate de que el backend Laravel tenga configurado correctamente el sistema de autenticación y las siguientes rutas disponibles:

- `POST /api/auth/register` (para registrar el usuario `socket.io`)
- `POST /api/auth/login` (para obtener el token JWT)
- `GET /api/colaborator` (para obtener la lista de colaboradores sin filtro)
- `POST /api/colaborator/status?status=activo` (para obtener colaboradores con estado filtrado)

Si las rutas son diferentes, actualízalas en el código fuente.

## Uso

Para ejecutar el servidor, usa el siguiente comando:

```sh
npm start
```

Esto iniciará el servidor en el puerto 3000.

## Funcionamiento

1. Al iniciar, el servidor obtiene un token JWT desde el backend Laravel.
2. Luego, consulta la lista de colaboradores con el filtro predeterminado (`all`).
3. Los clientes pueden conectarse vía WebSockets para recibir actualizaciones en tiempo real.
4. Si un cliente envía un nuevo filtro, el servidor actualiza la lista y la retransmite a todos los clientes.
5. Se realiza una consulta automática al backend Laravel cada segundo para obtener nuevos colaboradores.

## Tecnologías Utilizadas

- Express.js
- Socket.IO
- Axios
- Node.js

## Notas

Si el backend Laravel no está corriendo, el servidor mostrará errores al intentar autenticarse o recuperar colaboradores.

Para cambiar la configuración de los tiempos de consulta, edita el valor en la función `setInterval(() => obtenerColaboradores(), 1000);` en el código fuente.

## Autor


## 🐝 notas

En caso de quere inicializar el proyecto con los demas sistemas , primero comienza inicializando el sistema de backend, despues el sistema web y por ultimo el sistema de nodejs con el socket.io.
