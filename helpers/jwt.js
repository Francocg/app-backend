const jwt = require('jsonwebtoken');
const generarJWT = (id_usuario, username) =>{
    return new Promise( ( resolve, reject)=>{
        const payload={
            id_usuario,
            username
        }
        jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn: '72h'
        }, (err, token)=>{
            if(err) {
                console.log(error);
                reject('No se puedo generar el token');
            }else{
                resolve(token);
            }
        
        });
    })
}
const validarJWT = (req, res, next) =>{

    // Leer el Token 
    const token = req.header('token');

    // console.log(token);

    if(!token){
        return res.status(401).json({
            
            msg: 'No hay token en la peticion'
        })
    }

    try{
        
        const result = jwt.verify(token, process.env.JWT_SECRET);

        req.id_usuario = result.id_usuario;

        next();

    }catch(error){
        return res.status(401).json({
            
            msg: 'Token Incorrecto..'
        })
    }
}

module.exports = {
    generarJWT,
    validarJWT
}