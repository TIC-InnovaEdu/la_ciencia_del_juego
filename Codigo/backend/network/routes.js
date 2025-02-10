const preguntas = require('../components/preguntas/interface')
const profesores = require('../components/profesores/interface')


const routes = function( server ) {
    server.use('/preguntas', preguntas)
    server.use('/profesores', profesores)
    server.use('/profesores/login', profesores)
}

module.exports = routes