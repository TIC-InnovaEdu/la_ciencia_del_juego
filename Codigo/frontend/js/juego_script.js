
var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

var score1 = 0;
var score2 = 0;
var gameOver = false;
var cursors1, cursors2;
var game = new Phaser.Game(config);
var player1, player2, platforms, stars, bombs;
let questions = [];
var questionText, questionNumberText, scoreText1, scoreText2;
let answerText;
let currentQuestionIndex = 0;
let shuffledQuestions = []; // Esta variable almacenará las preguntas obtenidas

// Aquí las preguntas se cargan desde el archivo preguntas.js
var gameOverImage, darkOverlay, restartButton;
var bombCount = 1; // Contador de bombas

function preload() {
    this.load.image('sky', 'assets/sky.jpeg');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('yesStar', 'assets/yesStar.png');
    this.load.image('noStar', 'assets/noStar.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('restartButton', 'assets/restartButton.png');
    this.load.image('gameOverImage', 'assets/gameOver.gif');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    // Aseguramos que los textos se creen antes de usarlos
    questionText = this.add.text(400, 100, '', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    answerText = this.add.text(400, 200, '', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    
    // Fondo
    this.add.image(600, 300, 'sky').setDisplaySize(1200, 600); // Asegúrate de que cubra toda la pantalla

    // Plataformas (5 plataformas)
    platforms = this.physics.add.staticGroup();
    platforms.create(600, 568, 'ground').setScale(3, 2).refreshBody(); // Plataforma de fondo
    platforms.create(200, 400, 'ground'); // Plataforma 1
    platforms.create(400, 250, 'ground'); // Plataforma 2
    platforms.create(800, 250, 'ground'); // Plataforma 3
    platforms.create(1000, 400, 'ground'); // Plataforma 4
    platforms.create(600, 100, 'ground'); // Plataforma 5

    // Jugador 1
    player1 = this.physics.add.sprite(100, 400, 'dude');
    player1.setCollideWorldBounds(true);
    player1.setBounce(0.2);

    // Jugador 2
    player2 = this.physics.add.sprite(300, 400, 'dude');
    player2.setCollideWorldBounds(true);
    player2.setBounce(0.2);

    // Animaciones
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player1, platforms);
    this.physics.add.collider(player2, platforms);
    cursors1 = this.input.keyboard.createCursorKeys(); // Controles del jugador 1
    cursors2 = this.input.keyboard.addKeys({
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        up: Phaser.Input.Keyboard.KeyCodes.W
    });

    scoreText1 = this.add.text(1000, 10, "Puntaje Jugador 1: 0", {
        fontSize: '20px',
        fill: '#fff',
        fontFamily: 'Arial'
    });

    scoreText2 = this.add.text(1000, 40, "Puntaje Jugador 2: 0", {
        fontSize: '20px',
        fill: '#fff',
        fontFamily: 'Arial'
    });
     
    // Preguntas y puntaje
    shuffledQuestions = Phaser.Utils.Array.Shuffle(questions);

    questionNumberText = this.add.text(16, 10, "Pregunta 1:", {
        fontSize: '20px',
        fill: '#fff',
        fontFamily: 'Arial'
    });

    // Ocultar el texto de la pregunta principal
    // questionText = this.add.text(16, 40, "", {
    //     fontSize: '18px',
    //     fill: '#fff',
    //     fontFamily: 'Arial',
    //     wordWrap: { width: 1168, useAdvancedWrap: true }
    // });

    // Estrellas
    stars = this.physics.add.group();
    createStars();

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player1, stars, collectStar, null, this);
    this.physics.add.overlap(player2, stars, collectStar, null, this);

    // Bombas
    bombs = this.physics.add.group();
    createBomb();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.overlap(player1, bombs, hitBomb, null, this);
    this.physics.add.overlap(player2, bombs, hitBomb, null, this);

    loadQuestions.call(this);
}

function update() {
    if (gameOver) return;

    // Movimiento Jugador 1
    if (cursors1.left.isDown) {
        player1.setVelocityX(-160);
        player1.anims.play('left', true);
    } else if (cursors1.right.isDown) {
        player1.setVelocityX(160);
        player1.anims.play('right', true);
    } else {
        player1.setVelocityX(0);
        player1.anims.play('turn');
    }

    if (cursors1.up.isDown && player1.body.touching.down) {
        player1.setVelocityY(-330);
    }

    // Movimiento Jugador 2
    if (cursors2.left.isDown) {
        player2.setVelocityX(-160);
        player2.anims.play('left', true);
    } else if (cursors2.right.isDown) {
        player2.setVelocityX(160);
        player2.anims.play('right', true);
    } else {
        player2.setVelocityX(0);
        player2.anims.play('turn');
    }

    if (cursors2.up.isDown && player2.body.touching.down) {
        player2.setVelocityY(-330);
    }
}

function createStars() {
    stars.clear(true, true);

    // Crear estrellas (sin respuesta)
    var starXGreen = Phaser.Math.Between(100, 1100);
    var greenStar = stars.create(starXGreen, 0, 'yesStar');
    greenStar.setBounce(1);
    greenStar.setCollideWorldBounds(true);
    greenStar.setVelocity(Phaser.Math.Between(-100, 100), 20);
    greenStar.setScale(0.1);

    var starXRed = Phaser.Math.Between(100, 1100);
    var redStar = stars.create(starXRed, 0, 'noStar');
    redStar.setBounce(1);
    redStar.setCollideWorldBounds(true);
    redStar.setVelocity(Phaser.Math.Between(-100, 100), 20);
    redStar.setScale(0.1);
}

function createBomb() {
    if (bombs.countActive(true) < 6) { // Verifica si hay menos de 5 bombas activas
        for (let i = 0; i < bombCount; i++) {
            if (bombs.countActive(true) < 6) { // Vuelve a verificar dentro del bucle
                var bombX = Phaser.Math.Between(100, 1100);
                var bomb = bombs.create(bombX, 0, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-100, 100), 20);
            }
        }
    }
}

