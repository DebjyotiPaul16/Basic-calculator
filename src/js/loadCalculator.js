import CalculatorManger from "./calculatorManager.js";
import Calculator from "./calculator.js";

export default class LoadCalculator{
    constructor() {
        this.isOpen = true;
        this.calcDiv = "";
        this.arrCount = 0;
        this.basicCalculator = null;
        this.calcManager = null;
        this.depArr = [{
            'jQuery': 'https://code.jquery.com/jquery-1.12.4.min.js'
        }, {
            'jQuery-ui': 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js'
        }, {
            'jQuery-support-touch': 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js'
        }];
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
        this.calcManager = new CalculatorManger();
        this.calcManager.createCalculator();
    }

    clearCalculator() {
        this.basicCalculator.calcManager.calcobj.clearData("c");
        console.log(this.basicCalculator.calcManager.calcElem.get(0));
    }

    hideCalculator() {
        console.log(this.calcManager);
        if (this.getCalculatorState()) {
            this.basicCalculator.calcManager.calcElem.get(0).remove();
        } else {
            alert("calculator is already hidden");
        }
    }

    getCalculatorState() {
        return !!this.basicCalculator.calcManager.calcElem.get(0);
    }

    showCalculator() {
        this.basicCalculator = new LoadCalculator();
        this.basicCalculator.loadDependencyAndCreate();
    }

    validateLocation(top, left) {
        var calcWidth = $("#calculator").width(),
            calcHeight = $("#calculator").height(),
            windowWidth = $(window).innerWidth(),
            windowHeight = $(window).innerHeight();

        if (left + calcWidth < windowWidth && top + calcHeight < windowHeight) {
            console.log("open");
            $("#calculator").css({
                "top": top + "px",
                "left": left + "px"
            });
        } else {
            console.log("dont open");
        }
    }



    moveCalculator() {

        $(document).on("keydown", function(e) {

            var calcWidth = $("#drag").width(),
                calcHeight = $("#drag").height(),
                calcPosX = parseFloat($("#calculator").css('left')),
                calcPosY = parseFloat($("#calculator").css('top')),
                windowWidth = $(window).innerWidth(),
                windowHeight = $(window).innerHeight();

            switch (e.which) {
                case 37: // up
                    if (calcPosX - 20 > 0 &&
                        calcPosY + calcHeight < windowHeight) {
                        $("#calculator").css('left', $("#calculator").offset().left - 20);
                    }
                    break;
                case 38: // left
                    if (calcPosX + calcWidth < windowWidth &&
                        calcPosY - 20 > 0) {
                        $("#calculator").css('top', $("#calculator").offset().top - 20);
                    }
                    break;
                case 39: // right
                    if (calcPosX + 10 + calcWidth < windowWidth &&
                        calcPosY + calcHeight < windowHeight) {
                        $("#calculator").css('left', $("#calculator").offset().left + 10);
                    }
                    break;
                case 40: //down
                    if (calcPosX + calcWidth < windowWidth &&
                        calcPosY + 10 + calcHeight < windowHeight) {
                        $("#calculator").css('top', $("#calculator").offset().top + 10);
                    }
                    break;
            }
        })
    }



}

window.calculator = (function() {
    return {
        loadCalculator: LoadCalculator
    }
}());
