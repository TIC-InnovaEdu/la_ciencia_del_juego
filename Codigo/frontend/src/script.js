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
var questionText, questionNumberText, scoreText1, scoreText2;
var currentQuestionIndex = 0;
var questions = [
    { question: "Los suelos arcillosos retienen el agua formando charcos?", answer: "yes" },
    { question: "Existen cinco clasificaciones de suelo?", answer: "no" },
    { question: "Los cambisoles son suelos jóvenes con acumulación de arcilla?", answer: "yes" },
    { question: "Las plantas no necesitan de un suelo fértil?", answer: "no" },
    { question: "Materia orgánica viene de restos de plantas y animales muertos?", answer: "yes" },
    { question: "Las plantas solo tienen tallos y raíces?", answer: "no" },
    { question: "El tallo es el órgano fundamental de todas las plantas?", answer: "no" },
    { question: "Las plantas producen carbohidratos para crecer?", answer: "yes" },
    { question: "Las plantas no enfrentan problemas ambientales por el ser humano?", answer: "no" },
    { question: "Las plantas pertenecen al reino vegetal (Phylum Plantae)?", answer: "yes" }
];
var shuffledQuestions;
var gameOverImage, darkOverlay, restartButton;
var bombCount = 1; // Contador de bombas

function preload() {
    this.load.image('sky', 'assets/sky.jpeg'); // Asegúrate de que esta imagen cubra todo el fondo
    this.load.image('ground', 'assets/platform.png');
    this.load.image('yesStar', 'assets/yesStar.png');
    this.load.image('noStar', 'assets/noStar.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('restartButton', 'assets/restartButton.png');
    this.load.image('gameOverImage', 'assets/gameOver.gif');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });

    
}

function create() {
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
    }); // Controles del jugador 2

    // Preguntas y puntaje
    //Questions = Phaser.Utils.Array.Shuffle(questions);

    //questionNumberText = this.add.text(16, 10, "Pregunta 1:", {
        //fontSize: '20px',
        //fill: '#fff',
        //fontFamily: 'Arial'
    //});

    //questionText = this.add.text(16, 40, shuffledQuestions[currentQuestionIndex].question, {
        //fontSize: '18px',
        //fill: '#fff',
        //fontFamily: 'Arial',
        //wordWrap: { width: 1168, useAdvancedWrap: true }
    //});

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
    questionText = this.add.text(16, 40, "", {
        fontSize: '18px',
        fill: '#fff',
        fontFamily: 'Arial',
        wordWrap: { width: 1168, useAdvancedWrap: true }
    });

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
    for (let i = 0; i < bombCount; i++) { // Crea el número de bombas basado en bombCount
        var bombX = Phaser.Math.Between(100, 1100);
        var bomb = bombs.create(bombX, 0, 'bomb');
        bomb.setBounce(1); // Ajusta el rebote de la bomba
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);
    pauseGameAndShowQuestion(this, player); // Pasa el jugador a la función
}

function hitBomb(player) {
    showGameOver(this, "¡Golpeaste una bomba!");
}

function pauseGameAndShowQuestion(scene, player) {
    scene.physics.pause();
    questionContainer = scene.add.rectangle(600, 150, 600, 900, 0x000000, 0.7);

    // Obtener la pregunta actual
    var currentQuestion = shuffledQuestions[currentQuestionIndex];

    // Mostrar la pregunta
    var questionText = scene.add.text(350, 175, currentQuestion.question, { // Ajuste vertical
        fontSize: '20px',
        fill: '#fff',
        fontFamily: 'Arial',
        wordWrap: { width: 500, useAdvancedWrap: true }
    });

    // Mostrar las opciones de respuesta
    var options = [currentQuestion.answer, "opcion2", "opcion3", "opcion4"]; // Reemplaza con opciones reales
    Phaser.Utils.Array.Shuffle(options); // Mezclar las opciones

    var optionTexts = [];
    for (let i = 0; i < options.length; i++) {
        let optionText = scene.add.text(350, 275 + i * 75, options[i], { // Ajuste vertical y espaciado
            fontSize: '18px',
            fill: '#fff',
            fontFamily: 'Arial'
        });

        optionTexts.push(optionText); // Guarda la referencia al texto de la opción
    }

    // Evento de teclado para seleccionar opciones
    scene.input.keyboard.on('keydown', function (event) {
        let key = event.key; // No es necesario convertir a mayúscula

        if (key >= '1' && key <= '4') { // Verificar si es 1, 2, 3 o 4
            let selectedOptionIndex = key.charCodeAt(0) - '1'.charCodeAt(0); // Obtener el índice de la opción (0, 1, 2 o 3)

            if (selectedOptionIndex >= 0 && selectedOptionIndex < options.length) { // Verificar si el índice es válido
                let selectedOption = options[selectedOptionIndex]; // Obtener la opción seleccionada

                // Lógica para verificar la respuesta y continuar el juego
                if (selectedOption === currentQuestion.answer) {
                    currentQuestionIndex++;

                    // Obtener el puntaje actual del jugador
                    var currentScore = player === player1 ? score1 : score2;

                    // Incrementar el puntaje
                    currentScore += 10; // Puedes ajustar la cantidad de puntos

                    // Actualizar el puntaje del jugador
                    if (player === player1) {
                        score1 = currentScore;
                        scoreText1.setText("Puntaje Jugador 1: " + score1);
                    } else {
                        score2 = currentScore;
                        scoreText2.setText("Puntaje Jugador 2: " + score2);
                    }

                    if (currentQuestionIndex < shuffledQuestions.length) {
                        scene.physics.resume(); // Reanudar la física *antes* de destruir elementos

                        questionContainer.destroy();
                        optionTexts.forEach(text => text.destroy());
                        questionText.destroy();


                        questionNumberText.setText("Pregunta " + (currentQuestionIndex + 1) + ":");
                        createStars();
                        bombCount++;
                        createBomb();

                        // Restablecer posición de los jugadores
                        resetPlayerPosition(player);
                    } else {
                        questionNumberText.setText("¡Has completado el juego!");
                        gameOver = true;
                    }
                } else {
                    showGameOver(scene, "¡Respuesta incorrecta!");
                    scene.physics.pause(); // Pausar la escena al responder incorrectamente
                }
                questionContainer.destroy();
                optionTexts.forEach(text => text.destroy());
                questionText.destroy();
            }
        }
    });
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
