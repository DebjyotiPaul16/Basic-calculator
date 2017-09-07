import CalculatorManger from "../js/calculator_manager.js";
import Calculator from "../js/calculator.js";
function eventFire(el, etype, keyCode, key, isShiftKey) {
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        evObj.keyCode = keyCode;
        evObj.key = key;
        evObj.shiftKey = isShiftKey;
        el.dispatchEvent(evObj);
    }
}
describe("calculatorManager", ()=> {
    let calcMgr;
    beforeEach(()=> {
        calcMgr = new CalculatorManger();
        calcMgr.createCalculator();
    });
    it("test", ()=> {
        //eventFire($(".opeationButton").get(0), 'click');
        eventFire($(document).get(0), 'keyup');
        //--eventFire(document.getElementById("calculator") , 'dragstop');
        expect(1 + 1).toBe(2);
    });

    describe("click on calculator buttons", ()=> {
        it("should call setValue when any number is pressed", ()=> {
            spyOn(Calculator.prototype, "setValue");
            eventFire($(".opeationButton[value=3]").get(0), 'click');
            expect(Calculator.prototype.setValue).toHaveBeenCalledWith('3');
            Calculator.prototype.setValue.and.callThrough();
        });
        it("should call setValue when any sign is pressed", ()=> {
            spyOn(Calculator.prototype, "setSign");
            eventFire($(".opeationButton[value='+']").get(0), 'click');
            expect(Calculator.prototype.setSign).toHaveBeenCalledWith('+');
            Calculator.prototype.setSign.and.callThrough();
        });
        it("should call getResult when equals is pressed", ()=> {
            spyOn(Calculator.prototype, "getResult");
            eventFire($(".opeationButton[value='=']").get(0), 'click');
            expect(Calculator.prototype.getResult).toHaveBeenCalled();
            Calculator.prototype.getResult.and.callThrough();
        });
        it("should call negateValue when negate is pressed", ()=> {
            spyOn(Calculator.prototype, "negateValue");
            eventFire($(".opeationButton[value='negate']").get(0), 'click');
            expect(Calculator.prototype.negateValue).toHaveBeenCalled();
            Calculator.prototype.negateValue.and.callThrough();
        });
        it("should call clearData when C is pressed", ()=> {
            spyOn(Calculator.prototype, "clearData");
            eventFire($(".opeationButton[value='c']").get(0), 'click');
            expect(Calculator.prototype.clearData).toHaveBeenCalledWith('c');
            Calculator.prototype.clearData.and.callThrough();
        });
    });

    describe("keyboard press on calculator", ()=> {
        it("should call setValue when any number is pressed", ()=> {
            spyOn(Calculator.prototype, "setValue");
            eventFire($(document).get(0), 'keyup', 97, '1');
            expect(Calculator.prototype.setValue).toHaveBeenCalledWith('1');
            Calculator.prototype.setValue.and.callThrough();
        });
        it("should call setValue when decimal is pressed", ()=> {
            spyOn(Calculator.prototype, "setValue");
            eventFire($(document).get(0), 'keyup', 110, '.');
            expect(Calculator.prototype.setValue).toHaveBeenCalledWith('.');
            Calculator.prototype.setValue.and.callThrough();
        });
        it("should call setSign when sign is pressed", ()=> {
            spyOn(Calculator.prototype, "setSign");
            eventFire($(document).get(0), 'keyup', 111);
            expect(Calculator.prototype.setSign).toHaveBeenCalledWith('/');
            Calculator.prototype.setSign.and.callThrough();
        });

        it("should call getResult when enter is pressed", ()=> {
            spyOn(Calculator.prototype, "getResult");
            eventFire($(document).get(0), 'keyup', 13);
            expect(Calculator.prototype.getResult).toHaveBeenCalled();
            Calculator.prototype.getResult.and.callThrough();
        });
        it("should call clearData when escape is pressed", ()=> {
            spyOn(Calculator.prototype, "clearData");
            eventFire($(document).get(0), 'keyup', 27);
            expect(Calculator.prototype.clearData).toHaveBeenCalledWith('c');
            Calculator.prototype.clearData.and.callThrough();
        });
        it("should call clearData when delete is pressed", ()=> {
            spyOn(Calculator.prototype, "clearData");
            eventFire($(document).get(0), 'keyup', 46);
            expect(Calculator.prototype.clearData).toHaveBeenCalledWith('ce');
            Calculator.prototype.clearData.and.callThrough();
        });
        it("should call clearData when backspace is pressed", ()=> {
            spyOn(Calculator.prototype, "clearData");
            eventFire($(document).get(0), 'keyup', 8);
            expect(Calculator.prototype.clearData).toHaveBeenCalledWith('bs');
            Calculator.prototype.clearData.and.callThrough();
        });
        
    });

    it("should close when close button is clicked", ()=> {
        spyOn(window, "setTimeout").and.callFake((arg)=> {
            arg();
        });
        eventFire($(".close-calculator").get(0), 'click');
        expect(calcMgr.calcElem.get(0).style.display).toBe("none");
        window.setTimeout.and.callThrough();
    });

    it("should focus from 'close' to '=' when shift tab is pressed", ()=> {
        spyOn($.fn, "focus");
        eventFire($(".close-calculator").get(0), 'keydown', 9, "tab", true);
        expect($.fn.focus).toHaveBeenCalled();
        $.fn.focus.and.callThrough();
    });

    it("should not focus from 'close' to '=' when tab is pressed", ()=> {
        spyOn($.fn, "focus");
        eventFire($(".close-calculator").get(0), 'keydown', 9, "tab", false);
        expect($.fn.focus).not.toHaveBeenCalled();
        $.fn.focus.and.callThrough();
    });

    it("should focus from '=' to 'close' when tab is pressed", ()=> {
        spyOn($.fn, "focus");
        eventFire($("[value='=']").get(0), 'keydown', 9, "tab", false);
        expect($.fn.focus).toHaveBeenCalled();
        $.fn.focus.and.callThrough();
    });

    it("should not focus from '=' to 'close' when shift tab is pressed", ()=> {
        spyOn($.fn, "focus");
        eventFire($("[value='=']").get(0), 'keydown', 9, "tab", true);
        expect($.fn.focus).not.toHaveBeenCalled();
        $.fn.focus.and.callThrough();
    });


    it("should trigger keydown if first time open", ()=> {
        calcMgr._calcInitialOpen = true;
        spyOn(Element.prototype, "getAttribute").and.returnValue("");
        eventFire($(document).get(0), 'keydown');
        expect(calcMgr._calcInitialOpen).toBe(true);
        Element.prototype.getAttribute.and.callThrough();
    });
    describe("should test keypress of any button", ()=> {
        it("should test keypress of any button when keycode is 13", ()=> {
            calcMgr._calcInitialOpen = true;
            eventFire($(".btn").get(0), 'keypress', 13);
            expect(calcMgr._calcInitialOpen).toBe(true);
        });
        it("should test keypress of any button when keycode is not 13", ()=> {
            calcMgr._calcInitialOpen = false;
            eventFire($(".btn").get(0), 'keypress', 30);
            expect(calcMgr._calcInitialOpen).toBe(false);
        });
    });


    describe("should test click of any children", ()=> {
        it("should test keypress of any button when keycode is 13", ()=> {
            calcMgr._calcInitialOpen = true;
            eventFire($(".btn").get(0), 'click');
            expect(calcMgr._calcInitialOpen).toBe(false);
        });
    });

    it("should test for mouseover on any children of calculator", function () {
        spyOn(calcMgr, "_setActive");
        eventFire($(".btn").get(0), 'mouseover');
        expect(calcMgr._setActive).toHaveBeenCalled();
    });

    it("", function () {
        let elem = {
            tagName: "",
            classList: {
                add: jasmine.createSpy("add")
            }
        };
        spyOn(calcMgr, "_getElement").and.returnValue(
            [{
                classList: {
                    remove: jasmine.createSpy("remove")
                }
            }]
        );
        calcMgr._setActive(elem);

    });

});

