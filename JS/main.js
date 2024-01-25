"use strict"

//URL para llamar al backend
const url = 'https://railway-simuladorentrevistas-production.up.railway.app/';


function inicio() {
    //Comprobación de vinculación
    console.log("Js cargado correctamente");


    //Crear la interfaz usando el DOM
    document.getElementsByTagName("body")[0].innerHTML =
        "<div class='container'><div class='logoDiv'><img id='logo' src='https://nsxlover.github.io/pruebaFrontEnd.github.io/media/logo.png'></div><form id='formLoginSignup' action='' method='POST'><div class='formDiv'><div><div class='credDiv'><label for='user'>Usuario</label><input id='userLogin' type='text' name='user' value='ASPIRANTE' required></div><div class='credDiv'><label for='password'>Password</label><input id='passLogin' type='password' name='password' placeholder='******' required></div></div></div><div class='buttonsDiv'><input id='loginButton' type='button' value='Login' name='login'><input id='registroButton' type='button' value='Registro' name='registro'></div></form></div>";


    //Gestión botones login y registro

    const loginButton = document.querySelector('#loginButton');
    const registroButton = document.querySelector('#registroButton');

    //Evento click en boton login
    loginButton.addEventListener('click', login);

    //Evento click en boton registro
    registroButton.addEventListener('click', registro);

}

function registro() {

    //creamos un mensaje emergente para solicitar la contraseña
    //y lo sustituimos por el form
    document.querySelector('#formLoginSignup').innerHTML = "<div class='divSignUp'><h2>Ingrese la contraseña que va a utilizar, el sistema le generará una cuenta automáticamente</h2><br><label for='password'>Password</label><input id='passSignUp' type='password' name='password' placeholder='******' required><input type='button' name='btnSignUp' value='Registro' id='registro'><input type='button' name='btnLogin' value='Login' id='login'></div>";

    //Añadimos listeners a los botones
    document.querySelector('#login').addEventListener('click', inicio);

    document.querySelector('#registro').addEventListener('click', realizarRegistro);
}

async function realizarRegistro(e) {

    //Comprobamos si se ha introducido la contraseña solicitada
    const pass = document.querySelector('#passSignUp').value;

    if (!pass) {
        alert('Por favor, completa ambos campos');
        return; //Detendremos la ejecución si la contraseña está vacía
    }

    //Para el registro, el sistema genera automáticamente  las cuentas
    let user = "ASPIRANTE";

    //generamos la URL completa para llamar al backend
    const consultaID = url + 'getMaxUserId';

    //realizamos la consulta
    fetch(consultaID)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        })
        .then(result => {
            //comprobamos si la consulta devuelve null, significa que no hay ningún usuario creado
            if (result.maxUserId !== null) { //Devuelve un número
                //cambiamos el usuario al usuario + el id siguiente
                const nCorrelativo = +result.maxUserId + 1;
                user = user + nCorrelativo;

            } else { //No devuelve ningún número
                //Creamos la URL para la sentencia del reseteo
                const resetAutoIncrement = url + 'resetAutoIncrement';

                //Ejecución de la sentencia
                fetch(resetAutoIncrement)
                    .then(response => response.json())
                    .then(result => {
                        // Manejar la respuesta del backend
                        console.log(result);
                    })
                    .catch(error => {
                        console.error('Error al realizar la solicitud:', error);
                    });
                //Le asignamos al usuario el mismo ID que hemos reseteado
                user = user + '1';
            }


            //creamos el usuario con su usuario y contraseña
            const userData = { usuario: user, pass: pass };

            //URL para crear el usuario
            const urlCreateUser = url + 'createUser';
            //Solicitud al backend para crear el usuario
            fetch(urlCreateUser, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData), //Pasamos los datos a JSON para tratarlos en el backend
            })
                .then(response => response.json())
                .then(result => {
                    // Manejar la respuesta del backend
                    if (result.error) {
                        console.error('Error al crear el usuario:', result.error);
                    } else {
                        alert('Usuario creado exitosamente:', result);
                        alert("su usuario es " + user);

                    }
                })
                .catch(error => {
                    console.error('Error al realizar la solicitud:', error);
                });
        })
}

function login(e) {

    const usuario = (document.querySelector('#userLogin').value);
    const pass = document.querySelector('#passLogin').value;

    if (!usuario || !pass) {
        alert('Por favor, completa ambos campos');
        return; // Detener la ejecución si alguno de los campos está vacío
    }

    // Crear url a la base de datos
    const login = url + 'login';

    fetch(login, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, pass }),
    })
        .then(response => {
            console.log(response); // Agrega este console.log
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        })
        .then(result => {
            // Manejar la respuesta del backend
            console.log(result);
            if (result.authenticated) {
                console.log('Inicio de sesión exitoso');
                //Entramos al login
                loginExitoso();
            } else {
                console.log('Error en el inicio de sesión:', result.message);
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });

}

function loginExitoso() {
    document.getElementsByTagName('body')[0].innerHTML = '<div id="containerLogged"><div id="parteSuperior"><input id="text" type="text" placeholder="Ingrese su pregunta"><input id="btnAgregar" type="button" name="btnAgregar" value="AGREGAR PREGUNTA"><input id="btnIniciar" type="button" name="btnIniciar" value="INICIAR ENTREVISTA"><input id="btnLogOut" type="button" name="btnLogOut" value="Log Out"></div><div id="parteInferior"><input id="textoPreguntas" type="text" name="salidaPreguntas" placeholder="Aquí saldrán las preguntas" disabled><div id="frameCamara"><div id="camara"></div></div><div id="botonera"><input id="btnGrabar" type="button" name="btnGrabar" value="GRABAR RESPUESTA"><input id="btnDetener" type="button" name="btnDetener" value="DETENER GRABACIÓN"></div></div></div>';

    //listener para el botón de cerrar sesión
    document.querySelector('#btnLogOut').addEventListener('click', () => {
        console.log('Se cerró la sesión');
        inicio();
    });

    //listener para agregar una pregunta a la bbdd
    document.querySelector("#btnAgregar").addEventListener('click', () => {
        // Recogida de datos
        const usuario = document.querySelector('#userLogin').value;

        // Dato a almacenar
        const nuevaPregunta = document.querySelector('#text').value;
        console.log(nuevaPregunta);

        // Crear url a la base de datos
        const urlGetID = `${url}getUserID/${usuario}`;

        //Realizar consulta para obtener el id del usuario
        const ID = 0;
        fetch(urlGetID, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(result => {
                // Manejar la respuesta del backend
                console.log(result);
                const userID = result.userID;
                if (userID !== null) {
                    console.log(`El ID del usuario ${nombreUsuario} es: ${userID}`);
                    ID = userID;
                } else {
                    console.log(result.message);  // Usuario no encontrado
                }
            })
            .catch(error => {
                console.error('Error al realizar la solicitud:', error);
            });

        //Ahora almacenamos la pregunta
        const urlAddQuestion = `${url}addQuestion/${ID}/${encodeURIComponent(nuevaPregunta)}`;
        fetch(urlAddQuestion, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(result => {
                // Manejar la respuesta del backend
                console.log(result);
            })
            .catch(error => {
                console.error('Error al realizar la solicitud:', error);
            });


    });

    //listener para iniciar la entrevista
}



window.onload = inicio;