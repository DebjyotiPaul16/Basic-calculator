import CalculatorManger from "./calculatorManager.js";
import Calculator from "./calculator.js";

export default class LoadCalculator {
    constructor() {
        this.arrCount = 0;
        this.firstTimeOpen = true;
        this.calcManager = null;
        this.top = null;
        this.left = null;
        this.depArr = [{
            'jQuery': 'https://code.jquery.com/jquery-1.12.4.min.js'
        }, {
            'jQuery-ui': 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js'
        }, {
            'jQuery-support-touch': 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js'
        }];
        this.loadDependencyAndCreate();

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
            this.calcManager.calcElem.css("display", "none");
            this.validateLocation(100, 100);

        }
    }

    createCalculator() {
        this.calcManager = new CalculatorManger();
        this.calcManager.createCalculator();
    }

    clearCalculator() {
        this.calcManager.calcobj.clearData("c");
    }


    showCalculator() {
			  var self=this;
        if (!!this.calcManager) {
            if (this.top && this.left) {
                this.validateLocation(this.top, this.left);
            }
            this.calcManager.handleWithKeyboard(this.calcManager.calcobj);
            this.calcManager.calcElem.css("display", "block");
            document.getElementById("calc_state").innerText = "calculator maximized";
            document.getElementById("calc_state").focus();
            setTimeout(function() {
                if (self.firstTimeOpen) {
                    self.calcManager.calcElem.focus();
                    self.firstTimeOpen = false;
                } else {
                    self.calcManager.calcElem.find('[aria-label="minimize"]').focus();
                }
            }, 500);

        } else {
            console.error("not possible to open calculator");
        }
    }

    validateLocation(top, left) {
        var calcWidth = $("#calculator").width(),
            calcHeight = $("#calculator").height(),
            windowWidth = $(window).innerWidth(),
            windowHeight = $(window).innerHeight();

        if (left + calcWidth < windowWidth && top + calcHeight < windowHeight) {
            console.log("open");
            this.top = top;
            this.left = left;
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
        } else if (target.id && target.id === this.calcManager.calcElem[0].id) {
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

            var calcWidth = self.calcManager.calcElem.width(),
                calcHeight = self.calcManager.calcElem.height(),
                calcPosX = parseFloat(self.calcManager.calcElem.css('left')),
                calcPosY = parseFloat(self.calcManager.calcElem.css('top')),
                windowWidth = $(window).innerWidth(),
                windowHeight = $(window).innerHeight(),
                canMoveCalculator = self.hasValidParent(e.target);
            switch (e.which) {
                case keyMap.left: // left
                    if (calcPosX - 20 > -calcWidth / 2 &&
                        calcPosY + calcHeight < windowHeight + calcHeight / 2 &&
                        canMoveCalculator) {
                        $("#calculator").css('left', $("#calculator").offset().left - 20);
                    }
                    break;
                case keyMap.up: // up
                    if (calcPosX + calcWidth < windowWidth + calcWidth / 2 &&
                        calcPosY - 20 > -calcHeight / 2 &&
                        canMoveCalculator) {
                        $("#calculator").css('top', $("#calculator").offset().top - 20);
                    }
                    break;
                case keyMap.right: // right
                    if (calcPosX + 20 + calcWidth < windowWidth + calcWidth / 2 &&
                        calcPosY + calcHeight < windowHeight + calcHeight / 2 &&
                        canMoveCalculator) {
                        $("#calculator").css('left', $("#calculator").offset().left + 10);
                    }
                    break;
                case keyMap.down: //down
                    if (calcPosX + calcWidth < windowWidth + calcWidth / 2 &&
                        calcPosY + 20 + calcHeight < windowHeight + calcHeight / 2 &&
                        canMoveCalculator) {
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
