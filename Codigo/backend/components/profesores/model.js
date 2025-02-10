const mongoose = require('mongoose')
const schema = mongoose.Schema

const req_string = {
    type: String,
    required: true
}

/*const req_date = {
    type: Date,
    required: true
}*/

const req_email = {
    type: String,
    required: true,
    unique: true
}

const profesor_schema = new schema({
    nombre: req_string,
    apellido: req_string,
    email: req_email,
    clave: req_string,
    fecha_registro: Date,
    fecha_actualizacion: Date
}, {
    timestamps: { createdAt: 'fecha_creacion', updatedAt: 'fecha_actualizacion' }
})

const model = mongoose.model('Profesor', profesor_schema)
module.exports = model