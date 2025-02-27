///// TREASURE HUNT - a large part of this code has been inspired and taken from Mingfei Sun's github repository: https://github.com/mingfeisun/Submarine-game/tree/master \\\\\
//// the image for background, obstacle have also been taken from the same repo. The panel image has been modified. The images for treasures and hunter are my own.\\\\
/// The editing tool used for this purpose are Paint(found in MS Windows) and the website: fotor.com \\\



var cButton = document.getElementById("button");
var cField = document.getElementById("field");
var cWrapGame = document.getElementById("wrapgame");
var nRounds = document.getElementById("rounds");
var nScoreUser = document.getElementById("score_user");
var nTreasure5 = document.getElementById("Treasure_5");
var nTreasure6 = document.getElementById("Treasure_6");
var nTreasure7 = document.getElementById("Treasure_7");
var nTreasure8 = document.getElementById("Treasure_8");


var CurrentUserPos = []; // 0-9, 0-9
var CurrentTreasure_5 = 0;
var CurrentTreasure_6 = 0;
var CurrentTreasure_7 = 0;
var CurrentTreasure_8 = 0;
var CurrentUserScore = 0;
var CurrentRound = 0;
var TreasureCount = 0;


var SelectedLeft = 0;
var SelectedTop = 0;

var HINT_SETUP = "type 5 - 8 to place a treasure, the number indicating the value of the treasure," +
                 "o to place an obstacle, " +
                 "h to place the treasure hunter ";

var HINT_SETUP_T = 15000;

var HINT_OCCUPIED = "This place has already been set!";

var HINT_OCCUPIED_T = 1501;

var HINT_ALREADY_SET = "Your hunter has already been set!";

var HINT_ALREADY_SET_T = 1502;

var HINT_PLACE_KEYS = "Only 5-8, o, h are allowed";

var HINT_PLACE_KEYS_T = 1999;

var HINT_CONTROL_KEYS = "Move with letter a-->left, w-->up, d-->right, s-->down";
var HINT_CONTROL_KEYS_T = 2000;

var HINT_MOVE_OUT_OF_RANGE = "Out of range! Move fails...";
var HINT_MOVE_OUT_OF_RANGE_T = 1503;

var HINT_MOVE_TO_OBSTACLE = "Come across obstacles! Move fails...";
var HINT_MOVE_TO_OBSTACLE_T = 1504;

var HINT_FUEL_GET1 = "Treasures + ";
var HINT_FUEL_GET2 = ", Scores + ";
var HINT_FUEL_GET_T = 1001;

var HINT_Treasure5_LOSE = CurrentTreasure_5.toString() + "- 1";
var HINT_TREASURE_LOSE_T5 = 501;

var HINT_Treasure6_LOSE = CurrentTreasure_6.toString() +  "- 1";
var HINT_TREASURE_LOSE_T6 = 601;

var HINT_Treasure7_LOSE = CurrentTreasure_7.toString() + "- 1";
var HINT_TREASURE7_LOSE_T7 = 701;

var HINT_Treasure8_LOSE = CurrentTreasure_8.toString() +  "- 1";
var HINT_TREASURE8_LOSE_T8 = 801;

/************************************************************
 * GridMap stores the grid status
 *
 * 0      means empty
 * -2     means user
 * 1-9    means treasures
 * 1000   means obstacle
 ************************************************************/

var VAL_OBSTACLE = 1e3;

var GridMap = new Array(10);

var IsRunning = -2;
window.document.onload = init();

/************************************************************
 * Functions Starts Here
 ************************************************************/


/////////////////////////////////////////////////////////////
////////////////     System Init         ////////////////////
/////////////////////////////////////////////////////////////

// system init
function init() {
    cButton.innerHTML = "SETUP";
    nRounds.innerHTML = "0";
    nScoreUser.innerHTML = "0";
    nTreasure5.innerHTML = "0";
    nTreasure6.innerHTML = "0";
    nTreasure7.innerHTML = "0";
    nTreasure8.innerHTML = "0";
    // nRemainingFuel.innerHTML = "0";
    cButton.addEventListener("click", buttonClick);
}

// setup init
function setupInit(isStarting) {
    // game setup flag
    IsRunning = -1;

    cButton.innerHTML = "START";

    CurrentRound = 0;

    if (isStarting === undefined){
        showAlert("Setup first here by clicking!", 2000);
        clearSettings();
    }

    for (var i = 0; i < 10; i++){
        GridMap[i] = new Array(10);
        GridMap[i].fill(0);
    }

    cField.setAttribute("class", "cursorPointer");
    cField.addEventListener("click", fieldClick);
    cField.addEventListener("mousemove", fieldMouseOver);
}

