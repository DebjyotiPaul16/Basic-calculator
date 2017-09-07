var btnShow = document.getElementById("show-calc"),
    clearCalc = document.getElementById("clear-calc"),
    stateBtn = document.getElementById("get-state"),
    hideBtn = document.getElementById("hide-calc"),
    getPos = document.getElementById("get-pos"),
    small = document.getElementById("small"),
    medium = document.getElementById("medium"),
    large = document.getElementById("large"),
    setPos = document.getElementById("setPosition");


var basicCalculator = new Calculator.createCalculator();

btnShow.addEventListener("click", function () {
    // basicCalculator = new Calculator.createCalculator();
    basicCalculator.showCalculator();
}, false);

clearCalc.addEventListener("click", function () {
    basicCalculator.clearCalculator();
}, false);

stateBtn.addEventListener("click", function () {
    var state = basicCalculator.getDisplayState(),
        pos = basicCalculator.getPosition();
    console.log(state);
}, false);

hideBtn.addEventListener("click", function () {
    basicCalculator.hideCalculator();
}, false);

getPos.addEventListener("click", function () {
    var pos = basicCalculator.getPosition();
    var val = basicCalculator.getCalculatorValue();
    console.log(pos, val);
}, false);

small.addEventListener("click", function () {
    basicCalculator.setSize("small");
}, false);
medium.addEventListener("click", function () {
    basicCalculator.setSize("medium");
}, false);
large.addEventListener("click", function () {
    basicCalculator.setSize("large");
}, false);

// setPos.addEventListener("click", function () {
//     basicCalculator.setPosition(100, 100);
// }, false);
