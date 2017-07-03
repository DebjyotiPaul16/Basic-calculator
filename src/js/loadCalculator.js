import CalculatorManger from "./calculatorManager.js";
import Calculator from "./calculator.js";

export default class LoadCalculator {
    constructor() {
        this._arrCount = 0;
        this._firstTimeOpen = true;
        this._calcManager = null;
        this._top = null;
        this._left = null;
        this._depArr = [{
            'jQuery': 'https://code.jquery.com/jquery-1.12.4.min.js'
        }, {
            'jQuery-ui': 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js'
        }, {
            'jQuery-support-touch': 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js'
        }];
        this._loadDependencyAndCreate();
    }

    _loadDependencyAndCreate() {
        var self = this;
        if (this._arrCount < this._depArr.length) {
            for (var x in this._depArr[this._arrCount]) {
                var arrDep = x.split("-");
                var objDep = window;
                for (var i = 0; i < arrDep.length; i++) {
                    objDep = objDep[arrDep[i]];
                    if (typeof objDep === "undefined") {
                        var headTag = document.getElementsByTagName("head")[0];
                        var jqTag = document.createElement('script');
                        jqTag.type = 'text/javascript';
                        jqTag.src = this._depArr[this._arrCount][x];
                        headTag.appendChild(jqTag);
                        this._arrCount++;
                        jqTag.onload = self._loadDependencyAndCreate.bind(self);
                        break;
                    }
                }
                if (typeof objDep !== "undefined") {
                    this._arrCount++;
                    self._loadDependencyAndCreate();
                }
            }
        } else {
            self._createCalculator();
            this._moveCalculator();
            this._calcManager.calcElem.css("display", "none");
            this.validateLocation(100, 100);

        }
    }

    _createCalculator() {
        this._calcManager = new CalculatorManger();
        this._calcManager.createCalculator();
    }

    clearCalculator() {
        this._calcManager.calcobj.clearData("c");
    }

    validateLocation(top, left) {
        let calc = $(this._calcManager.calcElem),
            calcWidth = calc.width(),
            calcHeight = calc.height(),
            windowWidth = $('body').offset().left + $('body').width(),
            windowHeight = $('body').offset().top + $('body').height();

        if (left + calcWidth < windowWidth && top + calcHeight < windowHeight) {
            console.log("open");
            this._top = top;
            this._left = left;
            calc.css({
                "top": top + "px",
                "left": left + "px"
            });
        } else {
            console.log("dont open");
        }
    }

    _hasValidParent(target) {
        if (target === null) {
            return false;
        } else if (target.id && target.id === this._calcManager.calcElem[0].id) {
            return true;
        } else {
            //what is this
            return true && this._hasValidParent(target.parentElement);
        }
    }

    _moveCalculator() {
        let self = this,
            keyMap = {
                'up': 38,
                'down': 40,
                'left': 37,
                'right': 39
            },
            calc = $(this._calcManager.calcElem);
        $(document).off("keydown").on("keydown", function(e) {

            var calcWidth = self._calcManager.calcElem.width(),
                calcHeight = self._calcManager.calcElem.height(),
                calcPosX = parseFloat(self._calcManager.calcElem.css('left')),
                calcPosY = parseFloat(self._calcManager.calcElem.css('top')),
                windowWidth = $('body').offset().left + $('body').width(),
                windowHeight = $('body').offset().top + $('body').height(),
                canMoveCalculator = self._hasValidParent(e.target);
            switch (e.which) {
                case keyMap.left: // left
                    if (calcPosX - 20 > -calcWidth / 2 &&
                        calcPosY + calcHeight < windowHeight + calcHeight / 2 &&
                        canMoveCalculator) {
                        calc.css('left', calc.offset().left - 20);
                    }
                    break;
                case keyMap.up: // up
                    if (calcPosX + calcWidth < windowWidth + calcWidth / 2 &&
                        calcPosY - 20 > -calcHeight / 2 &&
                        canMoveCalculator) {
                        calc.css('top', calc.offset().top - 20);
                    }
                    break;
                case keyMap.right: // right
                    if (calcPosX + 20 + calcWidth < windowWidth + calcWidth / 2 &&
                        calcPosY + calcHeight < windowHeight + calcHeight / 2 &&
                        canMoveCalculator) {
                        calc.css('left', calc.offset().left + 10);
                    }
                    break;
                case keyMap.down: //down
                    if (calcPosX + calcWidth < windowWidth + calcWidth / 2 &&
                        calcPosY + 20 + calcHeight < windowHeight + calcHeight / 2 &&
                        canMoveCalculator) {
                        calc.css('top', calc.offset().top + 10);
                    }
                    break;
            }
        })
    }



    // TODO needs to be changed

    getElements() {
        var items = $('[aria-label]'),
            text = "";
        for (var i = 0; i < items.length; i++) {
            text += items[i].getAttribute("aria-label");
            text += " button ";
        }
        return text;
    }

    // TODO needs to be changed

    showCalculator() {
        var self = this;
        if (!!this._calcManager) {
            if (this._top && this._left) {
                this.validateLocation(this._top, this._left);
            }
            this._calcManager.handleWithKeyboard(this._calcManager.calcobj);
            this._calcManager.calcElem.css("display", "block");
            this._calcManager.calcElem.find("#calc_state")[0].removeAttribute("aria-hidden");
            this._calcManager.calcElem.find("#calc_state")[0].setAttribute("tabindex", "0");
            this._calcManager.calcElem.find("#calc_state")[0].innerText = "Calculator Maximized ";
            this._calcManager.calcElem.find("#calc_state").focus();
            setTimeout(function() {
                self._calcManager.calcElem.find("#calc_state")[0].setAttribute("aria-hidden", "true");
                self._calcManager.calcElem.find("#calc_state")[0].removeAttribute("tabindex");
                self._calcManager.calcElem.focus();
                if (self._firstTimeOpen) {
                    self._firstTimeOpen = false;
                } else {
                    setTimeout(function() {
                        self._calcManager.calcElem.find('[aria-label="minimize"]').focus();
                    }, 400);
                }
            }, 400);

        } else {
            console.error("not possible to open calculator");
        }
    }
}

window.calculator = (function() {
    return {
        loadCalculator: LoadCalculator
    }
}());
