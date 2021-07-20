const { google } = require('googleapis');
const Readable = require('stream').Readable


const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);


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


const uploadFile = async (req, res = response) => {

    let myFile = req.file.originalname.split(".")
    const fileType = myFile[myFile.length - 1]

    const extensionesPermitidas = ['pdf', 'jpg', 'jpeg', 'png'];

    if (!extensionesPermitidas.includes(fileType)) {
        return res.status(404).json({
            ok: false,
            msg: `La extensión .${fileType} no está permitida.!`
        })
    }

    try {

        const response = await drive.files.create({
            requestBody: {
                name: `${myFile[0]}`,
                mimeType: `image/${fileType}`
            },
            media: {
                mimeType: `image/${fileType}`,
                body: bufferToStream(req.file.buffer)
            }
        })
        const result = generatePublicUrl(response.data.id)

        res.status(200).json({
            msg: 'Subido correctamente',
            url: (await result).webViewLink
        })

    } catch (error) {
        console.log(error);
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

        return result.data;

    } catch (error) {
        console.log(error.message);
    }
}




module.exports = {
    uploadFile
}