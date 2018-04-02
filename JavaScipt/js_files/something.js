var obstclesArray = [];
var pointArray = [];
var pauseFlag = false;
const POINT_GEN_CONST = 2000;
const OBS_GEN_CONST = 5000;
const POWERUP_GEN_CONST = 30000;
const OBS_MAX_SPEED_CONST = 6;
const POINT_MAX_SPEED_CONST = 6;
const POWERUP_MAX_SPEED_CONST = 6;
var obstaclesTimeoutObj;
var pointsTimeoutObj;
var powerUpTimeoutObj;
var obstacleGenSpeed = OBS_GEN_CONST;
var pointGenSpeed = POINT_GEN_CONST;
var powerUpGenSpeed = POWERUP_GEN_CONST;
var obsMaxSpeed = OBS_MAX_SPEED_CONST;
var pointMaxSpeed = POINT_MAX_SPEED_CONST;
var powerUpMaxSpeed = POWERUP_MAX_SPEED_CONST;
var makeImmuneFlag = false;
var powerUpArray = ['plus50', 'plus100', 'speedBoost', 'speedSlow', 'immune', 'batteryCatcher'];

//Prepare the area.
var gameArea = {
    canvas: document.getElementById("myCanvas"),
    addBackground: function (ctx) {
        var img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            ctx.beginPath();
            ctx.stroke();
        };
        img.src = './images/backGround.jpg';
    },
    start: function () {
        this.canvas.width = 845;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        this.context.fillStyle = "blue";
        this.interval = setInterval(updateGameArea, 40);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
};

