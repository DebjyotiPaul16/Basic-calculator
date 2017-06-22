"use strict";
export default class Calculator {

    constructor(display) {
        this.initialValue = '';
        this.lastValue = '';
        this.operator = '';
        this.dispResult = false;
        this.memoryData = '';
        this.display = display;
        this.valAndSign = [];
        this.displayOperator = '';
        this.isResultUndefined = false;
    }

    /*--------- Set value to calculate --------------*/
    setValue(val) {

        if (!this.initialValue) {
            this.initialValue = val;
            if (this.operator && this.operator === '-' & val === '.') {
                this.initialValue = '-0.';
                this.operator = '';
            } else if (this.operator && this.operator === '-' & val === '0') {
                this.initialValue = '-0.';
                this.operator = '';
            } else if (this.operator && this.operator === '-') {
                this.initialValue = -Math.abs(val);
                this.operator = '';
            }
            this.initialValue = (this.initialValue.toString().indexOf('.') === 0) ? '0.' : this.initialValue;
            this.display.innerHTML = this.initialValue;
        } else if (!this.operator) {
            if (this.dispResult) {
                this.initialValue = val;
                this.initialValue = (this.initialValue.indexOf('.') === 0) ? '0.' : this.initialValue;
                this.dispResult = false;
            } else {
                this.initialValue = (val === '.' && this.initialValue.indexOf('.') >= 0) ? this.initialValue : this.initialValue.toString() + val;
            }
            this.display.innerHTML = (this.initialValue.toString().length > 28) ? this.initialValue.slice(-28) : this.initialValue;
        } else {
            if (!this.lastValue) {
                this.lastValue = val;
                this.lastValue = (this.lastValue.indexOf('.') === 0) ? '0.' : this.lastValue;
            } else {
                this.lastValue = (val === '.' && this.lastValue.indexOf('.') >= 0) ? this.lastValue : this.lastValue.toString() + val;
            }
            this.lastValue = (typeof this.lastValue != 'undefined' && this.lastValue.toString().indexOf('.') == 0) ? '0.' : this.lastValue;
            var displayHtml = this.initialValue + this.displayOperator + this.lastValue;
            this.display.innerHTML = (displayHtml.toString().length > 28) ? displayHtml.slice(-28) : displayHtml;
        }

    }

    /*--------- Set operator sign to calculate --------------*/
    setSign(sign) {

        if (!this.operator) {
            this.operator = sign;
        } else if (!this.lastValue) {
            this.operator = sign;
        } else {
            this.getResult(sign);
        }
        this.displayOperator = (this.operator === '*') ? 'x' : this.operator;
        var displayHtml = (this.initialValue) ? this.initialValue + this.displayOperator : this.displayOperator;
        this.display.innerHTML = (displayHtml.toString().length > 28) ? displayHtml.slice(-28) : displayHtml;
    }

    /*----------- Calculate Percentage -------------*/
    calculatePercentage() {
        if (this.lastValue) {
            this.lastValue = (this.initialValue * this.lastValue) / 100;
            this.getResult();
        }
    }

