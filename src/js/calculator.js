"use strict";
export default class Calculator {

    constructor(displayResultDiv, displayEqnDiv) {
        this._result = '0';
        this._lastFocus = "";
        this._displayResultDiv = displayResultDiv;
        this._displayEqnDiv = displayEqnDiv;
        this._eqnArr = [];
        this._isOperatorInserted = false;
        this._isResultUndefined = false;
        this._isEqualPressed = false;
        this._calculatorSize = "";
        this._isEntryError = false;
    }

    /* Get last element */
    _getLastElement() {
        return this._eqnArr[this._eqnArr.length - 1];
    }

    _isNegationNotAllowed() {
        return (
        (this._eqnArr.length === 1 && this._eqnArr[0] === "-")
        ||
        (this._eqnArr.length >= 2 && ["+", "-", "*", "/"].indexOf(this._eqnArr[this._eqnArr.length - 2]) !== -1
        && this._eqnArr[this._eqnArr.length - 1] === "-"))
    }

    /*--------- Set value to calculate --------------*/
    setValue(val) {
        if (this._eqnArr.length !== 0 && (this._isResultUndefined || (val === "." && this._getLastElement().indexOf(".") > -1) || this._restrictEqn()) && !this._isEqualPressed) {
            return;
        }
        if (this._shouldPopulateEquation(val)) {
            return;
        }
        if (this._getLastElement() && this._getLastElement().indexOf("ans$") !== -1) {
            return;
        }
        if (val === "-" && this._isNegationNotAllowed()) {
            return;
        }

        if (this._isEqualPressed || this._isEntryError || this._isResultUndefined) {
            this._eqnArr = [];
            this._result = "";
            this._renderResult();
        }

        if (!!this._eqnArr.length) {
            if (this._isOperatorInserted) {
                val === "." ? this._eqnArr.push("0" + val) : this._eqnArr.push(val);
            } else {
                this._eqnArr[this._eqnArr.length - 1] = (this._eqnArr[this._eqnArr.length - 1] + val).replace(/\-\./, "-0.");
            }
        } else {
            val === "." ? this._eqnArr.push("0" + val) : this._eqnArr.push(val);
        }

        this._renderEqn();
        this._isOperatorInserted = false;
        this._isEqualPressed = false;
        this._isResultUndefined = false;
        this._isEntryError = false;
    }

    _shouldPopulateEquation(val) {
        return (this._getLastElement() === "0" || this._getLastElement() === "-0") && val === "0" && !this._isEqualPressed;
    }

    _restrictEqn() {
        let totalLength = 0;
        const MAX_ALLOWED = 23;
        if (!this._eqnArr.length) {
            return false;
        }
        for (let i = 0; i < this._eqnArr.length; i++) {
            if (!!this._eqnArr[i].match(/ans\$/)) {
                totalLength += 3;
            } else if (!!this._eqnArr[i].match(/[0-9]/)) {
                totalLength += this._eqnArr[i].length;
            } else {
                totalLength += this._eqnArr[i].length + 1;
            }
        }
        return totalLength >= MAX_ALLOWED;
    }

    _restrictResult(value) {
        if (!!value) {
            return (value.indexOf(".") !== -1 || value.indexOf("-") !== -1) ? (value.indexOf(".") !== -1 && value.indexOf("-") !== -1) ? 12 : 11 : 10;
        }
        return (this._result.indexOf(".") !== -1 || this._result.indexOf("-") !== -1) ? (this._result.indexOf(".") !== -1 && this._result.indexOf("-") !== -1) ? 12 : 11 : 10;
    }

