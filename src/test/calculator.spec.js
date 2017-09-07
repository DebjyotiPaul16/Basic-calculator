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
        beforeEach(()=> {
            calcObj._displayEqnDiv.previousElementSibling = {};
        });

        it("should return if result is undefined", () => {
            calcObj._eqnArr = ["7", "/", "0"];
            calcObj._isResultUndefined = true;
            expect(calcObj.setValue("8")).toBe(undefined);
        });

        it("should return if no more equation should be processed", ()=> {
            calcObj._eqnArr = ["7", "/", "0.0000000000000000012"];
            calcObj._isResultUndefined = false;
            expect(calcObj.setValue("8")).toBe(undefined);
        });
        it("should return if last element is ans", ()=> {
            calcObj._eqnArr = ["-ans$2563"];
            calcObj._isResultUndefined = false;
            expect(calcObj.setValue("8")).toBe(undefined);
        });
        it("should return if negation is not allowed", ()=> {
            calcObj._eqnArr = ["2", "*", "-"];
            calcObj._isResultUndefined = false;
            expect(calcObj.setValue("-")).toBe(undefined);
        });

        it("should return if last element is 0", ()=> {
            calcObj._eqnArr = ["2", "*", "-0"];
            calcObj._isResultUndefined = false;
            expect(calcObj.setValue("0")).toBe(undefined);
        });

        it("should set number as eqn", ()=> {
            calcObj._eqnArr = ["2", "*"];
            calcObj._isOperatorInserted = true;
            calcObj.setValue("8");
            expect(calcObj._eqnArr).toEqual(["2", "*", "8"]);
        });

        it("should set number as eqn", ()=> {
            calcObj._eqnArr = ["2"];
            calcObj._isOperatorInserted = false;
            calcObj.setValue("8");
            expect(calcObj._eqnArr).toEqual(["28"]);
        });

        it("should set number as decimal", ()=> {
            calcObj._eqnArr = [];
            calcObj._isOperatorInserted = false;
            calcObj.setValue(".");
            expect(calcObj._eqnArr).toEqual(["0."]);
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
        it("should throw entry error", function () {
            calcObj._eqnArr = ["14", "/", "-"];
            calcObj._evalResult();
            expect(calcObj._result).toBe('<span style="font-size: 65%">Entry Error</span>');
        });

        it("should round up large numbers", ()=> {
            calcObj._eqnArr = ["12345678901234567890123456789"];
            calcObj._evalResult();
            expect(calcObj._result).toBe('1.2345678901234568e+28');
        });

        it("should round up large numbers", ()=> {
            calcObj._eqnArr = ["12345678901234567.789"];
            calcObj._evalResult();
            expect(calcObj._result).toBe('12345678901234568');
        })

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
            expect(calcObj._eqnArr).toEqual(["*"]);
        });
        it("should include ans$ in eqnArr", ()=> {
            calcObj._result = "5";
            calcObj._isEqualPressed = true;
            calcObj._eqnArr = ["2", "+", "3"];
            calcObj.setSign("+");
            expect(calcObj._eqnArr).toEqual(["ans$(5)", "+"]);
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
            expect(calcObj._displayResultDiv.innerHTML).toBe('');
        });

        it("should return if backspace is pressed and result is undefined", ()=> {
            calcObj._isResultUndefined = true;
            expect(calcObj.clearData("bs")).toBe(undefined);
        });

        it("should delete the last of result", ()=> {
            calcObj._eqnArr = ["23", "*"];
            calcObj.clearData('bs');
            expect(calcObj._eqnArr).toEqual(["23"]);
        });
        it("should update result to zero", ()=> {
            calcObj._eqnArr = ["23"];
            calcObj.clearData('bs');
            expect(calcObj._result).toEqual('');
        });
        it("should clear only last entry if 'CE' is pressed", ()=> {
            calcObj._result = "result";
            calcObj._eqnArr = ["eqn"];
            calcObj.clearData("ce");
            expect(calcObj._eqnArr).toEqual([]);
            expect(calcObj._result).toBe('');
        });

        it("should return if any other than 'C','CE','bs' is pressed", ()=> {
            expect(calcObj.clearData("else")).toBe(undefined);
        });
    });

    describe("getResult method", ()=> {
        beforeEach(()=> {
            calcObj._displayEqnDiv.previousElementSibling = {};
        });
        it("should return if result is undefined", ()=> {
            calcObj._isResultUndefined = true;
            expect(calcObj.getResult()).toEqual(undefined);
        });
        it("should eval the result", ()=> {
            calcObj._eqnArr = ["7", "+", "9"];
            calcObj.getResult();
            expect(calcObj._displayEqnDiv.innerHTML).toBe('7 + 9');
            expect(calcObj._result).toBe('16');
        });
    });

    describe("negateValue method", ()=> {
        it("should return if result is undefined", ()=> {
            calcObj._isResultUndefined = true;
            expect(calcObj.negateValue()).toEqual(undefined);
        });
        it("should negate the result", ()=> {
            calcObj._displayEqnDiv.previousElementSibling = {};
            calcObj._eqnArr = ["3", "*", "4"];
            calcObj._result = "12";
            calcObj._isEqualPressed = true;
            calcObj._isResultUndefined = false;
            calcObj._isOperatorInserted = false;
            calcObj._isEntryError = false;
            calcObj.negateValue();
            expect(calcObj._result).toBe('-12');
        });
    });


});

