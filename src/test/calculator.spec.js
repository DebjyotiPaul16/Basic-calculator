import Calculator from "../js/calculator.js";

describe("test suite for calculator.js", ()=> {
    let calcObj, displayResultDiv, displayEqnDiv;
    beforeEach(()=> {
        displayResultDiv = {
            innerHTML: "result",
            setAttribute: jasmine.createSpy("setAttribute"),
            focus: jasmine.createSpy("focus")
        };
        displayEqnDiv = {
            innerHTML: "eqn",
            setAttribute: jasmine.createSpy("setAttribute"),
            focus: jasmine.createSpy("focus")
        };
        calcObj = new Calculator(displayResultDiv, displayEqnDiv);
    });
    it("test suite for calculator constructor", function () {
        expect(calcObj._result).toEqual('');
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
        beforeEach(()=> {
            calcObj._displayEqnDiv.previousElementSibling = {};
        });
        it("should prevent dividing by zero", ()=> {
            calcObj._eqnArr = ["7", "/", "0"];
            calcObj._evalResult();
            expect(calcObj._result).toBe('<span style="font-size: 65%">Cannot divide by zero</span>');
        });
        it("should display result properly when no decimal is included", ()=> {
            calcObj._eqnArr = ["1", "+", "3"];
            calcObj._evalResult();
            expect(calcObj._displayResultDiv.innerHTML).toBe('4');
        });
        it("should display result properly when decimal is included", ()=> {
            calcObj._eqnArr = ["1", "/", "3"];
            calcObj._evalResult();
            expect(calcObj._displayResultDiv.innerHTML).toBe('0&#46;333333333');
        });
        it("should display result properly when decimal is included", ()=> {
            calcObj._eqnArr = ["14", "/", "3"];
            calcObj._evalResult();
            expect(calcObj._displayResultDiv.innerHTML).toBe('4&#46;666666667');
        });
    });

    it("_renderEqn method", ()=> {
        calcObj._displayEqnDiv.previousElementSibling = {};
        calcObj._eqnArr = ["14", "/", "3"];
        calcObj._renderEqn();
        expect(calcObj._displayEqnDiv.innerHTML).toBe('14 &divide; 3');
    });

    describe("setSign method", ()=> {
        beforeEach(()=> {
            calcObj._displayEqnDiv.previousElementSibling = {};
        })
        it("should not perform if result is undefined", ()=> {
            calcObj._isResultUndefined = true;
            expect(calcObj.setSign("+")).toBe(undefined);
        });
        it("should replace the operator if already inserted", ()=> {
            calcObj._isOperatorInserted = true;
            calcObj._eqnArr = ["+"];
            calcObj.setSign("*");
            expect(calcObj._eqnArr).toEqual(["*"])
        });
        it("should eval the result", ()=> {
            calcObj._eqnArr = ["7", "+", "9"];
            calcObj.setSign("*");
            expect(calcObj._displayEqnDiv.innerHTML).toBe('7 + 9 &times;');
            expect(calcObj._displayResultDiv.innerHTML).toBe('16');
        });
    });

    describe("clearData method", ()=> {
        beforeEach(()=> {
            calcObj._displayEqnDiv.previousElementSibling = {};
        });
        it("should clear both result and eqn if 'C' is pressed", ()=> {
            calcObj._result = "result";
            calcObj._eqnArr = ["eqn"];
            calcObj.clearData("c");
            expect(calcObj._displayEqnDiv.innerHTML).toBe('');
            expect(calcObj._displayResultDiv.innerHTML).toBe('0');
        });

        it("should return if backspace is pressed and result is undefined", ()=> {
            calcObj._isResultUndefined = true;
            expect(calcObj.clearData("bs")).toBe(undefined);
        });

        it("should delete the last of result", ()=> {
            calcObj._result = "23";
            calcObj.clearData('bs');
            expect(calcObj._displayResultDiv.innerHTML).toBe('2');
        });
        it("should update result to zero", ()=> {
            calcObj._result = "2";
            calcObj.clearData('bs');
            expect(calcObj._displayResultDiv.innerHTML).toBe('0');
        });
        it("should clear only result if 'CE' is pressed", ()=> {
            calcObj._result = "result";
            calcObj._eqnArr = ["eqn"];
            calcObj.clearData("ce");
            expect(calcObj._eqnArr).toEqual(["eqn"]);
            expect(calcObj._displayResultDiv.innerHTML).toBe('0');
        });

        it("should return if any other than 'C','CE','bs' is pressed", ()=> {
            expect(calcObj.clearData("else")).toBe(undefined);
        });
    });

    describe("getResult method", ()=> {
        beforeEach(()=> {
            spyOn(calcObj, "_resetArrows");
        });
        it("should return if result is undefined", ()=> {
            calcObj._isResultUndefined = true;
            expect(calcObj.getResult()).toEqual(undefined);
        });
        it("should eval the result", ()=> {
            calcObj._eqnArr = ["7", "+"];
            calcObj._result = "9";
            calcObj.getResult();
            expect(calcObj._displayEqnDiv.innerHTML).toBe('');
            expect(calcObj._displayResultDiv.innerHTML).toBe('16');
        });
    });

    describe("negateValue method", ()=> {
        it("should return if result is undefined", ()=> {
            calcObj._isResultUndefined = true;
            expect(calcObj.negateValue()).toEqual(undefined);
        });
        it("should negate the result", ()=> {
            calcObj._result = "12";
            calcObj.negateValue();
            expect(calcObj._displayResultDiv.innerHTML).toBe('-12');
        });
    });


});

