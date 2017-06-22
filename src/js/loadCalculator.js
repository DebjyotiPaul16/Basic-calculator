import CalculatorManger from "./calculatorManager.js";
import Calculator from "./calculator.js";

export default class LoadCalculator extends Calculator{
    constructor() {
        super();
        this.isOpen = true;
        this.calcDiv = "";
        this.arrCount = 0;
        this.BasicCalculator = null;
        this.depArr = [{'jQuery': 'https://code.jquery.com/jquery-1.12.4.min.js'}, {'jQuery-ui': 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js'}, {'jQuery-support-touch': 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js'}];
    }

    loadDependencyAndCreate() {
        var self = this;
        if (this.arrCount < this.depArr.length) {
            for (var x in this.depArr[this.arrCount]) {
                var arrDep = x.split("-");
                var objDep = window;
                for (var i = 0; i < arrDep.length; i++) {
                    objDep = objDep[arrDep[i]];
                    if (typeof objDep === "undefined") {
                        var headTag = document.getElementsByTagName("head")[0];
                        var jqTag = document.createElement('script');
                        jqTag.type = 'text/javascript';
                        jqTag.src = this.depArr[this.arrCount][x];
                        headTag.appendChild(jqTag);
                        this.arrCount++;
                        jqTag.onload = self.loadDependencyAndCreate.bind(self);
                        break;
                    }
                }
                if (typeof objDep !== "undefined") {
                    this.arrCount++;
                    self.loadDependencyAndCreate();
                }
            }
        } else {
            self.createCalculator();
        }
    }

    createCalculator() {
        var calculatorManger = new CalculatorManger();
        calculatorManger.createCalculator();
    }
    clearCalculator(){
        this.BasicCalculator.clearData("ce").bind(this.BasicCalculator);
    }

    hideCalculator(){
        if(this.getCalculatorState()){
            document.getElementById("calculator").remove();
        }else {
            alert("calculator is already hidden");
        }
    }

    getCalculatorState(){
        return !!document.getElementById("calculator");
    }

    showCalculator(){
        this.BasicCalculator = new LoadCalculator();
        this.BasicCalculator.loadDependencyAndCreate();
    }

    showHideCalculator(){
        this.calcDiv = document.getElementById("simple-calculator");
        if(this.isOpen){
            this.calcDiv.setAttribute("hidden","true");
            this.isOpen = false;
        }else {
            this.showCalculator();
            this.calcDiv.removeAttribute("hidden");
            this.isOpen = true;
        }
    }
}

window.calculator = (function () {
    return{
        loadCalculator: LoadCalculator
    }
}());





