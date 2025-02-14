const mongoose = require('mongoose')
const schema = mongoose.Schema

const req_string = {
    type: String,
    required: true
}

const req_email = {
    type: String,
    required: true,
    unique: true,
    trim: true, // Elimina espacios en blanco al inicio y al final
    lowercase: true // Convierte el email a minúsculas para evitar duplicados por mayúsculas/minúsculas
}

const profesor_schema = new schema({
    nombre: req_string,
    apellido: req_string,
    email: req_email,
    clave: req_string,
    fecha_registro: {
        type: Date,
        default: Date.now
    },
    fecha_actualizacion: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'fecha_registro', updatedAt: 'fecha_actualizacion' }
})

const model = mongoose.model('Profesor', profesor_schema)
module.exports = model