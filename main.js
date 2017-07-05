var btnShow = document.getElementById("show-calc"),
    clearCalc = document.getElementById("clear-calc"),
    stateBtn = document.getElementById("get-state"),
    hideBtn = document.getElementById("hide-calc"),
    getPos = document.getElementById("get-pos"),
    small = document.getElementById("small"),
    medium = document.getElementById("medium"),
    large = document.getElementById("large");



var BasicCalculator = new calculator.LoadCalculator();
btnShow.addEventListener("click", BasicCalculator.showCalculator.bind(BasicCalculator), false);
clearCalc.addEventListener("click", BasicCalculator.clearCalculator.bind(BasicCalculator), false);

stateBtn.addEventListener("click", function () {
    var state = BasicCalculator.getDisplayState(),
        pos = BasicCalculator.getPosition();
    console.log(state);
}, false);

hideBtn.addEventListener("click", function () {
    BasicCalculator.hideCalculator();
}, false);

getPos.addEventListener("click", function () {
    var pos = BasicCalculator.getPosition();
    console.log(pos);
}, false);

small.addEventListener("click", function () {
   BasicCalculator.setSize("small");
}, false);
medium.addEventListener("click", function () {
    BasicCalculator.setSize("medium");
}, false);
large.addEventListener("click", function () {
    BasicCalculator.setSize("large");
}, false);
