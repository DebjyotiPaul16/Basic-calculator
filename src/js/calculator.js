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
        if (this._eqnArr.length !==0 && (this._isResultUndefined || (val === "." && this._getLastElement().indexOf(".") > -1) || this._restrictEqn()) && !this._isEqualPressed) {
            return;
        }
        if (this._shouldPopulateEquation(val)) {
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
        this._isResultUndefined = false;
        this._isEntryError = false;
        if (this._result.length === this._restrictResult()) {
            this._resultLimit = true;
        }
    }

    _shouldPopulateEquation(val) {
        return (this._getLastElement() === "0" || this._getLastElement() === "-0") && val === "0";
    }

    _restrictEqn() {
        if (this._isOperatorInserted) {
            return false;
        }
        let totalLength = 0;
        const MAX_ALLOWED = 23;
        if (!this._eqnArr.length) {
            return false;
        }
        for (let i = 0; i < this._eqnArr.length; i++) {
            if (!!this._eqnArr[i].match(/ans/)) {
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
        } else {
            return (this._result.indexOf(".") !== -1 || this._result.indexOf("-") !== -1) ? (this._result.indexOf(".") !== -1 && this._result.indexOf("-") !== -1) ? 12 : 11 : 10;
        }

    }

    _renderResult() {
        let result,
            isRoundedUp = this._result.length > this._restrictResult();
        result = isRoundedUp ? this._roundup(this._result, this._precision) : this._result;
        this._displayResultDiv.innerHTML = result.replace(/\//g, "&divide;").replace(/\*/g, "&times;").replace(/\-/g, "&minus;").replace(/\./g, "&#46;");
        this._displayResultDiv.previousElementSibling.innerHTML = "equals " + result.replace(/\-/g, "minus");
        this._lastFocus = document.activeElement;
    }

    _renderError() {
        this._displayResultDiv.innerHTML = this._result;
        this._displayResultDiv.previousElementSibling.innerHTML = "equals " + this._result.replace(/^<span style="font-size: 65%">(.*)<\/span>$/, "$1");
    }

    _evalResult() {
        let result;
        if ((this._eqnArr[this._eqnArr.length - 1] === '0' || parseFloat(this._eqnArr[this._eqnArr.length - 1]) === 0) &&
            this._eqnArr[this._eqnArr.length - 2] &&
            this._eqnArr[this._eqnArr.length - 2] === '/') {
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
            result = eval(this._eqnArr.join(" ").replace("ans-", ""));
        } catch (e) {
            console.log("ENTRY ERROR");
            this._result = '<span style="font-size: 65%">Entry Error</span>';
            this._renderError();
            this._isEntryError = true;
            return;
        }

        this._result = String(result);
        this._resultLimit = false;

        this._renderEqn();
        this._renderResult();
        this._lastFocus = document.activeElement;
        this._isOperatorInserted = false;
    }

    _roundup(value, precision) {
        if (value.indexOf(".") !== -1) {
            if (value.indexOf("e") !== -1) {
                return parseFloat(parseFloat(eval(value)).toFixed(precision - 1)).toExponential(this._precision - 3).toString();
            } else {
                return parseFloat(parseFloat(eval(value)).toFixed(precision)).toExponential(this._precision - 4).toString();
            }
        } else {
            return parseFloat(parseFloat(eval(value)).toFixed(precision - 1)).toExponential(this._precision - 3).toString();
        }

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
            digit = i.indexOf("ans") !== -1 ? i.split("-")[0] : i;
            revisedEqnArr.push(digit);
        });
        this._setTextToHiddenSpan(revisedEqnArr);
        if (!this._eqnArr.length) {
            expression = "";
        } else {
            expression = $.parseHTML(revisedEqnArr.join(" ").replace(/\//g, "&divide;").replace(/\*/g, "&times;").replace(/\-/g, "&minus;"))[0].nodeValue;
        }
        this._displayEqnDiv.value = expression;

    }

    /* Set text for screen reader */

    _setTextToHiddenSpan(revisedEqnArr) {
        let text = revisedEqnArr.join("").replace(/\//g, "divided by").replace(/\*/g, "multiplies").replace(/\-/g, "minus").replace(/\./g, "point").replace(/\+/g, "plus");
        this._displayEqnDiv.previousElementSibling.innerHTML = text;
    }

    /*--------should return character size of the calculator as per calculator size---------*/
    _getCharacterRequiredToOverflow() {
        let charSize = 0;
        switch (this._calculatorSize) {
            case "small":
                charSize = 20;
                break;
            case "medium":
                charSize = 30;
                break;
            case "large":
                charSize = 40;
                break;
            default:
                charSize = 20;
        }
        return charSize;
    }

    /*------ End of method ------*/

    _setCalculatorSize(size) {
        this._calculatorSize = size;
    }

    /*--------- Set operator sign to calculate --------------*/
    setSign(sign) {
        if ((this._restrictEqn() && !this._isEqualPressed || this._isEntryError)) {
            return;
        }
        if (this._isEqualPressed) {
            this._eqnArr = [];
            this._eqnArr.push("ans-" + this._result);
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
        } else if (sign !== "-" || (sign === "-" && !this._isNegationNotAllowed())) {
            this._eqnArr.push(sign);
            this._isOperatorInserted = true;
            this._renderEqn();
            this._resultLimit = false;
        }
    }

    /*------------------- Clear recent display data --------------------*/
    clearData(cleartype) {
        if (cleartype === 'c') {
            this._result = '0';
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
            this._isResultUndefined = this._isResultUndefined ? !this._isResultUndefined : this._isResultUndefined;


            lastElem = this._getLastElement();
            isNegative = parseInt(lastElem, 10) < 0;
            lastElem.length !== 1 && lastElem.indexOf("ans") === -1
                ? this._eqnArr[this._eqnArr.length - 1] = this._eqnArr[this._eqnArr.length - 1].slice(0, -1)
                : this._eqnArr = this._eqnArr.slice(0, -1);

            if (isNaN(this._getLastElement()) && !isNegative) {
                this._isOperatorInserted = true;
            } else {
                this._isOperatorInserted = this._isOperatorInserted ? !this._isOperatorInserted : this._isOperatorInserted;
            }
            this._isEqualPressed = false;
            this._renderEqn();
        } else if (cleartype === "ce") {
            this._eqnArr.pop();
            this._result = "";
            this._isOperatorInserted = isNaN(this._getLastElement());
            this._isEqualPressed = false;
            this._renderEqn();
            this._renderResult();
            this._isResultUndefined = false;
        } else {
            console.info("invalid clear type");
        }
        this._resultLimit = false;
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
        //this._renderEqn();
    }

    negateValue() {
        if (this._isResultUndefined) {
            return;
        }
        if (this._restrictEqn()) {
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
            this._renderEqn();
            return;
        }
        if (this._eqnArr[this._eqnArr.length - 1].indexOf("-") === -1) {
            this._eqnArr[this._eqnArr.length - 1] = "-" + this._eqnArr[this._eqnArr.length - 1];
        } else {
            this._eqnArr[this._eqnArr.length - 1] = this._eqnArr[this._eqnArr.length - 1].replace("-", "");
        }

        this._renderEqn();
    }
}
