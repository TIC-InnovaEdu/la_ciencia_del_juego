const express = require('express')

const controller = require('./controller')
const response = require('../../network/response')

const routes = express.Router()

routes.post('/', function(req, res) {
    controller.insertar_profesor( req.body )
        .then( (data) => response.success(req, res, data, 201) )
        .catch( (error) => response.error(req, res, error, 400) )
})

routes.post('/login', (req, res) => {
    controller.iniciar_sesion_prof(req.body)
        .then(data => response.success(req, res, data, 200))
        .catch(error => response.error(req, res, error, 401));
});

module.exports = routes