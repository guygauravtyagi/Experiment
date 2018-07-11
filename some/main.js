var chunkArray = [];
var buttonChunk = [];
var matrixChunk = [];
var gridChunk = [];
//65280
//17

var fillTable = function (smallArr) {
    var temp = "";
    smallArr.forEach(element => {
        temp += '<div style="background-color:' + element + ';"></div><p>' + element + '</p>';
    });
    document.getElementById('stuff-container').innerHTML = temp;
};

var fillButtons = function () {
    var temp = "";
    buttonChunk = chunkify(chunkArray, 17);
    for (let i = 0; i < 17; i++) {
        temp += '<button id="button_top_' + i + '" style="background-color:' + buttonChunk[i][0][255] + ';" onclick="goHere(' + i + ')"></button>';
    }
    document.getElementById('buttons-container').innerHTML = temp;
};

var goHere = function (val) {
    var temp = "";
    buttonActiveToggle("button_top_", 17, val);
    matrixChunk = chunkify(buttonChunk[val], 15);
    for (let i = 0; i < 15; i++) {
        temp += '<button id="button_mat_' + i + '" style="background-color:' + matrixChunk[i][0][255] + ';" onclick="stuffCaller(' + i + ')"></button>';
    }
    document.getElementById('matrix').innerHTML = temp;
};

var stuffCaller = function (val) {
    var temp = "";
    buttonActiveToggle("button_mat_", 15, val);
    gridChunk = matrixChunk[val];
    for (let i = 0; i < gridChunk.length; i++) {
        temp += '<button id="button_stuff_call_' + i + '" style="background-color:' + gridChunk[i][255] + ';" onclick="fillStuff(' + i + ')"></button>';
    }
    document.getElementById('insideEdge').innerHTML = temp;
};

var fillStuff = function (i) {
    buttonActiveToggle("button_stuff_call_", 256, i);
    fillTable(gridChunk[i]);
};

var buttonActiveToggle = function (loopist, size, index) {
    for (let i = 0; i < size; i++) {
        let temp = document.getElementById(loopist + i);
        if (temp.classList.length) {
            if (temp.classList.contains("button_active"))
            temp.classList.remove("button_active")
        }
    }
    document.getElementById(loopist + index).classList.add("button_active");
};

var fillMatrix = function () {
    var buttonDiv = document.getElementById('matrix');
};

var callMe = function (place) {
    fillButtons();
    fillTable(chunkArray[place]);
};

var fillArray = function () {
    var arr = [];
    var count = 0;
    var tempArr = [];
    for (let index = 0; index <= 15; index += 1) {
        arr.push(decideType(index));
    }
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr.length; j++) {
            for (var k = 0; k < arr.length; k++) {
                for (var l = 0; l < arr.length; l++) {
                    for (var m = 0; m < arr.length; m++) {
                        for (var n = 0; n < arr.length; n++) {
                            var temp = "#" + arr[i] + arr[j] + arr[k] + arr[l] + arr[m] + arr[n];
                            if (count === 0 || count % 256 !== 0) {
                                tempArr.push(temp);
                                count++;
                            } else {
                                chunkArray.push(tempArr);
                                count = 0;
                                tempArr = [];
                            }
                        }
                    }
                }
            }
        }
    }
};

function chunkify(a, n) {
    var len = a.length
    var out = []
    var i = 0
    var size = Math.floor(len / n);
    while (i < len) {
        out.push(a.slice(i, i += size));
    }
    return out;
};

var decideType = function (val) {
    if (val <= 9) {
        return "" + val;
    } else {
        switch (val) {
            case 10:
                return 'a';
            case 11:
                return 'b';
            case 12:
                return 'c';
            case 13:
                return 'd';
            case 14:
                return 'e';
            case 15:
                return 'f';
            default:
                return "0";
        }
    }
};

window.onload = function () {
    fillArray();
    callMe(0);
};