// play init
function playInit() {
    // game running flag
    IsRunning = 0;

    if(!checkSetup()){
        setupInit(true);
        return;
    }

    clearTimeouts();

    // update button
    cButton.innerHTML = "END";

    // update status
    CurrentRound = 0;
    CurrentUserScore = 0;
    updateStatus();

    // remove all listeners
    cField.removeEventListener("click", fieldClick);
    cField.removeEventListener("mousemove", fieldMouseOver);
    window.removeEventListener("keydown", fieldConfig);

    // remove bordered divs
    removeBorderDiv();

    // reset SelectedLeft & SelectedTop
    SelectedLeft = CurrentUserPos[0]*64;
    SelectedTop = CurrentUserPos[1]*64;

    showAlert("Game Starts!", 1500);
    // add listeners for keydown
    window.addEventListener("keydown", controlHunter);
}

// clear all timeout to avoid any warnings
function clearTimeouts() {
    // remove all timeouts
    var highestTimeoutId = setTimeout("null");
    for (var i = 0 ; i < highestTimeoutId ; i++) {
        clearTimeout(i);
    }
}

// clear all settings before setup
function clearSettings() {
    while(cField.firstChild){
        cField.removeChild(cField.firstChild);
    }

    var CurrentUserPos = []; // 0-9, 0-9
    var CurrentTreasure_5 = 0;
    var CurrentTreasure_6 = 0;
    var CurrentTreasure_7 = 0;
    var CurrentTreasure_8 = 0;
    var CurrentUserScore = 0;
    var CurrentRound = 0;

    SelectedLeft = 0;
    SelectedTop = 0;
}

// button click callback
function buttonClick() {
    if (IsRunning < -1) {
        setupInit();
    }
    else if (IsRunning < 0) {
        playInit();
    }
    else if (IsRunning < 1) {
        finalOutput();
    }
    else {
        setupInit();
    }
}

// check whether the user has placed the hunter
function checkSetup() {
    if (CurrentUserPos.length < 2){
        showAlert("Need the hunter !", 1500);
        return false;
    }

    if(TreasureCount == 0){
        showAlert("Need at least one treasure cell!", 1500);
        return false;
    }
    

    return true;
}

/////////////////////////////////////////////////////////////
////////////////    User control         ////////////////////
/////////////////////////////////////////////////////////////

// user hunter key control
function controlHunter(event) {
    switch (event.key){
        case "a":
            updateUserPosition(-1, 0);
            break;
        case "w":
            updateUserPosition(0, -1);
            break;
        case "d":
            updateUserPosition(1, 0);
            break;
        case "s":
            updateUserPosition(0, 1);
            break;
        default:
            showHint(HINT_CONTROL_KEYS, HINT_CONTROL_KEYS_T);
            break;
    }
}

// object move update
function updateUserPosition(xShiftVal, yShiftVal) {
    var estimatedPosX = CurrentUserPos[0] + xShiftVal;
    var estimatedPosY = CurrentUserPos[1] + yShiftVal;

    if (estimatedPosX < 0 || estimatedPosX > 9 || estimatedPosY < 0 || estimatedPosY > 9) {
        showHint(HINT_MOVE_OUT_OF_RANGE, HINT_MOVE_OUT_OF_RANGE_T);
    }
    else if (GridMap[estimatedPosX][estimatedPosY] == VAL_OBSTACLE){
        showHint(HINT_MOVE_TO_OBSTACLE, HINT_MOVE_TO_OBSTACLE_T);
    }
    else{
        moveUser(xShiftVal, yShiftVal);
    }
}

// move user's hunter to its offset position, (xVal, yVal)

function moveUser(xVal, yVal) {
        var userDiv = document.getElementById("user");
    
        var targetX = CurrentUserPos[0] + xVal;
        var targetY = CurrentUserPos[1] + yVal;
    
        var treasureDiv = null;
        if (GridMap[targetX][targetY] >= 5 && GridMap[targetX][targetY] <= 8) {
            treasureDiv = document.getElementById("treasure" + targetX + targetY);
        }
    
        CurrentUserPos[0] = targetX;
        CurrentUserPos[1] = targetY;
    
        userDiv.style.left = targetX * 64 + "px";
        userDiv.style.top = targetY * 64 + "px";
        
        CurrentRound++;
        updateStatus();

        if (treasureDiv != null) {
            var treasureValue = parseInt(GridMap[targetX][targetY]);
            GridMap[targetX][targetY] = 0;
    
            switch (treasureValue) {
                case 5:
                    CurrentTreasure_5--;
                    break;
                case 6:
                    CurrentTreasure_6--;
                    break;
                case 7:
                    CurrentTreasure_7--;
                    break;
                case 8:
                    CurrentTreasure_8--;
                    break;
            }
            
            if (isEndStage()) {
                finalOutput();
                return;
            }
            CurrentUserScore += treasureValue;
            cField.removeChild(treasureDiv);
            placeObstacleRandomly();
            updateStatus();
        }
    
        
        /* updateStatus(); */
        /*
        if (isEndStage()) {
            if (CurrentTreasure_5 + CurrentTreasure_6 + CurrentTreasure_7 + CurrentTreasure_8 === 0) {
                return true;
            }
            finalOutput();
        }
        */
}

