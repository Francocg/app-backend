const { response } = require("express");
const { google } = require('googleapis');
const Readable = require('stream').Readable
const { Pool } = require('pg');
const { database } = require('../database/connect');

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

const pool = new Pool(database);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

function bufferToStream(buffer) {
    var stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

const subirArchivos = async (req, res = response) => {
    let myFile = req.file.originalname.split(".")
    const fileType = myFile[myFile.length - 1]
    const { idusuario } = req.params;
    const extensionesPermitidas = ['pdf', 'docx','jpg', 'jpeg', 'png'];
    if (!extensionesPermitidas.includes(fileType)) {
        return res.status(404).json({
            ok: false,
            msg: `La extensión .${fileType} no está permitida.!`
        })
    }
    try {
        if(fileType === "jpg" || fileType === "jpeg" || fileType === "png"){
            const response = await drive.files.create({
                requestBody: {
                    name: `${myFile[0]}`,
                    mimeType: `image/${fileType}`,
                },
                media: {
                    mimeType: `image/${fileType}`,
                    body: bufferToStream(req.file.buffer)
                }
            })
            const result = generatePublicUrl(response.data.id)
            const url = (await result).webViewLink;
            const insertar_archivo = await pool.query(`INSERT INTO archivos(nombre,tipo,url,idusuario) VALUES($1,$2,$3,$4)`, [myFile[0], fileType, url, idusuario])
            return res.status(200).json({
                ok: true,
                msg: 'Todo fue correctamente..',
                insertar_archivo
            })
        }
        if(fileType === "pdf"){
            const response = await drive.files.create({
                requestBody: {
                    name: `${myFile[0]}`,
                    mimeType: `application/${fileType}`,
                },
                media: {
                    mimeType: `application/${fileType}`,
                    body: bufferToStream(req.file.buffer)
                }
            })
            const result = generatePublicUrl(response.data.id)
            const url = (await result).webViewLink;
            const insertar_archivo = await pool.query(`INSERT INTO archivos(nombre,tipo,url,idusuario) VALUES($1,$2,$3,$4)`, [myFile[0], fileType, url, idusuario])
            return res.status(200).json({
                ok: true,
                msg: 'Todo fue correctamente..',
                insertar_archivo
            })
        }
        if(fileType === "docx"){
            const response = await drive.files.create({
                requestBody: {
                    name: `${myFile[0]}`,
                    mimeType: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
                },
                media: {
                    mimeType: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
                    body: bufferToStream(req.file.buffer)
                }
            })
            const result = generatePublicUrl(response.data.id)
            const url = (await result).webViewLink;
            const insertar_archivo = await pool.query(`INSERT INTO archivos(nombre,tipo,url,idusuario) VALUES($1,$2,$3,$4)`, [myFile[0], fileType, url, idusuario])
            return res.status(200).json({
                ok: true,
                msg: 'Todo fue correctamente..',
                insertar_archivo
            })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Algo salio mal',
            error
        })
    }
}


const getArchivos = async (req, res = response) => {

    const { idusuario } = req.params;
    try {
        if (!idusuario) {
            return res.status(401).json({
                ok: false,
                msg: 'No se envio el id del usuario..'
            })
        }
        const obtener_archivos = await pool.query(`SELECT u.username, ar.nombre, ar.tipo, ar.url, ar.idusuario, ar.idarchivo FROM usuario u, archivos ar WHERE u.idusuario = ar.idusuario AND ar.idusuario = $1 ORDER BY ar.idarchivo desc`, [idusuario])

        res.status(200).json({
            ok: true,
            archivos: obtener_archivos.rows
        })



    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Algo ocurrio mal..'
        })
    }
}


const deleteArchivo = async (req, res = response) => {
    const { idarchivo } = req.params;
    try {
        
        const eliminar_archivo = await pool.query(`DELETE FROM archivos WHERE idarchivo=$1`, [idarchivo])

        res.status(200).json({
            ok: true,
            archivos: eliminar_archivo.rows
        })



    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Algo ocurrio mal..'
        })
    }
}


const updateArchivo = async (req, res = response) => {
    let myFile = req.file.originalname.split(".")
    const fileType = myFile[myFile.length - 1]
    const { idarchivo } = req.params;
    const extensionesPermitidas = ['pdf', 'docx','jpg', 'jpeg', 'png'];
    if (!extensionesPermitidas.includes(fileType)) {
        return res.status(404).json({
            ok: false,
            msg: `La extensión .${fileType} no está permitida.!`
        })
    }
    try {
        if(fileType === "jpg" || fileType === "jpeg" || fileType === "png"){
            const response = await drive.files.create({
                requestBody: {
                    name: `${myFile[0]}`,
                    mimeType: `image/${fileType}`,
                },
                media: {
                    mimeType: `image/${fileType}`,
                    body: bufferToStream(req.file.buffer)
                }
            })
            const result = generatePublicUrl(response.data.id)
            const url = (await result).webViewLink;
            const update_archivo = await pool.query(`UPDATE archivos SET nombre=$1, tipo=$2, url=$3 WHERE idarchivo=$4`, [myFile[0], fileType, url, idarchivo])
            return res.status(200).json({
                ok: true,
                msg: 'Todo fue correctamente..',
                update_archivo
            })
        }
        if(fileType === "pdf"){
            const response = await drive.files.create({
                requestBody: {
                    name: `${myFile[0]}`,
                    mimeType: `application/${fileType}`,
                },
                media: {
                    mimeType: `application/${fileType}`,
                    body: bufferToStream(req.file.buffer)
                }
            })
            const result = generatePublicUrl(response.data.id)
            const url = (await result).webViewLink;
            const update_archivo = await pool.query(`UPDATE archivos SET nombre=$1, tipo=$2, url=$3 WHERE idarchivo=$4`, [myFile[0], fileType, url, idarchivo])
            return res.status(200).json({
                ok: true,
                msg: 'Todo fue correctamente..',
                update_archivo
            })
        }
        if(fileType === "docx"){
            const response = await drive.files.create({
                requestBody: {
                    name: `${myFile[0]}`,
                    mimeType: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
                },
                media: {
                    mimeType: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
                    body: bufferToStream(req.file.buffer)
                }
            })
            const result = generatePublicUrl(response.data.id)
            const url = (await result).webViewLink;
            const update_archivo = await pool.query(`UPDATE archivos SET nombre=$1, tipo=$2, url=$3 WHERE idarchivo=$4`, [myFile[0], fileType, url, idarchivo])
            return res.status(200).json({
                ok: true,
                msg: 'Todo fue correctamente..',
                update_archivo
            })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Algo salio mal',
            error
        })
    }
}



async function generatePublicUrl(id) {
    try {
        const fileId = id;
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink',
        });
        console.log(result.data);
        return result.data;

    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    subirArchivos,
    getArchivos,
    deleteArchivo,
    updateArchivo
}