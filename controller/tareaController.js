import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tareas.js"



const agregarTarea = async (req, res) => {
    const { proyecto } = req.body
    const existeProyecto = await Proyecto.findById(proyecto)
    
    if(!existeProyecto) {
        const error = new Error('El proyecto no existe')
        return res.status(404).json({ msg: error.message })
    }

    if(existeProyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('No tienes los permisos para añadir tarea')
        return res.status(403).json({ msg: error.message })
    }

    try {
        const tarea = new Tarea(req.body);
        const tareaAlmacenada= await tarea.save();
        
        //Almacenar id en el poryecto
        //Push porque s eagrega al arreglo y se van al final
        existeProyecto.tareas.push(tareaAlmacenada._id)
        await existeProyecto.save()
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error)
    }


}

const obtenerTarea = async (req, res) => {

    const {id}= req.params
    const tarea= await Tarea.findById(id).populate("proyecto")
    if(!tarea){
        const error = new Error('No se Encontro la tarea ')
        return res.status(404).json({ msg: error.message })
    }
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('No tienes los permisos ')
        return res.status(403).json({ msg: error.message })
    }

    res.json(tarea)
}
const actualizarTarea = async (req, res) => {
    const {id}= req.params
    const tarea= await Tarea.findById(id).populate("proyecto")
    if(!tarea){
        const error = new Error('No se Encontro la tarea ')
        return res.status(404).json({ msg: error.message })
    }
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('No tienes los permisos ')
        return res.status(403).json({ msg: error.message })
    }

    tarea.nombre= req.body.nombre || tarea.nombre
    tarea.descripcion= req.body.descripcion || tarea.descripcion
    tarea.prioridad= req.body.prioridad || tarea.prioridad
    tarea.fechaEntrega= req.body.fechaEntrega || tarea.fechaEntrega
    try {
        const tareaAlmacenada = await tarea.save()
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error)
    }

}

const eliminarTarea = async (req, res) => {
    const {id}= req.params
    const tarea= await Tarea.findById(id).populate("proyecto")
    if(!tarea){
        const error = new Error('No se Encontro la tarea ')
        return res.status(404).json({ msg: error.message })
    }
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('No tienes los permisos ')
        return res.status(403).json({ msg: error.message })
    }

    try {
        //Para eleminar la tarea de el proyecto
        const proyecto = await Proyecto.findById(tarea.proyecto)
        proyecto.tareas.pull(tarea._id)
        
       //Inican en paralelo y ya que terminan las dos retorna el mensaje
        await Promise.allSettled([
            await proyecto.save(),
            
        ])
        await tarea.deleteOne()
        res.json({ msg: 'La Tarea se ha Eliminado' })
    } catch (error) {
        console.log(error)
    }
}

const cambiarEstado = async (req, res) => {
    const {id}= req.params
    const tarea= await Tarea.findById(id).populate("proyecto")

    if(!tarea){
        const error = new Error('No se Encontro la tarea ')
        return res.status(404).json({ msg: error.message })
    }
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString() &&
    !tarea.proyecto.colaboradores.some((colaborador)=>colaborador._id.toString() === req.usuario._id.toString())){
        const error = new Error('No tienes los permisos ')
        return res.status(403).json({ msg: error.message })
    }

    tarea.estado=!tarea.estado
    tarea.completado = req.usuario._id;
    await tarea.save()
    const tareaAlmacenada= await Tarea.findById(id).populate("proyecto").populate('completado')
    res.json(tareaAlmacenada)


}



export {
    cambiarEstado,
    eliminarTarea,
    actualizarTarea,
    agregarTarea,
    obtenerTarea
}