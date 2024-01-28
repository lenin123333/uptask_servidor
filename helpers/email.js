import nodemailer from 'nodemailer';

export const emailRegistro=async (datos)=>{

    const{nombre,email,token} = datos;
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST ,
        port: process.env.EMAIL_PORT,
        auth: {
          user:process.env.EMAIL_USER ,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    
    //Informacion del Email
      const info = await transport.sendMail({
            from: '"UpTask - Adminsitrador de Poryectos" <cuentas@uptask.com>',
            to:email,
            subject:"UpTask - Comprueba tu cuenta",
            text: "Comprueba tu cuenta en UpTask",
            html:` <p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
            <p>Tu cuenta ya esta casi lista, solo debes comprobar en el siguiente enlace: </p>
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a> 

            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
            
            `
      })
}

export const emailOlvidePasssword=async (datos)=>{

  const{nombre,email,token} = datos;
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST ,
      port: process.env.EMAIL_PORT,
      auth: {
        user:process.env.EMAIL_USER ,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  
  //Informacion del Email
    const info = await transport.sendMail({
          from: '"UpTask - Adminsitrador de Poryectos" <cuentas@uptask.com>',
          to:email,
          subject:"UpTask - Restablece tu Contraseña",
          text: "Restablece tu Contraseña",
          html:` <p>Hola: ${nombre} has solicitado restablecer tu contraseña</p>
          <p>Sigue el siguiente enlace para generar una nueva contraseña: </p>
          <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restableces Contraseña</a> 

          <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
          
          `
    })
}