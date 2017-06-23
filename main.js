var btn = document.getElementById("close-calc");
var btnShow = document.getElementById("show-calc");
var clearCalc = document.getElementById("clear-calc");
var spawnCalc = document.getElementById("spawn-calc");


var BasicCalculator = new calculator.loadCalculator();
// BasicCalculator.loadDependencyAndCreate();
btn.addEventListener("click", BasicCalculator.hideCalculator.bind(BasicCalculator), false);
btnShow.addEventListener("click", BasicCalculator.showCalculator.bind(BasicCalculator), false);
clearCalc.addEventListener("click", BasicCalculator.clearCalculator.bind(BasicCalculator), false);
spawnCalc.addEventListener("click", function() {
    BasicCalculator.moveCalculator();
    BasicCalculator.validateLocation(100, 100);
});
