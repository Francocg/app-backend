const { Pool } = require('pg');
const { database } = require('../database/connect');
const nodemailer = require('nodemailer');
const pool = new Pool(database);

 

const enviarCorreo = async(req, res) => {
    const{ destinatario,titulo,mensaje,fecha,idusuario} = req.body;
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'asanchez5019.asan@gmail.com',
            pass: 'Compu3612'
        }
    });
    
    let mailOptions = {

        from: 'asanchez5019.asan@gmail.com',
        to: destinatario,
        subject: titulo,
        text: mensaje
    };
    
    transporter.sendMail(mailOptions, async(error, info) => {
        if (error) {
            
            return console.log(error.message);
        }
        await pool.query('INSERT INTO correo (destinatario,titulo,mensaje,fecha,idusuario) values($1,$2,$3,$4,$5)',
        [destinatario,titulo,mensaje,fecha,idusuario])
     return res.status(200).json('correo enviado correctamente...!');
     
    });
};
module.exports = {
   
    enviarCorreo
};

