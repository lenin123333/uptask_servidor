import express from 'express';
import {
    obtenerProyecto,
    nuevoProyecto,
    obtenerProyectos,
    eliminarColaborador,
    eliminarProyecto,
    agregarColaborador,
    editarProyecto,
    buscarColaborador
} from "../controller/proyectoController.js";
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/').get(checkAuth, obtenerProyectos)
    .post(checkAuth, nuevoProyecto);

router.route('/:id').get(checkAuth, obtenerProyecto)
    .put(checkAuth, editarProyecto)
    .delete(checkAuth, eliminarProyecto);

router.post('/colaboradores',checkAuth, buscarColaborador);    
router.post('/colaboradores/:id',checkAuth, agregarColaborador);    
router.post('/eliminar-colaborador/:id',checkAuth, eliminarColaborador);    


export default router


