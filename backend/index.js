const express = require('express');
const cors = require('cors');
const usersRoutes = require('./routes/users');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', usersRoutes);

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
