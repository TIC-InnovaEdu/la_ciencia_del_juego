document.getElementById('show-register').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('register-container').classList.remove('hidden');
});

document.getElementById('show-login').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('register-container').classList.add('hidden');
    document.getElementById('login-container').classList.remove('hidden');
});

document.getElementById('register-form').addEventListener('submit', function(event){
    event.preventDefault();

    const nombre = document.getElementById('register-name').value;
    const apellido = document.getElementById('register-lastname').value;
    const email = document.getElementById('register-email').value;
    const clave = document.getElementById('register-password').value;

    fetch('/profesores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, email, clave})
        })
        .then(response => response.json())
        .then(data => mostrarResultado('Ingreso satisfactorio',data))
        .catch(error => console.error('Error:', error));
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const email = document.getElementById('login-email').value;
    const clave = document.getElementById('login-password').value;
  
    // Enviar la solicitud al backend
    fetch('/profesores/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, clave })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en las credenciales. Verifica tu email o contraseña.');
        }
        return response.json();
    })
    .then(data => {
        alert('Inicio de sesión exitoso.');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al iniciar sesión: ' + error.message);
    });
    
  });