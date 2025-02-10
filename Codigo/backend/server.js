const express = require('express')
const body_parser = require('body-parser');
const cors = require('cors');
const path = require('path');
const config = require('./config')
const routes = require('./network/routes')
const db = require('./db')

var app = express()

app.use(cors());

db( config.DB_URL )

app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    next();
});

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "style-src 'self' 'unsafe-inline' https://maxcdn.bootstrapcdn.com https://fonts.googleapis.com;");
    next();
  }); 

app.use( body_parser.json() )
app.use( body_parser.urlencoded({extended:false}) )

// Servir archivos estáticos del frontend 
app.use(express.static(path.join(__dirname,'..', 'frontend')));

// Your routes here
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'frontend', 'index.html'));
});

app.get('/page_prof', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'frontend', 'page_prof.html'));
});

app.get('/juego', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'frontend', 'juego.html'));
});

app.get('/preguntas', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'frontend', 'preguntas.html'));
});

routes(app);

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal en el servidor');
});

app.listen( config.PORT )
console.log(`La aplicacion se encuentra arriba en http://localhost:${config.PORT}`)