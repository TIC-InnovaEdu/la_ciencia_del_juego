const db = require('mongoose')

db.Promise = global.Promise

async function conectar( url ) {
    await db.connect( url, { dbname: 'La_Ciencia_Del_Juego' } )
    .then (() => console.log('[db] - conexion exitosa.') )
    .catch( (error) => console.error( `[db] - ${error}` ) )
}

module.exports = conectar