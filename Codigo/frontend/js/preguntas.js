
function cargarPreguntas(){
    /*fetch('http://localhost:3000/preguntas')
    .then(response => response.text())
    .then(text =>{
        console.log("Respuesta del servidor", text);
        return JSON.parse(text);
    })
    .then (response => response.json())
    .then(preguntas => {
        const questionContainer = document.getElementById('question-list');
        questionContainer.innerHTML = '';

        preguntas.forEach(pregunta =>{
            const questionDiv = document.createElement('li');
            questionDiv.className = 'question-item';
            questionDiv.innerHTML = `
                <h3>${pregunta.question}</h3>
                <ul class="options">
                    ${pregunta.options.map(opt =>
                        `<li>${opt.option}. ${opt.text} ${opt.option === pregunta.answer ? '✓' : ''}</li>`
                    ).join('')}
                </ul>
                <button class="delete-btn" onclick="eliminarPregunta('${pregunta._id}')">Eliminar</button>
            `;
                questionContainer.appendChild(questionDiv);
        });
    })*/
    fetch('http://localhost:3000/preguntas')
    .then(response => response.text())  // <-- Cambia a text() para ver la respuesta sin procesar
    .then(data => {
        console.log("Respuesta del servidor:", data);  // <-- Muestra la respuesta en la consola
        
        // Intenta convertir a JSON
        try {
            const preguntas = JSON.parse(data); 
            const questionContainer = document.getElementById('question-list');
            questionContainer.innerHTML = '';

            preguntas.forEach(pregunta => {
                const questionDiv = document.createElement('li');
                questionDiv.className = 'question-item';
                questionDiv.innerHTML = `
                    <h3>${pregunta.question}</h3>
                    <ul class="options">
                        ${pregunta.options.map(opt =>
                            `<li>${opt.option}. ${opt.text} ${opt.option === pregunta.answer ? '✓' : ''}</li>`
                        ).join('')}
                    </ul>
                    <button class="delete-btn" onclick="eliminarPregunta('${pregunta._id}')">Eliminar</button>
                `;
                questionContainer.appendChild(questionDiv);
            });
        } catch (error) {
            console.error("Error al parsear JSON:", error);
        }
    })
    .catch(error => console.error("Error en la solicitud:", error));
        
}

document.addEventListener("DOMContentLoaded", () => {
    cargarPreguntas();
});

function crearPreguntas(){
    const preguntaT = document.getElementById('question').value;
    const opA = document.getElementById('option1').value;
    const opB = document.getElementById('option2').value;
    const opC = document.getElementById('option3').value;
    const opD = document.getElementById('option4').value;

    let respuestaCorrecta = '';
    if (document.getElementById('correct1').checked) respuestaCorrecta = 'A';
    if (document.getElementById('correct2').checked) respuestaCorrecta = 'B';
    if (document.getElementById('correct3').checked) respuestaCorrecta = 'C';
    if (document.getElementById('correct4').checked) respuestaCorrecta = 'D';

    const pregunta = {
        question: preguntaT,
        options: [
            {
                option: "A",
                text: opA
            },
            {
                option: "B",
                text: opB
            },
            {
                option: "C",
                text: opC
            },
            {
                option: "D",
                text: opD
            }
        ],
        answer: respuestaCorrecta
    };

    if (!preguntaT || !opA || !opB || !opC || !opD) {
        mostrarError('Por favor completa todos los campos');
        return;
    }

    if (!respuestaCorrecta) {
        mostrarError('Por favor debe seleccionar una respuesta correcta');
        return;
    }

    fetch('http://localhost:3000/preguntas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pregunta)
    })
        .then(response => response.json())
        .then(data => {
            limpiarFormulario();
            cargarPreguntas();
            mostrarError('Pregunta creada con éxito');
        })
        .catch(error => mostrarError('Error al crear la pregunta'));
}

// Función auxiliar para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('question').value = '';
    document.getElementById('option1').value = '';
    document.getElementById('option2').value = '';
    document.getElementById('option3').value = '';
    document.getElementById('option4').value = '';
    document.getElementById('correct1').checked = false;
    document.getElementById('correct2').checked = false;
    document.getElementById('correct3').checked = false;
    document.getElementById('correct4').checked = false;
}
function eliminarPregunta(id) {
    if (confirm('¿Eliminar esta pregunta?')) {
        fetch(`/preguntas/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                cargarPreguntas();
                mostrarError('Pregunta eliminada');
            })
            .catch(error => mostrarError('Error al eliminar'));
    }
}

function limpiarFormulario() {
    document.getElementById('question').value = '';
    document.getElementById('option1').value = '';
    document.getElementById('option2').value = '';
    document.getElementById('option3').value = '';
    document.getElementById('option4').value = '';
    document.getElementById('correct1').checked = false;
    document.getElementById('correct2').checked = false;
    document.getElementById('correct3').checked = false;
    document.getElementById('correct4').checked = false;
}

function mostrarError(mensaje) {
    document.getElementById('error').textContent = mensaje;
    setTimeout(() => {
        document.getElementById('error').textContent = '';
    }, 3000);
}