function isEndStage() {
    if (CurrentTreasure_5 + CurrentTreasure_6 + CurrentTreasure_7 + CurrentTreasure_8 === 0) {
        return true;
    }

    var userX = CurrentUserPos[0];
    var userY = CurrentUserPos[1];

    if ((userX > 0 && GridMap[userX - 1][userY] !== VAL_OBSTACLE) ||
        (userX < 9 && GridMap[userX + 1][userY] !== VAL_OBSTACLE) ||
        (userY > 0 && GridMap[userX][userY - 1] !== VAL_OBSTACLE) ||
        (userY < 9 && GridMap[userX][userY + 1] !== VAL_OBSTACLE)) {
        return false;
    }

    return true;
}

function placeObstacleRandomly() {
    var emptyPositions = [];

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if (GridMap[i][j] === 0) {
                emptyPositions.push([i, j]);
            }
        }
    }

    if (emptyPositions.length > 0) {
        var randomIndex = Math.floor(Math.random() * emptyPositions.length);
        var [randomX, randomY] = emptyPositions[randomIndex];
        GridMap[randomX][randomY] = VAL_OBSTACLE;
        placeObject("obstacle", randomX, randomY);
    }
}

// Function to handle placing objects at various places

function placeObject(obj, posX, posY) {
    var objectImg = document.createElement("IMG");
    objectImg.setAttribute("src", "images_game/" + obj + ".png");

    var objectDiv = document.createElement("DIV");
    objectDiv.setAttribute("class", "objectdiv");
    if (obj == "hunter") {
        objectDiv.setAttribute("id", "user");
    }
    if (obj.startsWith("treasure")) {
        objectDiv.setAttribute("id", "treasure" + posX + posY);
    }
    if (obj == "obstacle") {
        objectDiv.setAttribute("id", "obstacle" + posX + posY);
    }
    objectDiv.style.left = posX * 64 + "px";
    objectDiv.style.top = posY * 64 + "px";
    objectDiv.appendChild(objectImg);

    cField.appendChild(objectDiv);
}
/////////////////////////////////////////////////////////////
////////////////    Game status display  ////////////////////
/////////////////////////////////////////////////////////////

// update playing info
function updateStatus() {
    nScoreUser.innerHTML = CurrentUserScore;
    nTreasure5.innerHTML = Math.max(CurrentTreasure_5);
    nTreasure6.innerHTML = Math.max(CurrentTreasure_6);
    nTreasure7.innerHTML = Math.max(CurrentTreasure_7);
    nTreasure8.innerHTML = Math.max(CurrentTreasure_8);
    nRounds.innerHTML = CurrentRound;
}

// show alert info in the field
function showAlert(msg, duration) {
    var alertDiv = document.createElement("DIV");
    var alertText = document.createTextNode(msg);
    alertDiv.appendChild(alertText);
    alertDiv.setAttribute("class", "alerting");
    alertDiv.setAttribute("id", "alert");
    cWrapGame.appendChild(alertDiv);

    setTimeout(function () {
        var alertDiv = document.getElementById("alert");
        cWrapGame.removeChild(alertDiv);
    }, duration);
}

// show hint info over the field

function showHint(msg, duration, xPixel, yPixel){
    if (xPixel === undefined || yPixel === undefined){
        xPixel = SelectedLeft;
        yPixel = SelectedTop;
    }

    var hintDiv = document.createElement("DIV");
    var hintText = document.createTextNode(msg);
    hintDiv.appendChild(hintText);
    hintDiv.setAttribute("class", "hintdiv");
    hintDiv.setAttribute("id", "hint"+duration);

    var offset = xPixel;
    if (offset + 300 >= 640){
        offset = 340;
    }
    hintDiv.style.left = offset + "px";

    offset = yPixel;
    if (offset + 64 >= 640){
        offset = offset - 64;
    }
    else{
        offset = offset + 64;
    }
    hintDiv.style.top = offset + "px";
    cField.appendChild(hintDiv);

    setTimeout(function () {
        var hintDiv = document.getElementById("hint"+duration);
        if (hintDiv) {
            cField.removeChild(hintDiv);
        }
    }, duration);
}
/////////////////////////////////////////////////////////////
////////////////    Game Field Configuration  ///////////////
/////////////////////////////////////////////////////////////


