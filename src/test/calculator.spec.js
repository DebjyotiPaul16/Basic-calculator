import Calculator from "../js/calculator.js";

fdescribe("test suite for calculator.js", ()=> {
    let calcObj, displayResultDiv, displayEqnDiv;
    beforeEach(()=> {
        displayResultDiv = {
            innerHTML: "result"
        };
        displayEqnDiv = {
            innerHTML: "eqn"
        };
        calcObj = new Calculator(displayResultDiv, displayEqnDiv);
    });
    it("test suite for calculator constructor", function () {
        expect(calcObj._result).toEqual('0');
        expect(calcObj._displayResultDiv).toEqual(displayResultDiv);
        expect(calcObj._displayEqnDiv).toEqual(displayEqnDiv);
        expect(calcObj._eqnArr).toEqual([]);
        expect(calcObj._isOperatorInserted).toEqual(false);
        expect(calcObj._isResultUndefined).toEqual(false);
        expect(calcObj._isEqualPressed).toEqual(false);
    });

    describe("setValue method", ()=> {
        it("should return if result is undefined", ()=> {
            calcObj._isResultUndefined = true;
            expect(calcObj.setValue()).toEqual(undefined);
        });
        it("should return if decimal already exists in result", ()=> {
            calcObj._result = "1.23";
            expect(calcObj.setValue(".")).toEqual(undefined);
        });
        it("should directly alter the result value if equals after already pressed", ()=> {
            calcObj._isEqualPressed = true;
            calcObj._result = "1.234";
            calcObj.setValue("2.345");
            expect(calcObj._result).toBe("2.345");
        });
        it("should directly set the value if operator is added", ()=> {
            calcObj._eqnArr = ["1", "+"];
            calcObj._isOperatorInserted = true;
            calcObj._result = "1.234";
            calcObj.setValue("2.345");
            expect(calcObj._result).toBe("2.345");
        });
        describe("initial flow", ()=> {
            it("should alter result directly, if result is set to zero", ()=> {
                calcObj.setValue("2.345");
                expect(calcObj._result).toBe("2.345");
            });
            it("should append value with result , if result is not zero", ()=> {
                calcObj._result = "1";
                calcObj.setValue("2.345");
                expect(calcObj._result).toBe("12.345");
            });
        });
    });

    it("_renderResult should add result to html", ()=> {
        calcObj._result = "5";
        calcObj._renderResult();
        expect(calcObj._displayResultDiv.innerHTML).toBe("5");
    });

    describe("_evalResult method", ()=> {
        it("should prevent dividing by zero", ()=> {
            this._eqnArr = ["7", "/", "0"];
            expect(calcObj._displayResultDiv.innerHTML).toBe("5");
        });
    });


    describe("clearData test suite", ()=> {
        it("should test it when cleartype = c", ()=> {
            calcObj.clearData("c");
            expect(calcObj.initialValue).toBe('');
            expect(calcObj.lastValue).toBe('');
            expect(calcObj.operator).toBe('');
            expect(calcObj.displayOperator).toBe('');
            expect(calcObj.dispResult).toBe(false);
            expect(calcObj.display.innerHTML).toBe('');
        });
        describe("should test for cleartype = 'bs' ", ()=> {
            it("should test when lastValue is true", function () {
                calcObj.lastValue = 26;
                calcObj.display.innerHTML = "25";
                calcObj.clearData("bs");
                expect(calcObj.lastValue).toBe(2);
                expect(calcObj.display.innerHTML).toBe("25");
            });
            it("should test when operator is true", function () {
                calcObj.lastValue = false;
                calcObj.operator = "+";
                calcObj.clearData("bs");
                expect(calcObj.operator).toBe('');
                expect(calcObj.displayOperator).toBe('');
            });
            it("should test when initialvalue is true", function () {
                calcObj.lastValue = false;
                calcObj.operator = false;
                calcObj.initialValue = 25;
                calcObj.clearData("bs");
                expect(calcObj.initialValue).toBe(2);
            });
            it("should test when all false", function () {
                calcObj.display.innerHTML = "52";
                calcObj.lastValue = false;
                calcObj.operator = false;
                calcObj.initialValue = false;
                calcObj.clearData("bs");
                expect(calcObj.display.innerHTML).toBe("5");
            });
        });
        describe("test suite for cleartype 'cd'", ()=> {
            it("should test when lastvalue is true", function () {
                calcObj.lastValue = "45";
                calcObj.initialValue = "";
                calcObj.displayOperator = "+";
                calcObj.clearData('ce');
                expect(calcObj.lastValue).toBe('');
                expect(calcObj.display.innerHTML).toBe("+0");
            });
            it("should test when lastvalue is false", function () {
                calcObj.lastValue = false;
                calcObj.clearData("ce");
                expect(calcObj.initialValue).toBe('');
                expect(calcObj.operator).toBe('');
                expect(calcObj.displayOperator).toBe('');
                expect(calcObj.display.innerHTML).toBe(0);
            });
            it("nothing is true", function () {
                spyOn(window.console, "info");
                calcObj.clearData("abc");
                expect(window.console.info).toHaveBeenCalled();
            });
        });
    });

    describe("setValue test suite", function () {
        describe("test suite for setValue when this.initialValue is false", function () {
            it("should test when intialvalue is false", function () {
                calcObj.initialValue = false;
                calcObj.setValue("20.23");
                expect(calcObj.initialValue).toBe('20.23');
                expect(calcObj.display.innerHTML).toBe('20.23');
            });
            it("should test when intialvalue is false and this.initialValue.indexOf('.') === 0", function () {
                calcObj.initialValue = false;
                calcObj.setValue(".23");
                expect(calcObj.initialValue).toBe('0.');
            });
        });
        describe("test suite for this.operator is false", function () {
            it("should test when this.dispResult is true", function () {
                calcObj.dispResult = true;
                calcObj.initialValue = true;
                calcObj.operator = false;
                calcObj.setValue("20.23");
                expect(calcObj.initialValue).toBe("20.23");
                expect(calcObj.dispResult).toBe(false);
            });
            it("should test when !this.operator is false and this.dispResult false", function () {
                calcObj.initialValue = "20";
                calcObj.dispResult = false;
                calcObj.operator = false;
                calcObj.setValue(".");
                expect(calcObj.initialValue).toBe("20.");
            });
            it("should test when this.initialValue.indexOf('.') === 0", function () {
                calcObj.initialValue = ".";
                calcObj.dispResult = true;
                calcObj.operator = false;
                calcObj.setValue(".");
                expect(calcObj.initialValue).toBe("0.");
            });
            it("should test when val === '.' && this.initialValue.indexOf('.') >= 0", function () {
                calcObj.initialValue = ".";
                calcObj.dispResult = false;
                calcObj.operator = false;
                calcObj.setValue(".");
                expect(calcObj.initialValue).toBe(".");
            });
            it("should test when this.initialValue.toString().length > 28", function () {
                calcObj.initialValue = "abcdefghijklmnopqrstuvwxyzabcdefghijkl";
                calcObj.dispResult = false;
                calcObj.operator = false;
                calcObj.setValue(".");
                expect(calcObj.display.innerHTML).toBe("lmnopqrstuvwxyzabcdefghijkl.");
            });
        });
        describe("test suite for setValue when this.operator is true", function () {
            beforeEach(()=> {
                calcObj.initialValue = true;
                calcObj.operator = true;
                calcObj.lastValue = false;
            });
            it("should test when operator is true", function () {
                calcObj.setValue("10.20");
                expect(calcObj.lastValue).toBe('10.20');
            });
            it("should test when operator is true and this.lastValue.indexOf('.') === 0", function () {
                calcObj.setValue(".");
                expect(calcObj.lastValue).toBe('0.');
            });
            it("should test when lastValue is true", function () {
                calcObj.lastValue = "20";
                calcObj.setValue(".");
                expect(calcObj.lastValue).toBe('20.');
            });
            it("should test when lastValue is true and val === '.' && this.lastValue.indexOf('.') >= 0", function () {
                calcObj.lastValue = ".";
                calcObj.setValue(".");
                expect(calcObj.lastValue).toBe('0.');
            });
            it("shoduld test when (displayHtml.toString().length > 28)", function () {
                calcObj.initialValue = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnop";
                calcObj.lastValue = "";
                calcObj.setValue(".");
                expect(calcObj.display.innerHTML).toBe("qrstuvwxyzabcdefghijklmnop0.")
            });
        });
    });
    describe("test suite to get the result according to the operator", function () {
       var jq;
        beforeEach(function () {
            spyOn(window.$.fn, "attr").and.callThrough();
            spyOn(window.$.fn, "removeAttr").and.callThrough();
            spyOn(window, "setTimeout").and.callFake(function (param) {
                param();
            });
            calcObj.initialValue = 10;
            calcObj.lastValue = -20;
        });
        afterEach(function () {
            $.fn.attr.and.callThrough();
            $.fn.removeAttr.and.callThrough();
            window.setTimeout.and.callThrough();
        });
        it("when result is not equal to blank string", function () {
            calcObj.initialValue = '20';
            calcObj.getResult("+");
            expect(calcObj.initialValue).toBe('20');
            expect(calcObj.operator).toBe("+");
            expect(calcObj.lastValue).toBe("");
            expect(calcObj.dispResult).toBe(true);
            expect(calcObj.display.innerHTML).toBe(20);
            expect($.fn.attr).toHaveBeenCalled();
        });
        it("when operator is +",function () {
            calcObj.operator = "+";
            calcObj.getResult("+");
            expect(calcObj.initialValue).toBe(30);
        });
        it("when operator is -",function () {
            calcObj.operator = "-";
            calcObj.getResult("-");
            expect(calcObj.initialValue).toBe(-10);
        });
        it("when operator is -",function () {
            calcObj.operator = "*";
            calcObj.getResult("*");
            expect(calcObj.initialValue).toBe(-200);
        });
        it("when operator is -",function () {
            calcObj.operator = "/";
            calcObj.getResult("/");
            expect(calcObj.initialValue).toBe(-0.5);
        });
    });
    describe("test suite for memoryOperations", function () {
        var dispObj = {innerHTML:"2"};
        beforeEach(function () {
            spyOn(document,"getElementById").and.returnValue(dispObj);
        });
        afterEach(function () {
            document.getElementById.and.callThrough();
        });
        it("should test for memoryOperations when type ms", function () {
            calcObj.initialValue = "20";
            calcObj.memoryOperations("ms");
            expect(calcObj.memoryData).toBe("20");
            expect(dispObj.innerHTML).toBe("M");
        });
        it("should test for memoryOperations when type mr", function () {
            calcObj.memoryData = "20";
            calcObj.memoryOperations("mc");
            expect(calcObj.memoryData).toBe("");
            expect(dispObj.innerHTML).toBe("");
        });
        it("should test for memoryOperations when type mPlus", function () {
            calcObj.display.innerHTML = NaN;
            calcObj.memoryData = 10;
            calcObj.memoryOperations("mPlus");
            expect(calcObj.memoryData).toBe(10);
        });
        it("should test for memoryOperations when type mMinus", function () {
            calcObj.display.innerHTML = NaN;
            calcObj.memoryData = 10;
            calcObj.memoryOperations("mMinus");
            expect(calcObj.memoryData).toBe(10);
        });

    });
});