//Component - your ship
var component = function (width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = './images/Ship.png';
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    //update on the stuff
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
        //This add shadow to every other component
        ctx.shadowColor = '#333';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    //define new position
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

//Use to generate the pointer objects. Which gives poins in the game
var points = function (radius, color, gradColor, x, y, speedX, speedY, isPowerUp, powerUpObj) {
    this.radius = radius;
    this.color = color;
    this.gradColor = gradColor;
    this.x = x;
    this.y = y;
    this.isPowerUp = isPowerUp;
    this.image = new Image();
    if (this.isPowerUp) {
        this.image.src = powerUpObj.srcImage;
        this.type = powerUpObj.type;
    } else {
        this.image.src = './images/power.png';
    }
    if (!speedX) {
        this.speedX = -POINT_MAX_SPEED_CONST;
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
        ctx.beginPath();
        var grd = ctx.createRadialGradient(this.x, this.y, 6, this.x, this.y, this.radius);
        grd.addColorStop(0, this.color);
        grd.addColorStop(1, this.gradColor);
        ctx.fillStyle = grd;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.drawImage(this.image, (this.x + this.radius * Math.sin(225 * (2 * Math.PI / 360))), (this.y + this.radius * Math.sin(225 * (2 * Math.PI / 360))), Math.sqrt(Math.pow((2 * this.radius), 2) / 2), Math.sqrt(Math.pow((2 * this.radius), 2) / 2));
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
};

//Use to generate the obstacles
var obstacles = function (width, height, radius, color, x, y, speedX, speedY) {
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.image = new Image();
    if (!speedX) {
        this.speedX = - OBS_MAX_SPEED_CONST;
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
        this.image.src = addVariations(this.speedX);
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
};

var addVariations = function (value) {
    if (value % 3 === 0) {
        return './images/obstacles/Obstacle3.png';
    } else if (value % 2 === 0) {
        return './images/obstacles/Obstacle2.png';
    }
    return './images/obstacles/Obstacle1.png';
};

var showText = function (text, height, color, x, y) {
    this.text;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = gameArea.canvas.getContext("2d");
        ctx.font = this.height + "px Arial";
        ctx.fillText(this.text, this.x, this.y);
    }
};

var generateRandomNumbers = function (upLimit, lowLimit) {
    return Math.floor((Math.random() * upLimit) + 1);
};

/*
Timer function to create point component object.
Now the thing is we have added random number generator to randomise the
creation of the object. If you have any other way of generating component GO AHEAD.
Change here.
*/
var pointGenerator = function () {
    pointsTimeoutObj = setTimeout(() => {
        pointPiece = new points(12, '#FFD700', "#666", gameArea.canvas.width, generateRandomNumbers(gameArea.canvas.height), -generateRandomNumbers(pointMaxSpeed), 0, false);
        pointArray.push(pointPiece);
        pointGenerator();
    }, generateRandomNumbers(pointGenSpeed));
};

//same thing for Obstacles
var obstacleGenerator = function () {
    obstaclesTimeoutObj = setTimeout(() => {
        obstaclePiece = new obstacles(40, 40, 10, 'blue', gameArea.canvas.width, generateRandomNumbers(gameArea.canvas.height), -generateRandomNumbers(obsMaxSpeed), 0);
        obstclesArray.push(obstaclePiece);
        obstacleGenerator();
    }, generateRandomNumbers(obstacleGenSpeed));
};

var powerUpGenerator = function () {
    powerUpTimeoutObj = setTimeout(() => {
        let powerUpObj = addPowerUpVariation(powerUpArray[Math.floor(Math.random() * powerUpArray.length)]);
        pointPiece = new points(powerUpObj.radius, powerUpObj.color, powerUpObj.gradColor, gameArea.canvas.width, generateRandomNumbers(gameArea.canvas.height), -generateRandomNumbers(pointMaxSpeed), 0, true, powerUpObj);
        pointArray.push(pointPiece);
        powerUpGenerator();
    }, (generateRandomNumbers(powerUpGenSpeed) > 20000 ? generateRandomNumbers(powerUpGenSpeed) : 20000));
};

var addPowerUpVariation = function (powerUpName) {
    let variationObj = {};
    switch (powerUpName) {
        case 'plus50':
            variationObj['radius'] = 13;
            variationObj['color'] = 'pink';
            variationObj['gradColor'] = 'white';
            variationObj['type'] = 'plus50';
            variationObj['srcImage'] = './images/50.png';
            break;
        case 'plus100':
            variationObj['radius'] = 25;
            variationObj['color'] = 'pink';
            variationObj['gradColor'] = 'white';
            variationObj['type'] = 'plus100';
            variationObj['srcImage'] = './images/100.png';
            break;
        case 'immune':
            variationObj['radius'] = 15;
            variationObj['color'] = 'blue';
            variationObj['gradColor'] = 'white';
            variationObj['type'] = 'immune';
            variationObj['srcImage'] = './images/immune.png';
            break;
        case 'speedBoost':
            variationObj['radius'] = 20;
            variationObj['color'] = '#ff5733';
            variationObj['gradColor'] = 'white';
            variationObj['type'] = 'speedBoost';
            variationObj['srcImage'] = './images/speed.png';
            break;
        case 'speedSlow':
            variationObj['radius'] = 12;
            variationObj['color'] = '#33ffe9';
            variationObj['gradColor'] = 'white';
            variationObj['type'] = 'speedSlow';
            variationObj['srcImage'] = './images/Slow.png';
            break;
        case 'batteryCatcher':
            variationObj['radius'] = 18;
            variationObj['color'] = 'green';
            variationObj['gradColor'] = '#ddd';
            variationObj['type'] = 'batteryCatcher';
            variationObj['srcImage'] = './images/batteryPower.png';
            break;
        default:
    }
    return variationObj;
};

//check if we have collision between the player component and other two.
//And do what hasa to be done.
//Planning to add powerUps too.
var collisionChecker = function () {
    let pointFlag = 0;
    let obstacleFlag = 0;
    obstclesArray.forEach(element => {
        if (gamePiece.x > element.x && gamePiece.x < element.x + element.width && gamePiece.y > element.y && gamePiece.y < element.y + element.height
            || gamePiece.x + gamePiece.width > element.x && gamePiece.x + gamePiece.width < element.x + element.width && gamePiece.y + gamePiece.height > element.y && gamePiece.y + gamePiece.height < element.y + element.height
            || gamePiece.x > element.x && gamePiece.x < element.x + element.width && gamePiece.y + gamePiece.height > element.y && gamePiece.y + gamePiece.height < element.y + element.height
            || gamePiece.x + gamePiece.width > element.x && gamePiece.x + gamePiece.width < element.x + element.width && gamePiece.y > element.y && gamePiece.y < element.y + element.height) {
            if (onObstacleContact(parseInt(document.getElementById('life').innerText))) {
                obstclesArray.splice(obstacleFlag, 1);
            }
        }
        obstacleFlag++;
    });
    pointArray.forEach(element => {
        if (rectCircleColliding(element, gamePiece)) {
            let value = document.getElementById('score').innerText;
            value = 1 - (-value);
            document.getElementById('score').innerText = value;
            pointArray.splice(pointFlag, 1);
            if (element.isPowerUp) {
                initiatePowerUp(element);
            }
            gradualObstacleIncrease();
        }
        pointFlag++;
    });
};

var onObstacleContact = function (lifeCount) {
    if (!makeImmuneFlag) {
        lifeCount--;
    }
    document.getElementById('life').innerText = lifeCount;
    if (lifeCount === 0) {
        onGameLost();
        return false;
    }
    return true;
};

var onGameLost = function () {
    gameArea.stop();
    document.getElementById('life').innerText = 0;
    if (document.getElementById('hScore').innerText < document.getElementById('score').innerText) {
        document.getElementById('hScore').innerText = document.getElementById('score').innerText;
    }
    document.getElementById('gameOverMessage').style.color = 'red';
    document.getElementById('gameOverMessage').style.display = '';
};

//Increasae the rate of obstacle generation to keep things smooth.
var gradualObstacleIncrease = function () {
    if (obstacleGenSpeed > 4000) {
        obstacleGenSpeed -= 20;
    } else if (obstacleGenSpeed > 3000) {
        obstacleGenSpeed -= 10;
    } else if (obstacleGenSpeed > 2000) {
        obstacleGenSpeed -= 5;
    } else if (obstacleGenSpeed > 1000) {
        obstacleGenSpeed -= 2;
    } else {
        //do nothing
    }
};

//Collision detection between Rectangle and Circle 
//Thank God for Stack Overflow
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

//['plus50', 'plus100', 'speedBoost', 'speedSlow', 'immune', 'batteryCatcher']
var initiatePowerUp = function (powerUp) {
    switch (powerUp.type) {
        case 'plus50':
            addScore(50);
            break;
        case 'plus100':
            addScore(100);
            break;
        case 'immune':
            makeImmune();
            break;
        case 'speedBoost':
            increaseSpeed();
            break;
        case 'speedSlow':
            reduceSpeed();
            break;
        case 'batteryCatcher':
            initiateBatteryCatcher();
            break;
        default:
    }
};

var initiateBatteryCatcher = function () {
    clearTimeout(obstaclesTimeoutObj);
    clearTimeout(powerUpTimeoutObj);
    obstclesArray.length = 0;
    pointGenSpeed = 100;
    setTimeout(() => {
        obstacleGenerator();
        powerUpGenerator();
        pointGenSpeed = POINT_GEN_CONST;
    }, 10000);
};

var addScore = function (increment) {
    let value = document.getElementById('score').innerText;
    value = increment - (-value);
    document.getElementById('score').innerText = value;
};

var makeImmune = function () {
    makeImmuneFlag = true;
    setTimeout(() => {
        makeImmuneFlag = false;
    }, 10000);
};

var increaseSpeed = function () {
    obstclesArray.forEach(element => {
        element.speedX *= 3;
    });
    pointArray.forEach(element => {
        element.speedX *= 3;
    });
    pointMaxSpeed = 20;
    obsMaxSpeed = 20;
    powerUpMaxSpeed = 20;
    setTimeout(() => {
        pointMaxSpeed = POINT_MAX_SPEED_CONST;
        obsMaxSpeed = OBS_MAX_SPEED_CONST;
        powerUpMaxSpeed = POWERUP_MAX_SPEED_CONST;
    }, 10000);
};

var reduceSpeed = function () {
    obstclesArray.forEach(element => {
        element.speedX /= 3;
    });
    pointArray.forEach(element => {
        element.speedX /= 3;
    });
    pointMaxSpeed = 2;
    obsMaxSpeed = 2;
    powerUpMaxSpeed = 2;
    setTimeout(() => {
        pointMaxSpeed = POINT_MAX_SPEED_CONST;
        obsMaxSpeed = OBS_MAX_SPEED_CONST;
        powerUpMaxSpeed = POWERUP_MAX_SPEED_CONST;
    }, 10000);

};

/*
Remove the obstacles from obstacle array to keep the size in check.
If your Game is running slow you could have probably screwed here too.
*/
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

//same as above for point components
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

//Update Game
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

//Event catcher for whole page.
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
            if (!pauseFlag) {
                clearTimeout(obstaclesTimeoutObj);
                clearTimeout(pointsTimeoutObj);
                clearTimeout(powerUpTimeoutObj);
            } else {
                pointGenerator();
                obstacleGenerator();
                powerUpGenerator();
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

//This is how you start Game
var startGame = function () {
    gameArea.start();
    gamePiece = new component(50, 40, "red", 10, 230);
    obstacleGenerator();
    pointGenerator();
    powerUpGenerator();
};

//Reload evey bit, if you are adding new things add it here to update them on reset button click.
var startNewGame = function (isFromRestartButton) {
    gameArea.stop();
    gameArea.clear();
    obstclesArray = [];
    pointArray = [];
    pauseFlag = false;
    clearTimeout(obstaclesTimeoutObj);
    clearTimeout(pointsTimeoutObj);
    clearTimeout(powerUpTimeoutObj);
    if (isFromRestartButton) {
        resetScoreCard();
    }
    startGame();
};

var resetScoreCard = function () {
    document.getElementById('life').innerText = 3;
    document.getElementById('score').innerText = 0;
    document.getElementById('gameOverMessage').style.display = 'none';
};

/*
*
*
*LET THE GAME BEGIN - Are you dramatized enough?
*
*
*/
startGame();