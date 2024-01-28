//habilitando los import y export en package json
import express from 'express';
import conectarDB from './config/db.js';
import dotenv from 'dotenv'
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';
import cors from 'cors'
const app = express();
app.use(express.json());

dotenv.config();

conectarDB();
//Configurar cors
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
    origin:function(origin,callback){
        if(whiteList.includes(origin)){
            //Puede consultar la api
            callback(null,true);
        }else{
            //No esta permitido su req
            callback(new Error("Error de Cors"));
        }
    }
}

app.use(cors(corsOptions))
//Routing

app.use("/api/usuarios",usuarioRoutes)
app.use("/api/proyectos",proyectoRoutes)
app.use("/api/tareas",tareaRoutes)
const PORT = process.env.PORT || 4000

const servidor = app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})

//Socl¿ket IO
import { Server, Socket} from 'socket.io'

const io=new Server(servidor, {
    pingTimeout:60000,
    cors:{
        origin: process.env.FRONTEND_URL
    }
})

io.on('connection',(socket) =>{
    console.log('Conectado a socket io');
    //definir los evento de socket io
    socket.on('abrir proyecto',(proyecto) =>{
        socket.join(proyecto)
    });

    socket.on('nueva tarea',(tarea) =>{
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit('tarea agregada',tarea)
    });
    socket.on('eliminar tarea',(tarea) =>{
        const proyecto = tarea.proyecto;
        
        socket.to(proyecto).emit('tarea eliminada',tarea)
    });
    { socket.on('actualizar tarea',(tarea) =>{
        const proyecto = tarea.proyecto._id;
        const valor=proyecto.value ? proyecto.value: proyecto;
        
        socket.to(valor).emit('tarea actualizada',tarea)
    });}
    { socket.on('cambiar estado',(tarea) =>{
        const proyecto = tarea.proyecto._id;
        const valor=proyecto.value ? proyecto.value: proyecto;
        
        socket.to(valor).emit('nuevo estado',tarea)
    });}
})