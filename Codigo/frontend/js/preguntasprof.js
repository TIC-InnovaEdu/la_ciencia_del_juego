cargarPreguntas();

function cargarPreguntas(){
    //console.log("FUNCIONA?")
    fetch('/preguntas')
    .then(response => response.json())
    .then(data => {
        //console.log("Respuesta del servidor:", data);
        const questionContainer = document.getElementById('question-list');
        questionContainer.innerHTML = '';
        data.forEach(pregunta => {

            //const questionContainer = document.getElementById('question-list');
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-item';
            questionDiv.innerHTML = `
        <h3>${pregunta.question}</h3>
        <ul>
            ${pregunta.options.map(opt =>
                `<li>${opt.option}. ${opt.text} ${opt.option === pregunta.answer ? '✓' : ''}</li>`
            ).join('')}
        </ul>
        <button class="delete-btn" onclick="eliminarPregunta('${pregunta._id}')">Eliminar</button>
    `;
        questionContainer.appendChild(questionDiv);
        });
    })
    .catch(error => mostrarError("Error en la solicitud:"));
}


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

    if (!preguntaT || !opA || !opB || !opC || !opD) {
        mostrarError('Por favor completa todos los campos');
        return;
    }

    if (!respuestaCorrecta) {
        mostrarError('Por favor debe seleccionar una respuesta correcta');
        return;
    }

    const pregunta = {
        question: preguntaT,
        options: [
            { option: "A", text: opA },
            { option: "B", text: opB },
            { option: "C", text: opC },
            { option: "D", text: opD }
        ],
        answer: respuestaCorrecta
    };

    fetch('/preguntas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pregunta)
    })
    .then(response => response.json())
    .then(data => {
        limpiarFormulario();
        //agregarPreguntaLista(data);
        cargarPreguntas();
        mostrarError('Pregunta creada con éxito');
    })
    .catch(error => mostrarError('Error al crear la pregunta'));
}


function eliminarPregunta(id) {
    if (confirm('¿Eliminar esta pregunta?')) {
        fetch(`/preguntas/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            document.getElementById('question-list').innerHTML = '';
            cargarPreguntas();
            mostrarError('Pregunta eliminada');
        })
        .catch(error => mostrarError('Error al eliminar'));
    }
}

function limpiarFormulario() {
    document.getElementById('question-form').reset();
}

function mostrarError(mensaje) {
    alert(mensaje);
}
