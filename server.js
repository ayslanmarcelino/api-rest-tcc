const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');

let db = null;
const url = 'mongodb://localhost:27017';
const dbName = 'RestAPIdb';
const door = 3000;

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(cors());
app.use(jsonParser);
app.use(urlencodedParser);

MongoClient.connect(url, {useNewUrlParser: true}, function(error, client) {
  if(error) console.log('erro de conexão:', error);
  else console.log('banco de dados conectado com sucesso.');

  db = client.db(dbName);
});

app.listen(door);
console.log(`servidor rodando em: localhost:${door}`);

function getCode() {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    const values = year+''+month+''+day+''+hours+''+minutes+''+seconds+''+milliseconds;
    const result = Number(parseFloat(Number(values)/2).toFixed(0));
    return result;
  }catch(error) {
    console.log({error: error});
    return 0;
  }
}

app.get('/', urlencodedParser, function(req, res) {
  try {
    res.send({response: 'Bem-vindo(a) a api REST TCC'});
  }catch(error) {
    console.log({error: error});
    res.send({error: error});
  }
});

app.get('/people', urlencodedParser, function(req, res) {
  try {
    res.send({response: 'Cadastro de Pessoas'});
  }catch(error) {
    console.log({error: error});
    res.send({error: error});
  }
});

app.post('/people/create', urlencodedParser, function(req, res) {
  try {
    let objJSON = {};
    if(req.body.code) objJSON.code = Number(req.body.code);
    else objJSON.code = getCode();

    if(req.body.name) objJSON.name = req.body.name.toString().trim();
    else objJSON.name = 'Anônimo';

    if(req.body.age) objJSON.age = Number(req.body.age);
    else objJSON.age = 18;

    if(req.body.email) objJSON.email = req.body.email.toString().trim();
    else objJSON.email = '';

    if(req.body.cpf) objJSON.cpf = req.body.cpf.toString().trim();
    else objJSON.cpf = '';

    if(req.body.rg) objJSON.rg = req.body.rg.toString().trim();
    else objJSON.rg = '';

    if(req.body.nickname) objJSON.nickname = req.body.nickname.toString().trim();
    else objJSON.nickname = '';

    if(req.body.cellphone) objJSON.cellphone = req.body.cellphone.toString().trim();
    else objJSON.cellphone = '';

    if(req.body.gender) objJSON.gender = req.body.gender.toString().trim();
    else objJSON.gender = '';

    insertPerson(objJSON, function(result) {
      res.send(result);
    });
  }catch(error) {
    console.log({error: error});
    res.send({error: error});
  }
});

const insertPerson = function(objJSON, callback) {
  try {
    const collection = db.collection('people');
    collection.insertOne(objJSON, function(error, result) {
      if(error) callback(error);
      else callback(result);
    });
  }catch(error) {
    console.log({error: error});
  }
}

app.get('/people/find/:code', urlencodedParser, function(req, res) {
  try {
    let code = 0;
    if(req.params.code) code = Number(req.params.code);

    let objJSON = {
      code: code
    }

    findPersonOne(objJSON, function(result) {
      res.send(result);
    });
  }catch(error) {
    console.log({error: error});
    res.send({error: error});
  }	
});

const findPersonOne = function(objJSON, callback) {
  try {
    const collection = db.collection('people');
    collection.findOne(objJSON, function(error, result) {
      if(error) callback(error);
      else callback(result);
    });
  }catch(error) {
    console.log({error: error});
  }
}

app.get('/people/find', urlencodedParser, function(req, res) {
  try {
    let objJSON = {};
    if(req.query.code) objJSON.code = Number(req.query.code);
    if(req.query.name) objJSON.name = req.query.name.toString().trim();
    if(req.query.age) objJSON.age = Number(req.query.age);
    if(req.query.email) objJSON.email = req.query.email.toString().trim();
    if(req.query.cpf) objJSON.cpf = Number(req.query.cpf);
    if(req.query.rg) objJSON.rg = Number(req.query.rg);
    if(req.query.nickname) objJSON.nickname = req.query.nickname.toString().trim();
    if(req.query.cellphone) objJSON.cellphone = req.query.cellphone.toString().trim();
    if(req.query.gender) objJSON.gender = req.query.gender.toString().trim();
    findPerson(objJSON, function(result) {
      res.send(result);
    });
  }catch(error) {
    console.log({error: error});
    res.send({error: error});
  }
});

const findPerson = function(objJSON, callback) {
  try {
    const collection = db.collection('people');
    collection.find(objJSON).toArray(function(error, result) {
      if(error) callback(error);
      else callback(result);
    });
  }catch(error) {
    console.log({error: error});
  }
}

app.put('/people/edit/:code', urlencodedParser, function(req, res) {
  try {
    let code = 0;
    if(req.params.code) code = Number(req.params.code);

    let objJSON = {};
    if(req.body.code) objJSON.code = Number(req.body.code);
    if(req.body.name) objJSON.name = req.body.name.toString().trim();
    if(req.body.age) objJSON.age = Number(req.body.age);
    if(req.body.email) objJSON.email = req.body.email.toString().trim();
    if(req.body.cpf) objJSON.cpf = Number(req.body.cpf);
    if(req.body.rg) objJSON.rg = Number(req.body.rg);
    if(req.body.nickname) objJSON.nickname = req.body.nickname.toString().trim();
    if(req.body.cellphone) objJSON.cellphone = req.body.cellphone.toString().trim();

    updatePerson(objJSON, code, function(result) {
      res.send(result);
    });
  }catch(error) {
    console.log({error: error});
    res.send({error: error});
  }
});

const updatePerson = function(objJSON, code, callback) {
  try {
    const collection = db.collection('people');
    collection.updateOne({code: code}, {$set: objJSON}, function(error, result) {
      if(error) callback(error);
      else callback(result);
    });
  }catch(error) {
    console.log({error: error});
  }
}

app.delete('/people/delete/:code', urlencodedParser, function(req, res) {
  try {
    let code = 0;
    if(req.params.code) code = Number(req.params.code);

    let objJSON = {
      code: code
    }

    deletePerson(objJSON, function(result) {
      res.send(result);
    });
  }catch(error) {
    console.log({error: error});
    res.send({error: error});
  }	
});

const deletePerson = function(objJSON, callback) {
  try {
    const collection = db.collection('people');
    collection.deleteOne(objJSON, function(error, result) {
      if(error) callback(error);
      else callback(result);
    });
  }catch(error) {
    console.log({error: error});
  }
}
