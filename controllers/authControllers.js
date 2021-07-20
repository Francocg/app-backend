const {response} = require("express");
const { Pool } = require('pg');
const { database } = require('../database/connect');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const pool = new Pool(database);

const login = async(req, res = response)=>{
    const { username, password } = req.body;
    try {
        const data_usuario = await pool.query(`SELECT usuario.idusuario, usuario,username, usuario.password, persona.nombres, persona.apellidos, persona.telefono FROM usuario, persona WHERE usuario.idpersona = persona.idpersona AND  usuario.username=$1`,[username])
        if(data_usuario.rows.length===0){
            return res.status(400).json({
                msg:'Usuario Incorrecto'
            })
        }
        const validarPasword = bcrypt.compareSync(password,data_usuario.rows[0].password);
        if(!validarPasword){
            return res.status(400).json({
                msg: 'Contraseña Incorrecta'
            });
        }
        const token = await generarJWT(data_usuario.rows[0].idusuario, data_usuario.rows[0].username, data_usuario.rows[0].nombres, data_usuario.rows[0].apellidos, data_usuario.rows[0].telefono);
        res.status(200).json({
            msg: 'Bienvenod a la app',
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Algo salio mal',
            error
        })
    }
}

const createUser = async(req, res = response) => {
    const { username, password, idpersona } = req.body;
    try {
        const data_usuarios = await pool.query(`SELECT * FROM usuario WHERE username=$1`, [username])
        
        if(data_usuarios.rows.length>0){
            return res.status(400).json({
                msg: 'El Usuario ya existe.!'
            })
        }
        // Encriptar contrasena
        const salt = bcrypt.genSaltSync();
        const password_encrypt = bcrypt.hashSync(password, salt);
        await pool.query(`INSERT INTO usuario(username, password, estado, idpersona) values($1, $2, 1, $3)`,
        [username, password_encrypt, idpersona])
        return res.status(200).json({
            msg: 'Usuario creado correctamente.!'
        })
    } catch (error) {
        res.status(500).json({  
            msg: 'Algo salio mal.!'
        })
    }
}
const getUsuarios = async(req, res = response) => {
    try {      
        const data_usuario = await pool.query(`select * from usuario`)
        if(data_usuario.rows.length===0){
            return res.status(400).json({
                msg: 'No hay usuarios!'
            })
        }
        
        res.status(200).json({
            usuarios: data_usuario.rows
        })
    } catch (error) {
        return res.status(500).json({
            
            msg: 'Algo salio mal'
        })
    }
}


const validarToken = async(req, res = response ) => {

    const id_usuario = req.id_usuario;

    // Generar el Token - JEWT
    const token = await generarJWT(id_usuario);

    // Obtener el Usuario por id
    const respuesta = await pool.query(`SELECT persona.nombres, persona.apellidos, persona.telefono, usuario.username, usuario.foto, usuario.idusuario FROM usuario, persona WHERE usuario.idpersona = persona.idpersona AND idusuario=$1`, [id_usuario])

    const data_usuario = respuesta.rows[0]


    res.json({
        ok: true,
        id_usuario,
        token,
        data_usuario,
    })

}







module.exports = {
    login,
    createUser,
    getUsuarios,
    validarToken
}