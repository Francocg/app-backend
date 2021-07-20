
const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();

app.use(cors());

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use( '/api/archivos', require('./routes/archivos') );

app.listen(process.env.PORT, () => {
    console.log(`Run server on port: ${process.env.PORT}`);
})