function hitBomb(player) {
    showGameOver(this, "¡Golpeaste una bomba!");
}

let keyboardActive = true;  // Variable de control para saber si el teclado está activo

// Función para cargar las preguntas desde el servidor
function loadQuestions() {
    fetch('/preguntas')
        .then(response => response.json())
        .then(data => {
            shuffledQuestions = Phaser.Utils.Array.Shuffle(data);  // Mezclar las preguntas
            console.log(shuffledQuestions);
        })
        .catch(error => {
            console.error("Error al cargar las preguntas:", error);
        });
}

function pauseGameAndShowQuestion(scene, player) {
    if (shuffledQuestions.length === 0) {
        console.log("No se han cargado preguntas aún.");
        return;
    }

    //console.log(shuffledQuestions[0]);

    scene.physics.pause();  // Pausar el juego

    // Crear un contenedor para la pregunta
    questionContainer = scene.add.rectangle(600, 150, 600, 900, 0x000000, 0.7);  // Fondo de la ventana

    // Obtener la pregunta actual
    var currentQuestion = shuffledQuestions[currentQuestionIndex];

    console.log("Pregunta actual:", currentQuestion); // Debugging

    // Verificar que la pregunta tenga la respuesta correcta
    if (!currentQuestion || !currentQuestion.answer) {
        console.error("La pregunta no tiene una respuesta correcta definida.");
        return;
    }

    // Mostrar la pregunta
    var questionText = scene.add.text(350, 175, currentQuestion.question, {
        fontSize: '20px',
        fill: '#fff',
        fontFamily: 'Arial',
        wordWrap: { width: 500, useAdvancedWrap: true }
    });

    // Crear array de opciones incluyendo la respuesta correcta
    var options = [...currentQuestion.options];
    // Mezclar las opciones de forma aleatoria
    //Phaser.Utils.Array.Shuffle(options);


    var optionTexts = [];
    for (let i = 0; i < options.length; i++) {
        let optionText = scene.add.text(350, 275 + i * 50, `${options[i].option}: ${options[i].text}`, {
            fontSize: '18px',
            fill: '#fff',
            fontFamily: 'Arial'
        });

        optionTexts.push(optionText);
    }

    // Desactivar las teclas de movimiento mientras la ventana de la pregunta está activa
    if (keyboardActive) {
        scene.input.keyboard.removeAllListeners();
    }

    // Captura de teclas para las opciones de respuesta (1, 2, 3, 4)
    scene.input.keyboard.on('keydown-ONE', function() { handleAnswerSelection(0); });
    scene.input.keyboard.on('keydown-TWO', function() { handleAnswerSelection(1); });
    scene.input.keyboard.on('keydown-THREE', function() { handleAnswerSelection(2); });
    scene.input.keyboard.on('keydown-FOUR', function() { handleAnswerSelection(3); });

    function handleAnswerSelection(index) {
        let selectedOption = options[index];
    
        // Verificar respuesta
        if (selectedOption.option === currentQuestion.answer) {
            

            // Actualizar el puntaje
            if (player === player1) {
                score1 += 10;
                scoreText1.setText("Puntaje Jugador 1: " + score1);
            } else {
                score2 += 10;
                scoreText2.setText("Puntaje Jugador 2: " + score2);
            }

            // Si es la última pregunta, mostrar mensaje de fin del juego
            if (currentQuestionIndex === shuffledQuestions.length - 1) {
                showGameOver(scene, "¡Completaste el Juego!");
                return;  // Detener la ejecución para evitar errores
            }

            // Avanzar a la siguiente pregunta
            currentQuestionIndex++;
            questionNumberText.setText("Pregunta " + (currentQuestionIndex + 1) + ":");

            // Limpiar los objetos de la pantalla
            questionContainer.destroy();
            optionTexts.forEach(text => text.destroy());
            questionText.destroy();

            // Reanudar el juego
            scene.physics.resume();
            createStars();  // Generar nuevas estrellas
            bombCount++;    // Aumentar el contador de bombas
            createBomb();   // Crear nuevas bombas

            resetPlayerPosition(player);  // Reiniciar la posición del jugador

        } else {
            // Si la respuesta es incorrecta, mostrar Game Over
            showGameOver(scene, "¡Respuesta incorrecta!");
            scene.input.keyboard.removeAllListeners();  // Deshabilitar las teclas
            scene.physics.world.setPaused(true);  // Pausar el juego
        }

        // Eliminar los objetos después de responder
        questionContainer.destroy();
        optionTexts.forEach(text => text.destroy());
        questionText.destroy();

        // Rehabilitar las teclas cuando la ventana se cierre
        keyboardActive = false;
        scene.input.keyboard.removeAllListeners();

        // Reanudar el juego
        scene.physics.resume();
    }
}

