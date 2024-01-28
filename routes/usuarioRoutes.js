import express from 'express';
import {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
} from '../controller/usuariosController.js';
import checkAuth from '../middleware/checkAuth.js';
const router = express.Router();


//Rutas Usuarios,Autenticacion,Creacion, Registro y Confirmacion de Usuarios

router.post('/', registrar)//Crea un usuario nuevo
router.post('/login', autenticar)//Crea un usuario nuevo
router.get('/confirmar/:token', confirmar)//Crea un usuario nuevo
router.post('/olvide-password', olvidePassword)//Olvide mis password
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)

router.get('/perfil',checkAuth,perfil);

export default router