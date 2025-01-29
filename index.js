const express = require("express");
const database = require("./services/database");
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml'); 


const app = express();


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.get('/', (req, res) => {
    res.redirect('http://localhost:3000/api-docs');
  });
  
app.use(require('./routes/categoryRoute'));
app.use(require('./routes/productRoute'));
app.use(require('./routes/authRoute'));

app.listen(3000, () => console.log("server started on port 3000..."));
