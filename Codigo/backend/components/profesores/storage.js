const model = require('./model');

async function insertar_profesor(dato) {
    const resultado = await new model(dato)
    return resultado.save()
}

async function buscarPorEmail(email) {
    return await model.findOne({ email });
}


module.exports = {
    insertar:insertar_profesor,
    buscarEmail: buscarPorEmail
}