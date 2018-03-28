var obstclesArray = [];
var pointArray = [];
var pauseFlag = false;
var obstaclesTimeoutObj;
var pointsTimeoutObj;
var obstacleGenSpeed = 5000;
var pointGenSpeed = 2000;
var obsMaxSpeed = 5;
var pointMaxSpeed = 5;

var gameArea = {
    canvas: document.getElementById("myCanvas"),
    start: function () {
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        this.context.fillStyle = "blue";
        this.interval = setInterval(updateGameArea, 40);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "#90EE90";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
};

var component = function (width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function () {
        ctx = gameArea.context;
        ctx.fillStyle = color;
        if (this.x > gameArea.canvas.width - gamePiece.width) {
            this.x = gameArea.canvas.width - gamePiece.width;
        }
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.y > gameArea.canvas.height - gamePiece.height) {
            this.y = gameArea.canvas.height - gamePiece.height;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        ctx.shadowColor = '#999';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

var points = function (radius, color, x, y, speedX, speedY) {
    this.radius = radius;
    this.color = color;
    this.x = x;
    this.y = y;
    if (!speedX) {
        this.speedX = -5;
    } else {
        this.speedX = speedX;
    }
    if (!speedY) {
        this.speedY = 0;
    } else {
        this.speedY = speedY;
    }
    this.update = function () {
        ctx = gameArea.context;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.fill();
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
};

var obstacles = function (width, height, radius, color, x, y, speedX, speedY) {
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.x = x;
    this.y = y;
    if (!speedX) {
        this.speedX = -5;
    } else {
        this.speedX = speedX;
    }
    if (!speedY) {
        this.speedY = 0;
    } else {
        this.speedY = speedY;
    }
    this.update = function () {
        ctx = gameArea.context;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.radius);
        ctx.lineTo(this.x, this.y + this.height - this.radius);
        ctx.arcTo(this.x, this.y + this.height, this.x + this.radius, this.y + this.height, this.radius);
        ctx.lineTo(this.x + this.width - this.radius, this.y + this.height);
        ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width, this.y + this.height - this.radius, this.radius);
        ctx.lineTo(this.x + this.width, this.y + this.radius);
        ctx.arcTo(this.x + this.width, this.y, this.x + this.width - this.radius, this.y, this.radius);
        ctx.lineTo(this.x + this.radius, this.y);
        ctx.arcTo(this.x, this.y, this.x, this.y + this.radius, this.radius);
        ctx.fill();
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
};

var generateRandomNumbers = function (upLimit, lowLimit) {
    return Math.floor((Math.random() * upLimit) + 1);
};

var pointGenerator = function () {
    pointsTimeoutObj = setTimeout(() => {
        pointPiece = new points(10, 'yellow', gameArea.canvas.width, generateRandomNumbers(500), -generateRandomNumbers(pointMaxSpeed), 0);
        pointArray.push(pointPiece);
        pointGenerator();
    }, generateRandomNumbers(pointGenSpeed));
};

var obstacleGenerator = function () {
    obstaclesTimeoutObj = setTimeout(() => {
        obstaclePiece = new obstacles(30, 30, 10, 'blue', gameArea.canvas.width, generateRandomNumbers(500), -generateRandomNumbers(obsMaxSpeed), 0);
        obstclesArray.push(obstaclePiece);
        obstacleGenerator();
    }, generateRandomNumbers(obstacleGenSpeed));
};

var collisionChecker = function () {
    let pointFlag = 0;
    let obstacleFlag = 0;
    obstclesArray.forEach(element => {
        if (gamePiece.x > element.x && gamePiece.x < element.x + element.width && gamePiece.y > element.y && gamePiece.y < element.y + element.height
            || gamePiece.x + gamePiece.width > element.x && gamePiece.x + gamePiece.width < element.x + element.width && gamePiece.y + gamePiece.height > element.y && gamePiece.y + gamePiece.height < element.y + element.height
            || gamePiece.x > element.x && gamePiece.x < element.x + element.width && gamePiece.y + gamePiece.height > element.y && gamePiece.y + gamePiece.height < element.y + element.height
            || gamePiece.x + gamePiece.width > element.x && gamePiece.x + gamePiece.width < element.x + element.width && gamePiece.y > element.y && gamePiece.y < element.y + element.height) {
            let value = parseInt(document.getElementById('life').innerText);
            value--;
            document.getElementById('life').innerText = value;
            if (value < 0) {
                gameArea.stop();
                document.getElementById('life').innerText = 0;
                if (document.getElementById('hScore').innerText < document.getElementById('score').innerText) {
                    document.getElementById('hScore').innerText = document.getElementById('score').innerText;
                }
                document.getElementById('gameOverMessage').style.color = 'red';
                document.getElementById('gameOverMessage').style.display = '';
            }
            obstclesArray.splice(obstacleFlag, 1);
        }
        obstacleFlag++;
    });
    pointArray.forEach(element => {
        if (rectCircleColliding(element, gamePiece)) {
            let value = document.getElementById('score').innerText;
            value = 1 - (-value);
            document.getElementById('score').innerText = value;
            pointArray.splice(pointFlag, 1);
            gradualObstacleIncrease();
        }
        pointFlag++;
    });
};

var gradualObstacleIncrease = function () {
    if(obstacleGenSpeed > 4000){
        obstacleGenSpeed -= 20;
    } else if(obstacleGenSpeed > 3000) {
        obstacleGenSpeed -= 10;
    } else if(obstacleGenSpeed > 2000) {
        obstacleGenSpeed -= 5;
    } else if(obstacleGenSpeed > 1000){
        obstacleGenSpeed -= 2;
    } else {
        //do nothing
    }
};

var rectCircleColliding = function (circle, rect) {
    var distX = Math.abs(circle.x - rect.x - rect.width / 2);
    var distY = Math.abs(circle.y - rect.y - rect.height / 2);

    if (distX > (rect.width / 2 + circle.radius)) { return false; }
    if (distY > (rect.height / 2 + circle.radius)) { return false; }

    if (distX <= (rect.width / 2)) { return true; }
    if (distY <= (rect.height / 2)) { return true; }

    var dx = distX - rect.width / 2;
    var dy = distY - rect.height / 2;
    return (dx * dx + dy * dy <= (circle.radius * circle.radius));
}

var updateObstacles = function () {
    let index = 0;
    obstclesArray.forEach(element => {
        element.newPos();
        element.update();
        if (element.x < -30) {
            obstclesArray.splice(index, 1);
        }
        index++;
    });
};

var updatePoints = function () {
    let index = 0;
    pointArray.forEach(element => {
        element.newPos();
        element.update();
        if (element.x < -30) {
            pointArray.splice(index, 1);
        }
        index++;
    });
};

var updateGameArea = function () {
    if (!pauseFlag) {
        gameArea.clear();
        gamePiece.newPos();
        gamePiece.update();
        collisionChecker();
        updateObstacles();
        updatePoints();
    }
};

document.getElementsByTagName("html")[0].onkeydown = function (event) {
    switch (event.key) {
        case 'ArrowRight': case 'd':
            gamePiece.speedX = 0;
            gamePiece.speedX = 10;
            break;
        case 'ArrowLeft': case 'a':
            gamePiece.speedX = 0;
            gamePiece.speedX = -10;
            break;
        case 'ArrowUp': case 'w':
            gamePiece.speedY = 0;
            gamePiece.speedY = -10;
            break;
        case 'ArrowDown': case 's':
            gamePiece.speedY = 0;
            gamePiece.speedY = 10;
            break;
        case 'p':
            if(!pauseFlag){
                clearTimeout(obstaclesTimeoutObj);
                clearTimeout(pointsTimeoutObj);
            } else {
                pointGenerator();
                obstacleGenerator();
            }
            pauseFlag = !pauseFlag;
            break;
        default:
    }
};

document.getElementsByTagName("html")[0].onkeyup = function (event) {
    switch (event.key) {
        case 'ArrowRight': case 'a':
            gamePiece.speedX = 0;
            break;
        case 'ArrowLeft': case 'd':
            gamePiece.speedX = 0;
            break;
        case 'ArrowUp': case 'w':
            gamePiece.speedY = 0;
            break;
        case 'ArrowDown': case 's':
            gamePiece.speedY = 0;
            break;
        default:
    }
};

var startGame = function () {
    gameArea.start();
    gamePiece = new component(30, 30, "red", 10, 230);
    obstacleGenerator();
    pointGenerator();
};

var startNewGame = function (isFromRestartButton) {
    gameArea.stop();
    gameArea.clear();
    obstclesArray = [];
    pointArray = [];
    pauseFlag = false;
    clearTimeout(obstaclesTimeoutObj);
    clearTimeout(pointsTimeoutObj);
    if(isFromRestartButton){
        resetScoreCard();
    }
    startGame();
};

var resetScoreCard = function() {
    document.getElementById('life').innerText = 3;
    document.getElementById('score').innerText = 0;
    document.getElementById('gameOverMessage').style.display = 'none';
};

startGame();