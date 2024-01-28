import { emailRegistro,emailOlvidePasssword } from "../helpers/email.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import Usuario from "../models/Usuario.js";



const registrar = async (req, res) => {
    //Eviar regitros duplicados
    const { email } = req.body;
    const existeUsuarios = await Usuario.findOne({ email });
    if (existeUsuarios) {
        const error = new Error('Usuario ya registrado')
        return res.status(400).json({ msg: error.message })
    }

    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        await usuario.save();
        //Enviar Email de confirmacion
        emailRegistro({
            nombre:usuario.nombre,
            email:usuario.email,
            token:usuario.token
        })
        res.json({msg:"Usuario Creado Correctamente, Revisa tu correo para activar tu cuenta"})
        
    } catch (error) {
        console.log(error);
    }



}

const autenticar = async (req, res) => {

    const { email, password } = req.body
    //comprobar si el usaurio existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        const error = new Error('Usuario no esta registrado')
        return res.status(400).json({ msg: error.message })
    }
    //comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error('Usuario no esta confirmado')
        return res.status(400).json({ msg: error.message })
    }
    //confirmar su contraseña
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    } else {
        const error = new Error('La contraseña es incorrecta')
        return res.status(400).json({ msg: error.message })
    }
}

const confirmar = async (req, res) => {
    const { token } = req.params
    const usuarioConfirmar = await Usuario.findOne({ token })
    if (!usuarioConfirmar) {
        const error = new Error('Token no valido')
        return res.status(400).json({ msg: error.message })
    }
    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = ''
        await usuarioConfirmar.save()
        res.json({ msg: 'Confirmado Correctamente' })
    } catch (error) {
        console.log(error)
    }

}

const olvidePassword = async (req, res) => {
    const { email } = req.body
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        const error = new Error('Usuario no esta registrado')
        return res.status(400).json({ msg: error.message })
    }
    if(!usuario.confirmado){
        const error = new Error('Usuario no esta confirmado')
        return res.status(400).json({ msg: error.message })
    }
    try {
        usuario.token = generarId();
        await usuario.save()
        //enviar email
        emailOlvidePasssword({
            nombre:usuario.nombre,
            email:usuario.email,
            token:usuario.token
        })
        res.json({ msg: 'Hemos enviado un email con las intrucciones ' })

    } catch (error) {
        console.log(error)
    }


}


const comprobarToken = async (req, res) => {
    const { token } = req.params
    const tokenValido = await Usuario.findOne({ token })
    if (tokenValido) {
        res.json({ msg: 'Token valido y el Usuario existe' })
    } else {
        const error = new Error('Token no valido')
        return res.status(400).json({ msg: error.message })
    }


}


const nuevoPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    const usuario = await Usuario.findOne({ token })
    if (usuario) {
        usuario.password = password
        usuario.token = ''
        try {
            await usuario.save()
            res.json({ msg: 'Contraseña modificada Correctamente' })
        } catch (error) {
            console.log(error)
        }
    } else {
        const error = new Error('Token no valido')
        return res.status(400).json({ msg: error.message })
    }


}

const perfil = async (req, res) => {
    const {usuario} = req
    res.json(usuario)
}


export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}