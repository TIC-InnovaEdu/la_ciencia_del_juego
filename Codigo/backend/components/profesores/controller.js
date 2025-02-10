const storage = require('./storage');

function insertar_profesor( dato ) {
    return new Promise( async (resolve, reject) => {
        if (!dato.nombre || !dato.apellido || !dato.email || !dato.clave) {
            reject( 'Los datos se encuentran incompletos.' )
        } else {
            resolve( storage.insertar( dato ) )
        }

        try {
            // Verificar si el correo ya existe
            const existeProfesor = await storage.buscarEmail(dato.email);
            if (existeProfesor) {
                return reject('El correo ya está registrado');
            }
    
            // Insertar el nuevo profesor
            return await storage.insertar(dato);
        } catch (error) {
            console.error('Error al insertar profesor:', error.message);
            throw error;
        }
    } )
}

function iniciar_sesion_prof(dato) {
    return new Promise(async (resolve, reject) => {
        const { email, clave } = dato;

        if (!email || !clave) {
            return reject('El email y la clave son obligatorios.');
        }

        try {
            // Buscar al profesor por email
            const maestro_email = await storage.buscarEmail(email);
            if (!maestro_email) {
                return reject('Maestro no encontrado.');
            }

            if (maestro_email.clave !== clave) {
                return reject('Contraseña incorrecta.');
            }

            resolve({ message: 'Inicio de sesión exitoso.', maestro_email });
        } catch (error) {
            reject('Error al iniciar sesión.');
        }
    });
}

module.exports = {
    insertar_profesor,
    iniciar_sesion_prof
}

