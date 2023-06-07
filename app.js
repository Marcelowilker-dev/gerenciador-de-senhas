const express = require('express');
const bodyParser = require('body-parser');
const client = require('./bd');
const cors = require('cors');
const port = 3000;
const app = express();
const indexRouter = require("./routes/index");
const usuarioRouter = require("./routes/usuario");
const senhasRouter = require("./routes/senhas");

app.use(cors())
app.use(bodyParser.json());
app.use(express.json());
app.use("/", indexRouter);
app.use("/usuario", usuarioRouter);
app.use("/senhas", senhasRouter);



app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;



