import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokenPath = path.join(__dirname, 'token.json');

// Función para guardar el token en un archivo
export const guardarToken = (token) => {
    fs.writeFileSync(tokenPath, JSON.stringify({ token }), 'utf-8');
};

// Función para cargar el token desde el archivo
export const cargarToken = () => {
    if (fs.existsSync(tokenPath)) {
        const data = fs.readFileSync(tokenPath, 'utf-8');
        return JSON.parse(data).token;
    }
    return null;
};