    /*--------------- Return Result Data -----------------*/
    getResult(sign) {
        if (!this.lastValue) {
            return;
        }
        var result = this.initialValue,
            displayResult,
            signName;
        if (this.operator === '+') {
            result = parseFloat(this.initialValue) + parseFloat(this.lastValue);
        }
        if (this.operator === '-') {
            result = parseFloat(this.initialValue) - parseFloat(this.lastValue);
        }
        if (this.operator === '*') {
            if (this.lastValue !== '') {
                result = (this.initialValue) * (this.lastValue);
            }
        }
        if (this.operator === '/') {
            this.divideByZeroHandler(this.initialValue, this.lastValue);
            if (this.lastValue !== '' && !this.isResultUndefined) {
                result = (this.initialValue) / (this.lastValue);
            }
        }
        if (result !== '') {
            this.operator = (sign) ? sign : '';
            this.lastValue = '';
            this.dispResult = true;
            if (this.isResultUndefined) {
                displayResult = "Result is not defined";
                this.isResultUndefined = false;
            } else {
                displayResult = (result && result === parseInt(result, 10)) ? result : eval(parseFloat(result).toFixed(5));
            }
            this.initialValue = displayResult;
            this.display.innerHTML = displayResult;
            setTimeout(function () {
                if (sign) {
                    signName = document.querySelectorAll('[value="' + sign + '"]')[0].getAttribute('aria-label').split(' ')[0];
                    $("#disp").attr('tabindex', '0').attr('aria-label', displayResult + signName).focus();
                } else {
                    $("#disp").attr('tabindex', '0').attr('aria-label', displayResult).focus();
                }

            }, 200);
            $("#disp").focusout(function () {
                $("#disp").removeAttr("tabindex");
                if (sign) {
                    document.querySelectorAll('[value="' + sign + '"]')[0].focus();
                } else {
                    document.querySelectorAll('[value="="]')[0].focus();
                }
            });
        }
    }

    /*---------------- Handle divide by zero situations -----------------*/
    divideByZeroHandler(dividend, divider) {
        if (parseInt(dividend, 10) === 0 && parseInt(divider, 10) === 0) {
            this.isResultUndefined = true;
            console.log("Result is not defined");
        } else if (divider === "") {
            this.lastValue = "1";
        }
    }

    /*---------------- Store data in memory and calculate Memory -----------------*/
    memoryOperations(memoryType) {
        switch (memoryType) {
            case "ms":
                this.memoryData = this.initialValue;
                document.getElementById('disp_sign').innerHTML = "M";
                break;
            case "mr":
                if (this.memoryData) {
                    if (!this.operator) {
                        this.initialValue = this.memoryData;
                        this.display.innerHTML = this.initialValue;
                    } else {
                        this.lastValue = this.memoryData;
                        this.display.innerHTML = this.initialValue + this.displayOperator + this.lastValue;
                    }
                }
                break;
            case "mc":
                this.memoryData = '';
                document.getElementById('disp_sign').innerHTML = "";
                break;
            case "mPlus":
                var currentval = this.display.innerHTML;
                if (!isNaN(currentval)) {
                    this.memoryData = parseFloat(this.memoryData) + parseFloat(currentval);
                }
                break;
            case "mMinus":
                var currentval = this.display.innerHTML;
                if (!isNaN(currentval)) {
                    this.memoryData = parseFloat(this.memoryData) - parseFloat(currentval);
                }
                break;
        }

    }

    /*------------------- Clear recent display data --------------------*/
    clearData(cleartype) {
        if (cleartype === 'c') {
            this.initialValue = '';
            this.lastValue = '';
            this.operator = '';
            this.displayOperator = '';
            this.dispResult = false;
            this.display.innerHTML = '';
        } else if (cleartype === "bs") {
            var currentval = this.display.innerHTML;
            if (this.lastValue) {
                this.lastValue = parseFloat(this.lastValue.toString().slice(0, -1));
            } else if (this.operator) {
                this.operator = '';
                this.displayOperator = '';
                this.display.innerHTML = currentval.slice(0, -1);
            } else if (this.initialValue.toString() !== "Infinity" && currentval !== "Result is not defined") {
                this.initialValue = this.initialValue.toString().length != 1 && !isNaN(this.initialValue) ? parseFloat(this.initialValue.toString().slice(0, -1)) : "";
                this.display.innerHTML = currentval.slice(0, -1);
            } else {
                this.initialValue = '';
                this.lastValue = '';
                this.operator = '';
                this.displayOperator = '';
                this.dispResult = false;
                this.display.innerHTML = '';
            }
        } else if (cleartype === "ce") {
            if (this.lastValue) {
                this.lastValue = '';
                this.display.innerHTML = this.initialValue + this.displayOperator + 0;
            } else {
                this.initialValue = '';
                this.operator = '';
                this.displayOperator = '';
                this.display.innerHTML = 0;
            }
        } else {
            console.info("invalid clear type");
        }

    }

}