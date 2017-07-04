"use strict";
import operator from "./calculatorConfig";
export default class Calculator {

    constructor(displayResultDiv, displayEqnDiv) {
        this._result = '0';
        this._displayResultDiv = displayResultDiv;
        this._displayEqnDiv = displayEqnDiv;
        this._eqnArr = [];
        this._isOperatorInserted = false;
        this._isResultUndefined = false;
        this._isEqualPressed = false;
        this._resultLimit = false;
    }

    /*--------- Set value to calculate --------------*/
    setValue(val) {
        if (this._isResultUndefined || (val === "." && this._result.indexOf(".") > -1) || this._resultLimit) {
            return;
        }
        if (this._isEqualPressed) {
            this._result = val;
            this._renderResult();
            this._isOperatorInserted = false;
            this._isEqualPressed = false;
            return;
        }
        if (!this._eqnArr.length || !this._isOperatorInserted) {
            this._result = (this._result === '0') ? '' + val : this._result + val;
        } else {
            this._result = val;
        }
        this._renderResult();
        this._isOperatorInserted = false;
        this._isEqualPressed = false;
        if (this._result.length === this._restrictResult()) {
            this._resultLimit = true;
        }
    }

    _restrictResult() {
        return (this._result.indexOf(".") !== -1 || this._result.indexOf("-") !== -1) ? (this._result.indexOf(".") !== -1 && this._result.indexOf("-") !== -1) ? 12 : 11 : 10;
    }

    _readResult() {
        let self = this;
        self._displayResultDiv.setAttribute("tabindex", 0);
        self._displayResultDiv.focus();
        $(self._displayResultDiv).off("focusout").on("focusout", () => {
            $("[value='=']").focus();
            self._displayResultDiv.removeAttribute("tabindex");
        });
    }

    _renderResult() {
        if (this._result.length === this._restrictResult()) {
            this._result = this._result.slice(0, this._restrictResult());
        }
        this._displayResultDiv.innerHTML = this._result;
    }

    _evalResult() {
        let numbers,
            operators,
            result;
        if (this._eqnArr[this._eqnArr.length - 1] === '0' &&
            this._eqnArr[this._eqnArr.length - 2] &&
            this._eqnArr[this._eqnArr.length - 2] === '/') {
            this._result = 'Can not divide by zero';
            this._displayResultDiv.innerHTML = this._result;
            this._isResultUndefined = true;
            return;
        }
        numbers = this._eqnArr.filter((v, i) => {
            return !(i % 2);
        });
        operators = this._eqnArr.filter((v, i) => {
            return i % 2;
        });

        result = numbers[0];

        for (let i = 0; i < operators.length; i++) {
            result = eval(result + operators[i] + numbers[i + 1]);
        }
        this._result = String(result);
        this._resultLimit = false;
        if (this._result.length > this._restrictResult()) {
            this._result = this._result.slice(0, this._restrictResult());
        }
        this._displayResultDiv.innerHTML = this._result;
    }

    _renderEqn() {
        this._displayEqnDiv.innerHTML = this._eqnArr.join(" ").replace(/\//g, "&divide").replace(/\*/g, "&times");
        this._checkOverflow();
    }

    _checkOverflow() {
        if (this._displayEqnDiv.innerText.length * 7.5 > this._displayResultDiv.offsetWidth) {
            this._displayEqnDiv.parentElement.querySelector(".seekLeft").style.display = 'inline-block';
        }
    }

    /*--------- Set operator sign to calculate --------------*/
    setSign(sign) {
        if (this._isResultUndefined) {
            return;
        }
        if (this._isOperatorInserted) {
            this._eqnArr[this._eqnArr.length - 1] = sign;
            this._renderEqn();
            this._isEqualPressed = false;
        } else {
            this._eqnArr.push(
                this._result.indexOf("-") > -1 ? "(" + this._result + ")" : this._result
            );
            this._evalResult();
            this._eqnArr.push(sign);
            this._renderEqn();
            this._isOperatorInserted = true;
            this._isEqualPressed = true;
        }
    }

    /*------------------- Clear recent display data --------------------*/
    clearData(cleartype) {
        if (cleartype === 'c') {
            this._resetArrows();
            this._result = '0';
            this._eqnArr = [];
            this._renderEqn();
            this._renderResult();
            this._isResultUndefined = false;
        } else if (cleartype === "bs") {
            if (this._result === '0' || this._isEqualPressed || this._isResultUndefined) {
                return;
            }
            this._result = this._result.slice(0, -1);
            if (this._result.length === 0) {
                this._result = '0'
            }
            this._renderResult();
        } else if (cleartype === "ce") {
            this._result = '0';
            this._renderResult();
            this._isResultUndefined = false;
        } else {
            console.info("invalid clear type");
        }

    }

    _resetArrows() {
        this._displayEqnDiv.parentElement.querySelector(".seekLeft").style.display = "none";
        this._displayEqnDiv.parentElement.querySelector(".seekRight").style.display = "none";
        this._displayEqnDiv.style.right = "0px";
    }

    getResult() {
        if (this._isResultUndefined) {
            return;
        }
        this._eqnArr.push(
            this._result.indexOf("-") > -1 ? "(" + this._result + ")" : this._result
        );
        this._evalResult();
        this._eqnArr = [];
        this._renderEqn();
        this._isOperatorInserted = false;
        this._isEqualPressed = true;
        this._readResult();
        this._resetArrows();
    }

    negateValue() {
        if (this._result === '0' || this._isResultUndefined) {
            return;
        }
        this._result = String(+(this._result) * -1);
        this._renderResult();
    }
}
