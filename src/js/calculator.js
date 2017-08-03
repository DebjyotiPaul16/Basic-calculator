"use strict";
export default class Calculator {

    constructor(displayResultDiv, displayEqnDiv) {
        this._result = '0';
        this._precision = 9;
        this._lastFocus = "";
        this._displayResultDiv = displayResultDiv;
        this._displayEqnDiv = displayEqnDiv;
        this._eqnArr = [];
        this._isOperatorInserted = false;
        this._isResultUndefined = false;
        this._isEqualPressed = false;
        this._resultLimit = false;
        // this._renderResult();
    }

    /* Get last element */
    _getLastElement() {
        return this._eqnArr[this._eqnArr.length - 1];
    }

    /*--------- Set value to calculate --------------*/
    setValue(val, e) {
        if ((this._isResultUndefined || (val === "." && this._result.indexOf(".") > -1) || this._resultLimit || this._restrictEqn()) && !this._isOperatorInserted && !this._isEqualPressed) {
            return;
        }
        if (this._shouldPopulateEquation(val)) {
            return;
        }
        if (this._isEqualPressed) {
            this._eqnArr = [];
        }
        if (!!this._eqnArr.length) {
            if (this._isOperatorInserted) {
                val === "." ? this._eqnArr.push("0" + val) : this._eqnArr.push(val);
            } else {
                this._eqnArr[this._eqnArr.length - 1] = this._eqnArr[this._eqnArr.length - 1] + val;
            }
        } else {
            val === "." ? this._eqnArr.push("0" + val) : this._eqnArr.push(val);
        }

        if (!this._eqnArr.length || !this._isOperatorInserted) {
            this._result = (this._result === '0' && val !== ".") ? '' + val : this._result + val;
        } else {
            this._result = val;
        }

        this._renderEqn();
        this._isOperatorInserted = false;
        this._isEqualPressed = false;
        if (this._result.length === this._restrictResult()) {
            this._resultLimit = true;
        }
    }

    _shouldPopulateEquation(val) {
        return (this._getLastElement() === "0" || this._getLastElement() === undefined) && val === "0";
    }

    _restrictEqn() {
        return this._eqnArr.join("").length === 23;
    }

    _restrictResult(value) {
        if (!!value) {
            return (value.indexOf(".") !== -1 || value.indexOf("-") !== -1) ? (value.indexOf(".") !== -1 && value.indexOf("-") !== -1) ? 12 : 11 : 10;
        } else {
            return (this._result.indexOf(".") !== -1 || this._result.indexOf("-") !== -1) ? (this._result.indexOf(".") !== -1 && this._result.indexOf("-") !== -1) ? 12 : 11 : 10;
        }

    }

    _renderResult() {
        this._displayResultDiv.innerHTML = this._result.length > this._restrictResult() ? this._roundup(this._result,this._precision) : this._result;
            // this._result.length > this._restrictResult() ? parseFloat(this._result).toFixed(this._precision) : this._result;
        this._lastFocus = document.activeElement;
        // this._readResult();
    }

    _evalResult() {
        let numbers,
            operators,
            result;
        if ((this._eqnArr[this._eqnArr.length - 1] === '0' || parseFloat(this._eqnArr[this._eqnArr.length - 1]) === 0) &&
            this._eqnArr[this._eqnArr.length - 2] &&
            this._eqnArr[this._eqnArr.length - 2] === '/') {
            this._result = 'Cannot divide by zero';
            this._displayResultDiv.innerHTML = this._result;
            this._isResultUndefined = true;
            return;
        }

        this._eqnArr = this._isOperatorInserted ? this._eqnArr.slice(0, -1) : this._getLastElement().length === 0 ? this._eqnArr.slice(0, -2) : this._eqnArr;
        result = eval(this._eqnArr.join(" "));

        this._result = String(result);
        this._resultLimit = false;
        if (this._result.length > this._restrictResult()) {
            this._displayResultDiv.innerHTML = this._roundup(this._result, this._precision);
        } else {
            this._displayResultDiv.innerHTML = this._result.slice(0, this._restrictResult());
        }
        this._lastFocus = document.activeElement;
        // this._readResult();
    }

    _roundup(value, precision) {
        if (value.indexOf(".") !== -1) {
            if (value.indexOf("e") !== -1) {
                return parseFloat(parseFloat(eval(value)).toFixed(precision)).toExponential(this._precision).toString();
            } else {
                return parseFloat(parseFloat(eval(value)).toFixed(precision)).toString().slice(0, this._restrictResult(value));
            }
        } else {
            return parseFloat(parseFloat(eval(value)).toFixed(precision)).toExponential(this._precision).toString();
        }
    }