    _renderResult() {
        let result = !this._isEntryError && !this._isResultUndefined && this._result.length > this._restrictResult() ? this._roundup(this._result) : this._result;
        this._displayResultDiv.innerHTML = result.replace(/\//g, "&divide;").replace(/\*/g, "&times;").replace(/\-/g, "&minus;").replace(/\./g, "&#46;");
        setTimeout(function () {
            this._displayResultDiv.previousElementSibling.innerHTML = result.length ? "Equals " + result.replace(/\-/g, "negative").replace(/\./g, "decimal") : "blank";
            this._lastFocus = document.activeElement;
        }.bind(this), 500);
    }

    _renderError() {
        this._renderEqn();
        setTimeout(function () {
            this._displayResultDiv.innerHTML = this._result;
            this._displayResultDiv.previousElementSibling.innerHTML = "equals " + this._result.replace(/^<span style="font-size: 65%">(.*)<\/span>$/, "$1");
        }.bind(this), 500);
    }

    _evalResult() {
        let result;
        if (this._eqnArr.join("").match(/\/(\-)*0(\/|\+|\*|\-|(\.)*(0)*$)/)) {
            this._result = '<span style="font-size: 65%">Cannot divide by zero</span>';
            this._renderError();
            this._isResultUndefined = true;
            return;
        }

        this._eqnArr = this._isOperatorInserted ? this._eqnArr.slice(0, -1) : this._getLastElement().length === 0 ? this._eqnArr.slice(0, -2) : this._eqnArr;
        try {
            this._eqnArr = this._eqnArr.map((elem)=> {
                return elem.replace(/^(-)*0(?!\.)(?!$)/, "$1");
            });
            result = eval(this._eqnArr.join(" ").replace("ans$", ""));
        } catch (e) {
            console.log("ENTRY ERROR");
            this._result = '<span style="font-size: 65%">Entry Error</span>';
            this._renderError();
            this._isEntryError = true;
            return;
        }

        this._result = String(result);

        this._renderEqn();
        this._renderResult();
        this._lastFocus = document.activeElement;
        this._isOperatorInserted = false;
    }

    _roundup(value) {
        const MAX_ALLOWED = 10;
        if (value.indexOf("e") > -1) {
            let ePower = value.split("e")[1];
            return parseFloat(value).toExponential(MAX_ALLOWED - 2 - ePower.length);
        }
        let wholeNumberLength = value.split(".")[0].replace(/\-/, '').length;
        if (value.indexOf(".") !== -1 && wholeNumberLength <= MAX_ALLOWED - 2) {
            return parseFloat(value).toFixed(MAX_ALLOWED - wholeNumberLength).replace(/(0)*$/, "");
        }
        return parseFloat(value).toExponential(MAX_ALLOWED - 5);
    }

    _renderEqn() {
        let revisedEqnArr = [],
            digit = 0,
            expression,
            self = this;

        this._eqnArr.forEach(function (i, index) {
            if (i.length === 2 && i.indexOf(".") === 1 && self._isOperatorInserted && index + 1 !== self._eqnArr.length) {
                i = self._eqnArr[index] = i.slice(0, -1);
            }
            digit = i.indexOf("ans$") !== -1 ? i.split("$")[0] : i;
            revisedEqnArr.push(digit);
        });
        this._setTextToHiddenSpan(revisedEqnArr);

        this._displayEqnDiv.innerHTML = revisedEqnArr.join(" ").replace(/\//g, "&divide;").replace(/\*/g, "&times;").replace(/\-/g, "&minus;");
    }

    /* Set text for screen reader */

    _setTextToHiddenSpan(revisedEqnArr) {
        let text = revisedEqnArr.join("")
            .replace(/ans/g, "answer ") // read answer for ans
            .replace(/([\+\-\*\/]|^)(\-)/g, "$1negative") //read negative for any "-" sign after operator or starting of line
            .replace(/\//g, "divide ")
            .replace(/\*/g, "multiply ")
            .replace(/\-/g, "minus ")
            .replace(/\./g, "decimal ")
            .replace(/\+/g, "plus ");
        if (this._isEqualPressed) {
            this._displayEqnDiv.previousElementSibling.innerHTML = "";
            setTimeout(function(){
                this._displayEqnDiv.previousElementSibling.innerHTML = "Expression colon " + (text.length ? text : "type in text");
            }.bind(this),100);
        }else {
            this._displayEqnDiv.previousElementSibling.innerHTML = "Expression colon " + (text.length ? text : "type in text");
        }
    }

    /*--------- Set operator sign to calculate --------------*/
    setSign(sign) {
        if (((this._restrictEqn() && !this._isOperatorInserted) && !this._isEqualPressed || this._isEntryError || this._isResultUndefined)) {
            return;
        }
        if (this._isEqualPressed) {
            this._eqnArr = [];
            this._eqnArr.push("ans$(" + this._result + ")");
            this._isOperatorInserted = true;
            this._eqnArr.push(sign);
            this._renderEqn();
            this._isEqualPressed = false;
            return;
        }
        if (this._isOperatorInserted || this._eqnArr.length === 0) {
            sign === "-" ? this.setValue("-") : this._eqnArr[this._eqnArr.length - 1] = sign;
            this._renderEqn();
            this._isEqualPressed = false;
        } else if ((sign !== "-" && this._getLastElement() !== "-") || (sign === "-" && !this._isNegationNotAllowed())) {
            this._eqnArr.push(sign);
            this._isOperatorInserted = true;
            this._renderEqn();
        }
    }

    /*------------------- Clear recent display data --------------------*/
    clearData(cleartype) {
        if (cleartype === 'c') {
            this._result = '';
            this._eqnArr = [];
            this._renderEqn();
            this._renderResult();
            this._isResultUndefined = false;
            this._isEqualPressed = false;
        } else if (cleartype === "bs") {
            let lastElem, isNegative;
            if (this._eqnArr.length === 0) {
                return;
            } else if (this._isEqualPressed || this._eqnArr.length === 1) {
                this._result = "";
                this._renderResult();
            }
            this._isResultUndefined = false;
            this._isEntryError = false;

            lastElem = this._getLastElement();
            isNegative = parseInt(lastElem, 10) < 0;
            lastElem.length !== 1 && lastElem.indexOf("ans$") === -1
                ? this._eqnArr[this._eqnArr.length - 1] = this._eqnArr[this._eqnArr.length - 1].slice(0, -1)
                : this._eqnArr = this._eqnArr.slice(0, -1);

            this._isOperatorInserted = this._getLastElement() && this._getLastElement().indexOf("ans$") === -1 && isNaN(this._getLastElement()) && !isNegative;
            this._isEqualPressed = false;
            this._renderEqn();
        } else if (cleartype === "ce") {
            this._eqnArr.pop();
            if (!this._eqnArr.length
                || this._isEntryError
                || this._isResultUndefined
                || (this._eqnArr.length && this._eqnArr[0].indexOf("ans$") === -1)) {
                this._result = "";
            }
            this._isOperatorInserted = this._getLastElement() && this._getLastElement().indexOf("ans$") === -1 && isNaN(this._getLastElement());
            this._isEqualPressed = false;
            this._renderEqn();
            this._renderResult();
            this._isEntryError = false;
            this._isResultUndefined = false;
        } else {
            console.info("invalid clear type");
        }
    }

    getResult() {
        if (this._isResultUndefined || this._eqnArr.length === 0) {
            return;
        }
        this._isEqualPressed = true;
        if (!this._isEqualPressed) {
            this._lastFocus = document.activeElement;
        }
        this._evalResult();
    }

    negateValue() {
        if (this._isResultUndefined || this._isEntryError) {
            return;
        }
        if (!this._isEqualPressed && this._restrictEqn() && this._eqnArr[this._eqnArr.length - 1].indexOf("-") === -1) {
            return;
        }
        if (this._isOperatorInserted || this._eqnArr.length === 0) {
            this.setValue("-");
            return;
        }
        if (this._isEqualPressed) {
            this._result = String(+(this._result) * -1);
            this._renderResult();
            return;
        }
        if (this._getLastElement() === "-") {
            this._eqnArr = this._eqnArr.slice(0, -1);
            this._isOperatorInserted = isNaN(this._getLastElement());
            this._renderEqn();
            return;
        }
        if (this._eqnArr[this._eqnArr.length - 1].indexOf("-") === -1
            || (this._eqnArr[this._eqnArr.length - 1].indexOf("ans$") !== -1 && this._eqnArr[this._eqnArr.length - 1].indexOf("-") !== 0)) {
            this._eqnArr[this._eqnArr.length - 1] = "-" + this._eqnArr[this._eqnArr.length - 1];
        } else {
            this._eqnArr[this._eqnArr.length - 1] = this._eqnArr[this._eqnArr.length - 1].replace("-", "");
        }

        this._renderEqn();
    }
}
