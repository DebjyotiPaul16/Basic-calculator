var btnShow = document.getElementById("show-calc"),
    clearCalc = document.getElementById("clear-calc"),
    stateBtn = document.getElementById("get-state"),
    hideBtn = document.getElementById("hide-calc"),
    getPos = document.getElementById("get-pos"),
    small = document.getElementById("small"),
    medium = document.getElementById("medium"),
    large = document.getElementById("large"),
    setPos = document.getElementById("setPosition"),
    containerDom = document.getElementById("container");


var basicCalculator = new Calculator.createCalculator(containerDom);

btnShow.addEventListener("click", function () {
    // basicCalculator = new Calculator.createCalculator();
    basicCalculator.setPosition({top: 100, left: 100});
    basicCalculator.showCalculator();
    // setTimeout(function () {
    //     basicCalculator.setPosition({top: 100, left: 400});
    // },2000); // setTimeout(function () {
    //     basicCalculator.setPosition({top: 100, left: 400});
    // },2000);
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

setPos.addEventListener("click", function () {
    basicCalculator.setPosition({top: 100, left: 100});
    console.log(basicCalculator.getCalculatorDom());
}, false);