    _renderEqn() {
        let self = this;
        let revisedEqnArr = [];
        this._eqnArr.forEach(function (i) {
            parseFloat(i) && i.indexOf(".") > -1 && i[i.length - 1] !== "." ? revisedEqnArr.push(self._roundup(i, self._precision)) :
                (i.length > self._precision * 2 ? revisedEqnArr.push(parseInt(i).toExponential(self._precision)) : revisedEqnArr.push(i));
        });
        this._displayEqnDiv.innerHTML = revisedEqnArr.join(" ").replace(/\//g, "&divide").replace(/\*/g, "&times");
        this._checkOverflow();
    }

    _checkOverflow() {
        if (this._displayEqnDiv.innerHTML.length * 7.5 > this._displayResultDiv.offsetWidth) {
            this._displayEqnDiv.parentElement.querySelector(".seekLeft").style.display = 'inline-block';
            this._displayEqnDiv.parentElement.querySelector(".seekLeft").setAttribute("aria-label", "Left");
        }
    }

    /*--------- Set operator sign to calculate --------------*/
    setSign(sign) {
        if (this._isResultUndefined || this._restrictEqn()) {
            return;
        }
        if (this._isEqualPressed) {
            this._eqnArr = [];
            this._eqnArr.push(this._result);
            this._eqnArr.push(sign);
            this._isOperatorInserted = true;
            this._renderEqn();
            this._isEqualPressed = false;
            return;
        }
        if (this._isOperatorInserted) {
            this._eqnArr[this._eqnArr.length - 1] = sign;
            this._renderEqn();
            this._isEqualPressed = false;
        } else {
            if (this._eqnArr.length === 0) {
                this._eqnArr.push(
                    this._result.indexOf("-") > -1 ? "(" + this._result + ")" : this._result
                );
            }
            //this._evalResult();
            this._eqnArr.push(sign);
            this._renderEqn();
            this._isOperatorInserted = true;
            this._resultLimit = false;
            // this._isEqualPressed = true;
        }
    }

    /*------------------- Clear recent display data --------------------*/
    clearData(cleartype) {
        if (cleartype === 'c') {
            // this._resetArrows();
            this._result = '0';
            this._eqnArr = [];
            this._renderEqn();
            this._renderResult();
            this._isResultUndefined = false;
        } else if (cleartype === "bs") {
            if (this._isEqualPressed || this._isResultUndefined || this._eqnArr.length === 0) {
                return;
            }
            if(this._isOperatorInserted){
                this._eqnArr = this._eqnArr.slice(0, -1);
                this._renderEqn();
                this._isOperatorInserted = false;
                return;
            }
            if (this._getLastElement().length === 2 && this._getLastElement().indexOf("-") !== -1) {
                this._eqnArr = this._eqnArr.slice(0, -1);
                this._isOperatorInserted = true;
                this._renderEqn();
                return;
            }

            if (!isNaN(this._getLastElement()) && this._getLastElement() !== "") {
                this._eqnArr[this._eqnArr.length - 1] = this._eqnArr[this._eqnArr.length - 1].slice(0, -1);
            } else if (this._getLastElement().indexOf("-") === -1) {
                this._eqnArr = this._getLastElement() === "" ? this._eqnArr.slice(0, -2) : this._eqnArr.slice(0, -1);
                this._isOperatorInserted = this._isOperatorInserted ? !this._isOperatorInserted : this._isOperatorInserted;
            }

            if ((this._result === '0' || this._getLastElement() === "" || isNaN(parseInt(this._getLastElement(), 10))) && this._eqnArr.length === 1) {
                this._result = '0';
                this._eqnArr = this._eqnArr.slice(0, -1);
                // this._eqnArr.push("0");
            } else {
                this._result = this._getLastElement();
            }
            this._renderEqn();
        } else if (cleartype === "ce") {
            this._result = '0';
            this._renderResult();
            this._isResultUndefined = false;
        } else {
            console.info("invalid clear type");
        }
        this._resultLimit = false;
    }

    _resetArrows() {
        this._displayEqnDiv.parentElement.querySelector(".seekLeft").style.display = "none";
        this._displayEqnDiv.parentElement.querySelector(".seekRight").style.display = "none";
        this._displayEqnDiv.style.right = "0px";
    }

    getResult() {
        if (this._isResultUndefined || this._eqnArr.length === 0) {
            return;
        }
        this._evalResult();
        this._renderEqn();
        this._isOperatorInserted = false;
        this._isEqualPressed = true;
        if (!this._isEqualPressed) {
            this._lastFocus = document.activeElement;
        }
        // this._readResult();
        // this._resetArrows();
    }

    negateValue() {
        if (this._result === '0' || this._isResultUndefined || this._isOperatorInserted) {
            return;
        }
        if (this._isEqualPressed) {
            this._result = String(+(this._result) * -1);
            this._renderResult();
            return;
        }
        if (this._getLastElement() === "-") {
            this._eqnArr = this._eqnArr.slice(0, -1);
            // (eval(this._eqnArr[this._eqnArr.length - 1]) * (-1)).toString();
            this._renderEqn();
            return;
        }
        this._eqnArr[this._eqnArr.length - 1] = String(+(this._eqnArr[this._eqnArr.length - 1]) * -1);
        this._renderEqn();
    }
}
