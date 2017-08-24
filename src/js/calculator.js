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

    /*--------- Set value to calculate --------------*/
    setValue(val) {
        if ((this._isResultUndefined || (val === "." && this._result.indexOf(".") > -1) || this._resultLimit || this._restrictEqn()) && !this._isEqualPressed) {
            return;
        }
        if (this._shouldPopulateEquation(val)) {
            return;
        }
        if (this._isEqualPressed && !this._isEntryError) {
            this._eqnArr = [];
            this._result = "0";
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
        this._isEntryError = false;
        if (this._result.length === this._restrictResult()) {
            this._resultLimit = true;
        }
    }

    _shouldPopulateEquation(val) {
        return (this._getLastElement() === "0" || this._getLastElement() === undefined) && val === "0";
    }

    _restrictEqn() {
        return this._checkOverflow(this._displayEqnDiv);
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
        this._renderEqn();
        result = isRoundedUp ? this._roundup(this._result, this._precision) : this._result;
        this._displayResultDiv.innerHTML = "<span class='sr-only'>equals</span>" + result.replace(/\//g, "&divide;").replace(/\*/g, "&times;").replace(/\-/g, "&minus;").replace(/\./g, "&#46;");
        // this._result.length > this._restrictResult() ? parseFloat(this._result).toFixed(this._precision) : this._result;
        this._lastFocus = document.activeElement;
    }


    _evalResult() {
        let result;
        if ((this._eqnArr[this._eqnArr.length - 1] === '0' || parseFloat(this._eqnArr[this._eqnArr.length - 1]) === 0) &&
            this._eqnArr[this._eqnArr.length - 2] &&
            this._eqnArr[this._eqnArr.length - 2] === '/') {
            this._result = 'Cannot divide by zero';
            this._displayResultDiv.innerHTML = this._result;
            this._isResultUndefined = true;
            return;
        }

        this._eqnArr = this._isOperatorInserted ? this._eqnArr.slice(0, -1) : this._getLastElement().length === 0 ? this._eqnArr.slice(0, -2) : this._eqnArr;
        try {
            result = eval(this._eqnArr.join(" ").replace("ans-", ""));
        } catch (e) {
            console.log("ENTRY ERROR");
            this._result = 'ENTRY ERROR';
            this._displayResultDiv.innerHTML = this._result;
            this._isEntryError = true;
            return;
        }

        this._result = String(result);
        this._resultLimit = false;

        this._renderResult();
        this._lastFocus = document.activeElement;
        // this._readResult();
    }

    _roundup(value, precision) {
        if (value.indexOf(".") !== -1) {
            if (value.indexOf("e") !== -1) {
                return parseFloat(parseFloat(eval(value)).toFixed(precision - 1)).toExponential(this._precision - 3).toString();
            } else {
                return parseFloat(parseFloat(eval(value)).toFixed(precision)).toString().slice(0, this._restrictResult(value));
            }
        } else {
            return parseFloat(parseFloat(eval(value)).toFixed(precision - 1)).toExponential(this._precision - 3).toString();
        }
    }

    _renderEqn() {
        let self = this,
            revisedEqnArr = [],
            digit = 0,
            expression;

        this._eqnArr.forEach(function (i) {

            digit = i.indexOf("ans") !== -1 ? i.split("-")[0] : i;
            revisedEqnArr.push(digit);
            // if (i.length > self._restrictResult()) {
            //     parseFloat(i) && i.indexOf(".") > -1 && i[i.length - 1] !== "." ? revisedEqnArr.push(self._roundup(i, self._precision)) :
            //         (i.length > self._precision * 2 ? revisedEqnArr.push(parseInt(i).toExponential(self._precision)) : revisedEqnArr.push(i));
            // } else {
            //     revisedEqnArr.push(i);
            // }
        });
        this._setTextToHiddenSpan(revisedEqnArr);
        // this._displayEqnDiv.innerHTML = "";
        // this._displayEqnDiv.innerHTML = revisedEqnArr.join(" ").replace(/\//g, "&divide;").replace(/\*/g, "&times;").replace(/\-/g, "&minus;");
       // this._displayEqnDiv.value = revisedEqnArr.join(" ").replace(/\//g, "&divide;").replace(/\*/g, "&times;").replace(/\-/g, "&minus;");
       //  this._displayEqnDiv.value = "";
        if(!this._eqnArr.length){
            expression = "";
        }else {
             expression = $.parseHTML(revisedEqnArr.join(" ").replace(/\//g, "&divide;").replace(/\*/g, "&times;").replace(/\-/g, "&minus;"))[0].nodeValue;
        }
        this._displayEqnDiv.value = expression;

    }

    /* Set text for screen reader */

    _setTextToHiddenSpan(revisedEqnArr) {
        let text = revisedEqnArr.join("").replace(/\//g, "divided by").replace(/\*/g, "multiplies").replace(/\-/g, "minus").replace(/\./g, "point").replace(/\+/g, "plus");
        this._displayEqnDiv.previousElementSibling.innerHTML = text;
    }

    /* End of method */

    /*---------should determine weather the equation will overflow the display or not--------*/
    _checkOverflow(el) {
       // return el.offsetWidth > el.parentElement.offsetWidth - this._getCharacterRequiredToOverflow();
        return this._inputExceeded($(el));
    }
    /* End of method */


    /*--------Determine the input length in pixels to get the overflow situation--------*/

    _inputExceeded(el){
        var s = $('<span >'+el.val()+'</span>');
        s.css({
            position : 'absolute',
            left : -9999,
            top : -9999,
            // ensure that the span has same font properties as the element
            'font-family' : el.css('font-family'),
            'font-size' : el.css('font-size'),
            'font-weight' : el.css('font-weight'),
            'font-style' : el.css('font-style')
        });
        $('body').append(s);
        var result = s.width() > el.width() - this._getCharacterRequiredToOverflow();
        //remove the newly created span
        s.remove();
        return result;
    }
    /*End of method*/


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
        if ((this._isResultUndefined || this._restrictEqn() || this._isEntryError) && this._isEqualPressed) {
            return;
        }
        if (this._isEqualPressed) {
            this._eqnArr = [];
            this._eqnArr.push("ans-" + this._result);
            this._eqnArr.push(sign);
            this._isOperatorInserted = true;
            this._renderEqn();
            this._isEqualPressed = false;
            return;
        }
        if (this._isOperatorInserted && this._eqnArr.length !== 0) {
            this._eqnArr[this._eqnArr.length - 1] = sign;
            this._renderEqn();
            this._isEqualPressed = false;
        } else {
            if (this._eqnArr.length === 0) {
                this._eqnArr.push(
                    this._result.indexOf("-") > -1 ? "(" + this._result + ")" : this._result
                );
            }
            this._eqnArr.push(sign);
            this._renderEqn();
            this._isOperatorInserted = true;
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
        } else if (cleartype === "bs") {
            if (this._isResultUndefined || this._eqnArr.length === 0) {
                return;
            } else if (this._isEqualPressed) {
                this._result = "";
                this._renderResult();
            }
            if (this._isOperatorInserted) {
                this._eqnArr = this._eqnArr.slice(0, -1);
                this._renderEqn();
                this._isOperatorInserted = false;
                return;
            }

            if (this._getLastElement().indexOf("-") === 0) {
                this._eqnArr[this._eqnArr.length - 1] = this._eqnArr[this._eqnArr.length - 1].slice(0, -1);
                //this._isOperatorInserted = true;
                this._renderEqn();
                return;
            }
            // !isNaN(this._getLastElement()) &&
            if (this._getLastElement() === "") {
                this._eqnArr[this._eqnArr.length - 1] = this._eqnArr[this._eqnArr.length - 1].slice(0, -1);
            } 
            // else if (this._getLastElement().indexOf("-") === -1) {
            //     this._eqnArr = this._getLastElement() === "" ? this._eqnArr.slice(0, -2) : this._eqnArr.slice(0, -1);
            //     this._isOperatorInserted = this._isOperatorInserted ? !this._isOperatorInserted : this._isOperatorInserted;
            // }

            if ((this._result === '0' || this._getLastElement() === "" || isNaN(parseInt(this._getLastElement(), 10))) && this._eqnArr.length === 1) {
                this._result = '0';
                this._eqnArr = this._eqnArr.slice(0, -1);
                // this._eqnArr.push("0");
            } else {
                this._result = this._getLastElement();
            }
            this._isEqualPressed = false;
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