// Función para restablecer la posición de un jugador
function resetPlayerPosition(player) {
    if (player === player1) {
        player.setPosition(100, 400); // Posición inicial del jugador 1
    } else if (player === player2) {
        player.setPosition(300, 400); // Posición inicial del jugador 2
    }
}

function showGameOver(scene, message) {
    gameOver = true;
    player1.setTint(0xff0000);
    player2.setTint(0xff0000);
    scene.physics.pause();
    darkOverlay = scene.add.rectangle(600, 300, 1200, 600, 0x000000, 0.5);
    gameOverImage = scene.add.image(600, 300, 'gameOverImage').setScale(0.3); // Tamaño ajustado
    questionText.setText(message);

    // Botón de reinicio
    restartButton = scene.add.image(600, 400, 'restartButton').setInteractive().setScale(0.4); // Botón más pequeño
    restartButton.on('pointerdown', () => {
        scene.scene.restart();
        score1 = 0;
        score2 = 0;
        currentQuestionIndex = 0;
        bombCount = 1; // Reinicia el contador de bombas
        gameOver = false;
    });
}

function collectStar(player, star) {
    star.disableBody(true, true);
    pauseGameAndShowQuestion(this, player); // Pasa el jugador a la función

    // Si las preguntas están disponibles, mostrar la siguiente pregunta
    if (questions.length > 0) {
        showQuestion.call(this, currentQuestionIndex); // Mostrar la siguiente pregunta
        currentQuestionIndex++; // Incrementar el índice para la siguiente pregunta
        if (currentQuestionIndex >= questions.length) {
            currentQuestionIndex = 0; // Si ya no hay más preguntas, reiniciar
        }
    } 
}