// field click callback
function fieldClick() {
    var selectedDiv = document.getElementById("selected");
    if (selectedDiv) {
        SelectedLeft = parseInt(selectedDiv.style.left.split("px")[0]);
        SelectedTop = parseInt(selectedDiv.style.top.split("px")[0]);

        // check whether it's already been set
        if (GridMap[SelectedLeft / 64][SelectedTop / 64] != 0) {
            showHint(HINT_OCCUPIED, HINT_OCCUPIED_T);
            return;
        }

        cField.removeEventListener("mousemove", fieldMouseOver);
        cField.removeEventListener("click", fieldClick);

        selectedDiv.style.borderColor = "red";

        // create a hint window
        showHint(HINT_SETUP, HINT_SETUP_T);
        window.addEventListener("keydown", fieldConfig);
    }
}

// configure the playing field
function fieldConfig(event) {
    var hasProcessed = false;

    // place an object
    if (event.key >= "5" && event.key <= "8"){
        var posX = SelectedLeft/64;
        var posY = SelectedTop/64;
        GridMap[posX][posY] = event.key;
        TreasureCount += 1;
        placeObject("treasure-" + event.key, posX, posY);
        hasProcessed = true;

        switch (event.key) {
            case "5":
                CurrentTreasure_5++;
                break;
            case "6":
                CurrentTreasure_6++;
                break;
            case "7":
                CurrentTreasure_7++;
                break;
            case "8":
                CurrentTreasure_8++;
                break;
            default:
                break;
        }
    }
    else{
        switch(event.key){
            case "Escape":
                hasProcessed = true;
                break;

                case "o":
                    var posX = SelectedLeft / 64;
                    var posY = SelectedTop / 64;
                    GridMap[posX][posY] = VAL_OBSTACLE;
                    placeObject("obstacle", posX, posY);
                    hasProcessed = true;
                    break;
    
                case "h":
                    var posX = SelectedLeft / 64;
                    var posY = SelectedTop / 64;
                    if (CurrentUserPos.length == 0) {
                        GridMap[posX][posY] = -2;
                        CurrentUserPos.push(posX);
                        CurrentUserPos.push(posY);
                        placeObject("hunter", posX, posY);
                        hasProcessed = true;
                    } else {
                        showHint(HINT_ALREADY_SET, HINT_ALREADY_SET_T);
                    }
                    break;
        }
    }

    // Has been processed
    if (hasProcessed){
        // remove hint & selected div
        removeBorderDiv();

        // remove listener
        window.removeEventListener("keydown", fieldConfig);

        // add listeners
        cField.addEventListener("mousemove", fieldMouseOver);
        cField.addEventListener("click", fieldClick);
    }
}

// remove alert info div and selected div
function removeBorderDiv() {
    var child = document.getElementById("hint"+HINT_SETUP_T);
    if (child != null ){
        cField.removeChild(child);
    }
    child = document.getElementById("hint"+HINT_ALREADY_SET_T);
    if (child != null ){
        cField.removeChild(child);
    }
    child = document.getElementById("hint"+HINT_CONTROL_KEYS_T);
    if (child != null ){
        cField.removeChild(child);
    }
    child = document.getElementById("hint"+HINT_PLACE_KEYS_T);
    if (child != null ){
        cField.removeChild(child);
    }
    child = document.getElementById("hint"+HINT_OCCUPIED_T);
    if (child != null ){
        cField.removeChild(child);
    }

    child = document.getElementById("selected");
    if (child != null ){
        cField.removeChild(child);
    }
}

// track mouse move and select the grid it belongs to
function fieldMouseOver(event) {
    var child = document.getElementById("selected");
    if (child != null){
        cField.removeChild(child);
    }

    // create a shadowing div
    var rect = cField.getBoundingClientRect();
    var xOffset = Math.floor((event.pageX - rect.left)/64) * 64;
    var yOffset = Math.floor((event.pageY - rect.top)/64) * 64;
    var borderDiv = document.createElement("DIV");
    borderDiv.setAttribute("class", "borderdiv");
    borderDiv.setAttribute("id", "selected");
    borderDiv.style.left = xOffset + "px";
    borderDiv.style.top = yOffset + "px";

    cField.appendChild(borderDiv);
}

function finalOutput() {
    // game over flag
    IsRunning = 1;

    window.removeEventListener("keydown", controlHunter);

    cButton.innerHTML = "SETUP";

    updateStatus();

    var performanceIndex = 0;
    if (CurrentRound > 0) {
        performanceIndex = (CurrentUserScore / CurrentRound).toFixed(2);
    }

    var finalMessage = "Performance Index: " + performanceIndex;
    showAlert(finalMessage, 5000);
}

//////////////////  THE END   ///////////////////////////////
