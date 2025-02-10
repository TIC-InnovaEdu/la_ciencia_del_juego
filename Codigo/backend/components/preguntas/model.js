// preguntas/model.js
const mongoose = require('mongoose');

// Definir el esquema para las preguntas
const questionSchema = new mongoose.Schema({
    question: { 
        type: String, 
        required: true 
    },
    options: { 
        type: [{
            option: { 
                type: String, 
                required: true, 
                enum: ['A', 'B', 'C', 'D'] // Solo permite las opciones A, B, C
            },
            text: { 
                type: String, 
                required: true 
            }
        }], 
        validate: {
            validator: function(options) {
                return options.length === 4; // Valida que siempre haya 3 opciones
            },
            message: 'La pregunta debe tener exactamente 3 opciones'
        },
        required: true
    },
    answer: { 
        type: String, 
        required: true, 
        enum: ['A', 'B', 'C', 'D'], // La respuesta correcta debe ser A, B o C
        validate: {
            validator: function(value) {
                return this.options.some(option => option.option === value); // Verifica que la respuesta exista en las opciones
            },
            message: 'La respuesta debe coincidir con una de las opciones proporcionadas'
        }
    }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
