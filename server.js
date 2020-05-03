const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

let db = null;
const url = 'mongodb://localhost:27017';
const dbName = 'RestAPIdb';
const door = 3000;

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(jsonParser);
app.use(urlencodedParser);

MongoClient.connect(url, {useNewUrlParser: true}, function(error, client) {
	if(error) console.log('ERRO de conexão:', error);
	else console.log('banco de dados conectado com sucesso.');

	db = client.db(dbName);
});

app.listen(door);
console.log(`servidor rodando em: localhost:${door}`);
