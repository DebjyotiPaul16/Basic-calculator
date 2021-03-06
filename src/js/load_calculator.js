import CalculatorManger from "./calculator_manager.js";

export default class LoadCalculator {
    constructor(dom) {
        this._arrCount = 0;
        this._firstTimeOpen = true;
        this._calcManager = null;
        this._top = null;
        this._left = null;
        this._calcPosition = null;
        this._isCreated = false;
        this.retryCount = 0;
        this.maxRetry = 10;
        this._dom = dom;
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
                    self._loadDependencyAndCreate(self._dom);
                }
            }
        } else {
            self._createCalculator(self._dom);
            this._moveCalculator();
            this._calcManager.calcElem.css("display", "none");
            this._isCreated = true;
        }
    }

    _createCalculator(dom) {
        this._calcManager = new CalculatorManger();
        this._calcManager.createCalculator(dom);
    }

    getDisplayState() {
        return this._calcManager.calcElem.css('display') !== 'none';
    }

    clearCalculator() {
        this._calcManager.calcobj.clearData("c");
    }

    setSize(size) {
        this._calcManager.calcElem.find("#drag").attr("class", size);
        this.setPosition();
        this._calcManager._getElement("#disp_eqn",true).focus();
    }

    hideCalculator() {
        this._calcManager.closeCalculator();
    }

    getCalculatorValue() {
        return this._calcManager.calcobj._result.replace(/^<span style="font-size: 65%">(.*)<\/span>$/, "$1");
    }

    getPosition() {
        return this._calcManager.calcElem.offset();
    };

    getCalculatorDom() {
        return this._calcManager.calcElem;
    }

    setPosition(cssObj) {
        let calc = $(this._calcManager.calcElem),
            calcWidth = calc.width(),
            calcHeight = calc.height(),
            windowWidth = $('body').offset().left + $('body').width(),
            windowHeight = $('body').offset().top + $('body').height(),
            css = {left: 0, top: 0};
        
        if(cssObj && (((!cssObj.left && cssObj.left !== 0) && (!cssObj.right && cssObj.right !== 0))
            || ((!cssObj.top && cssObj.top !== 0) && (!cssObj.bottom && cssObj.bottom !== 0)))){
            throw new Error("Invalid arguments");
        }
        
        if (!!cssObj) {
            if (cssObj.right !== null && cssObj.right !== undefined) {
                css.left = windowWidth - calcWidth - cssObj.right;
            } else {
                css.left = cssObj.left;
            }
            if (cssObj.bottom !== null && cssObj.bottom !== undefined) {
                css.top = windowHeight - calcHeight - cssObj.bottom;
            } else {
                css.top = cssObj.top;
            }
        } else {
            css = !!this._calcPosition ? this._calcPosition : {left: 0, top: 0};
        }
        
        this._calcPosition = !!this._calcPosition ? this._calcPosition : css;
        calc.css(css);
    }

    _hasValidParent(target) {
        if (target === null) {
            return false;
        }
        if (target.id && target.id === this._calcManager.calcElem.get(0).id) {
            return true;
        }
        return this._hasValidParent(target.parentElement);
    }

    _getMovementDirection(e) {
        let direction,
            keyMap = {
                'left': 37,
                'up': 38,
                'right': 39,
                'down': 40
            };
        if (e.which === keyMap.left || e.ctrlKey && e.which === 188) {
            direction = "left";
        } else if (e.which === keyMap.up || e.ctrlKey && e.which === 77) {
            direction = "up";
        } else if (e.which === keyMap.right || e.ctrlKey && e.which === 190) {
            direction = "right";
        } else if (e.which === keyMap.down || e.ctrlKey && e.which === 191) {
            direction = "down";
        }
        return direction;
    }

    _moveCalculator() {
        let self = this,
            calc = $(this._calcManager.calcElem),
            calcWidth = calc.width(),
            calcHeight = calc.height(),
            windowWidth = $('body').offset().left + $('body').width(),
            windowHeight = $('body').offset().top + $('body').height();

        calc.off("keydown").on("keydown", function (e) {
            let calcPosX = calc.css('left') === "auto" ? 0 : parseFloat(calc.css('left')),
                calcPosY = calc.css('top') === "auto" ? 0 : parseFloat(calc.css('top')),
                canMoveCalculator = self._hasValidParent(e.target),
                direction = self._getMovementDirection(e);
            switch (direction) {
                case "left": // left
                    e.preventDefault();
                    if (calcPosX - 20 > -calcWidth / 2 &&
                        calcPosY + calcHeight < windowHeight + calcHeight / 2 &&
                        canMoveCalculator) {
                        calc.css('left', calc.offset().left - 20);
                    }
                    break;
                case "up": // up
                    e.preventDefault();
                    if (calcPosX + calcWidth < windowWidth + calcWidth / 2 &&
                        calcPosY - 20 > -calcHeight / 2 &&
                        canMoveCalculator) {
                        calc.css('top', calc.offset().top - 20);
                    }
                    break;
                case "right": // right
                    e.preventDefault();
                    if (calcPosX + 20 + calcWidth < windowWidth + calcWidth / 2 &&
                        calcPosY + calcHeight < windowHeight + calcHeight / 2 &&
                        canMoveCalculator) {
                        calc.css('left', calc.offset().left + 10);
                    }
                    break;
                case "down": //down
                    e.preventDefault();
                    if (calcPosX + calcWidth < windowWidth + calcWidth / 2 &&
                        calcPosY + 20 + calcHeight < windowHeight + calcHeight / 2 &&
                        canMoveCalculator) {
                        calc.css('top', calc.offset().top + 10);
                    }
                    break;
            }
        })
    }

    _getAllLabels() {
        let label = [];
        this._calcManager.calcElem.find("[aria-label]").each(function (index, elem) {
            if (elem.getAttribute("role") === "button") {
                label.push($(elem).attr("aria-label") + " button");
            } else {
                label.push($(elem).attr("aria-label"));
            }
        });
        return label.join(" ");
    }

    showCalculator() {
        var self = this;
        if (!!this._calcManager) {
            this._calcManager._calcInitialOpen = true;

            if (this._calcPosition !== null) {
                this.setPosition(this._calcPosition);
            }
            this._calcManager.handleWithKeyboard(this._calcManager.calcobj);
            this._calcManager.calcElem.css("display", "block");
            this._calcManager.calcElem.find("#calc_state").get(0).removeAttribute("aria-hidden");
            this._calcManager.calcElem.find("#calc_state").get(0).setAttribute("tabindex", "0");
            this._calcManager.calcElem.find("#calc_state").get(0).innerHTML = "Calculator Maximized ";
            this._calcManager.calcElem.find("#calc_state").focus();
            setTimeout(function () {
                self._calcManager.calcElem.find("#calc_state").get(0).setAttribute("aria-hidden", "true");
                self._calcManager.calcElem.find("#calc_state").get(0).removeAttribute("tabindex");
                self._calcManager.calcElem.find("#calc_state").css("display", "none");
                self._calcManager.calcElem.attr("aria-label", self._getAllLabels());
                self._calcManager.calcElem.focus();
                setTimeout(function () {
                    self._calcManager.calcElem.find("#disp_eqn").focus();
                    self._calcManager.calcElem.attr("aria-label", "");
                    if (self._firstTimeOpen) {
                        self._firstTimeOpen = false;
                    }
                }, 800);
            }, 600);

        } else {
            if (!this._isCreated && this.retryCount < this.maxRetry) {
                this.retryCount++;
                setTimeout(this.showCalculator.bind(this), 1000);
            } else {
                console.error("not possible to open calculator");
            }

        }
    }
}

window.Calculator = (function () {
    return {
        createCalculator: LoadCalculator
    }
}());
