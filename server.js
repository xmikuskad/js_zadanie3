const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'mydb',
    user     : 'root',
    password : 'root'
});

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/data',(req,res)=>{
    connection.query('SELECT * FROM destinacie', function (error, results, fields) {
        if (error) throw error;
        console.log(JSON.stringify(results));
        res.json(results);
    });
});

app.get('/xd',(req,res)=>{
    console.log('HELLO');
    res.end();
});

app.listen(8080,()=>{
    console.log('listening');
    connection.connect();
});

console.log("YES I STARTED, HOW DO I WORK!?");