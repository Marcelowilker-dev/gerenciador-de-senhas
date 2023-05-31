const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://wcmeftkq:q7x4gEGTFdkJ_Dzen4iMyog3ujDk112S@silly.db.elephantsql.com/wcmeftkq',
  ssl: true
});




client.connect();

client.query(`
CREATE TABLE IF NOT EXISTS usuario (
  id SERIAL   PRIMARY KEY,
  email VARCHAR(30) NOT NULL ,
  senha VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS senhas (
  id SERIAL  PRIMARY KEY,
  senha VARCHAR(30) NOT NULL,
  descricao VARCHAR(100) NOT NULL,
  usuario_id INTEGER REFERENCES usuario(id)
);
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela usuario:', err);
  } else {
    console.log('Tabela usuario criada com sucesso');
  }
});

module.exports = client;

