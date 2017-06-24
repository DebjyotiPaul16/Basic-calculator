import CalculatorManger from "./calculatorManager.js";
import Calculator from "./calculator.js";

export default class LoadCalculator {
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
            this.moveCalculator();
        }
    }

    createCalculator() {
        this.calcManager = new CalculatorManger();
        this.calcManager.createCalculator();
    }

    clearCalculator() {
        this.basicCalculator.calcManager.calcobj.clearData("c");
    }

    hideCalculator() {
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
        if(!!this.basicCalculator){
            this.basicCalculator.calcManager.calcElem.css("display","block");
        }else {
            this.basicCalculator = new LoadCalculator();
            this.basicCalculator.loadDependencyAndCreate();
        }

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

    hasValidParent(target) {
        if (target === null) {
            return false;
        } else if (target.id && target.id === "drag") {
            return true;
        } else {
            return true && this.hasValidParent(target.parentElement);
        }
    }

    moveCalculator() {
        var self = this,
            keyMap = {
                'up': 38,
                'down': 40,
                'left': 37,
                'right': 39
            };
        $(document).off("keydown").on("keydown", function(e) {

            var calcWidth = $("#drag").width(),
                calcHeight = $("#drag").height(),
                calcPosX = parseFloat($("#calculator").css('left')),
                calcPosY = parseFloat($("#calculator").css('top')),
                windowWidth = $(window).innerWidth(),
                windowHeight = $(window).innerHeight(),
                canMoveCalculator = self.hasValidParent(e.target);
            switch (e.which) {
                case keyMap.left: // left
                    if (calcPosX - 20 > 10 && calcPosY + calcHeight < windowHeight && canMoveCalculator) {
                        $("#calculator").css('left', $("#calculator").offset().left - 20);
                    }
                    break;
                case keyMap.up: // up
                    if (calcPosX + calcWidth < windowWidth && calcPosY - 20 > 10 && canMoveCalculator) {
                        $("#calculator").css('top', $("#calculator").offset().top - 20);
                    }
                    break;
                case keyMap.right: // right
                    if (calcPosX + 20 + calcWidth < windowWidth && calcPosY + calcHeight < windowHeight && canMoveCalculator) {
                        $("#calculator").css('left', $("#calculator").offset().left + 10);
                    }
                    break;
                case keyMap.down: //down
                    if (calcPosX + calcWidth < windowWidth && calcPosY + 20 + calcHeight < windowHeight && canMoveCalculator) {
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
