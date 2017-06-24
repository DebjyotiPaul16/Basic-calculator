import CalculatorManger from "../js/calculatorManager.js";
import Calculator from "../js/calculator.js";

var jq;
describe("test suite for calculatorManager", function () {
    var calcMgrObj, createElmObj, getElemObj, cssObj, onObj, calObj, getClassObj;
    beforeEach(function () {
        jq = window.$.fn;
        calObj = new Calculator();
        spyOn(calObj, "clearData");
        spyOn(calObj, "setValue");
        spyOn(calObj, "memoryOperations");
        spyOn(calObj, "setSign");
        spyOn(calObj, "getResult");
        spyOn(calObj, "calculatePercentage");
        onObj = jasmine.createSpy("on");
        spyOn(jq, "off").and.returnValue({on: onObj});
        spyOn(jq, "on").and.callFake(function (param1, param2, param3) {
            param3();
        });
        cssObj = jasmine.createSpyObj("cssObj", ["css"]);
        spyOn(jq, "find").and.returnValue(cssObj);
        spyOn(jq, "css");
        spyOn(jq, "addClass").and.returnValue({attr: jasmine.createSpy("attr")});
        spyOn(jq, "position").and.returnValue({
            left: 0,
            top: 0
        });
        spyOn(jq, "height");
        spyOn(jq, "offset").and.returnValue({
            left: 0,
            top: 0
        });
        calcMgrObj = new CalculatorManger();
        createElmObj = {
            innerHTML: "",
            setAttribute: jasmine.createSpy("setAttribute"),
            appendChild: jasmine.createSpy("appendChild"),
            style: {
                cursor: "",
                display: "",
                textAlign: "",
                backgroundColor: ""
            }
        };
        getElemObj = {
            style: {
                display: "",
                top: "",
                left: ""
            },
            focus: jasmine.createSpy("focus"),
            innerHTML: "",
            getBoundingClientRect: jasmine.createSpy("getBoundingClientRect").and.returnValue({
                left: -1,
                top: 0
            })
        };
        getClassObj = {
            addEventListener: jasmine.createSpy("addEventListener").and.callFake(function (param1, param2) {
                param2();
            })
        };
        spyOn(document, "createElement").and.returnValue(createElmObj);
        spyOn(document, "getElementById").and.returnValue(getElemObj);
        spyOn(document, "getElementsByClassName").and.returnValue(getClassObj);
    });
    afterEach(function () {
        document.getElementById.and.callThrough();
        document.createElement.and.callThrough();
        jq.find.and.callThrough();
        jq.css.and.callThrough();
        jq.off.and.callThrough();
        jq.on.and.callThrough();
        jq.addClass.and.callThrough();
        jq.position.and.callThrough();
        jq.height.and.callThrough();
        jq.offset.and.callThrough();
    });
    describe("test suite for createCalculator", function () {
        var appendChildObj;
        beforeEach(function () {
            appendChildObj = jasmine.createSpyObj("appendChildObj", ["appendChild"]);
            spyOn(calcMgrObj, "draggable");
            spyOn(calcMgrObj, "createDiv");
            spyOn(calcMgrObj, "createTable").and.returnValue(appendChildObj);
            spyOn(calcMgrObj, "createToolbar");
            spyOn(calcMgrObj, "attachCalculatorBody");
            spyOn(calcMgrObj, "attachCalculatorTool");
            spyOn(calcMgrObj, "operateCalculator");
            spyOn(calcMgrObj, "handleWithKeyboard");
            spyOn(calcMgrObj, "calculatorShowHide");
            spyOn(calcMgrObj, "createCalculatorButton");
        });
        afterEach(function () {
            calcMgrObj.calculatorShowHide.and.callThrough();
        });
        it("test spec for createCalculator", function () {
            calcMgrObj.createCalculator();
            expect(document.createElement).toHaveBeenCalledWith('div');
            expect(createElmObj.setAttribute).toHaveBeenCalledWith('id', 'calculator');
            expect(createElmObj.setAttribute).toHaveBeenCalledWith('id', 'drag');
            expect(calcMgrObj.createDiv).toHaveBeenCalled();
            expect(calcMgrObj.createTable).toHaveBeenCalled();
            expect(document.createElement).toHaveBeenCalledWith('tr');
            expect(document.createElement).toHaveBeenCalledWith('Td');
            expect(calcMgrObj.createToolbar).toHaveBeenCalled();
            expect(createElmObj.setAttribute).toHaveBeenCalledWith('colspan', 5);
            expect(createElmObj.innerHTML).toBe('<span id="disp_sign" style="height:40px; display:block"></span><span class="disp_btn" id="disp" name="display" type="text" style="line-height:40px; display:block"></span>');
            expect(calcMgrObj.operateCalculator).toHaveBeenCalled();
            expect(calcMgrObj.draggable).toHaveBeenCalled();
            expect(calcMgrObj.handleWithKeyboard).toHaveBeenCalled();
            expect(calcMgrObj.calculatorShowHide).toHaveBeenCalled();
        });
    });
    it("should test createDiv", function () {
        calcMgrObj.createDiv();
        expect(document.createElement).toHaveBeenCalledWith("div");
        expect(createElmObj.innerHTML).toBe('<button id="calc_icon"></button>');
        expect(createElmObj.style.cursor).toBe('pointer');
        expect(createElmObj.style.display).toBe('inline-block');
        expect(createElmObj.setAttribute).toHaveBeenCalled();
    });
    it("should test createTable", function () {
        calcMgrObj.createTable();
        expect(document.createElement).toHaveBeenCalledWith("Table");
        expect(createElmObj.style.display).toBe('block');
        expect(createElmObj.setAttribute).toHaveBeenCalledWith('id', 'calc');
        expect(createElmObj.setAttribute).toHaveBeenCalledWith('cellpadding', 0);
        expect(createElmObj.setAttribute).toHaveBeenCalledWith('cellspacing', 0);
        expect(createElmObj.setAttribute).toHaveBeenCalledWith('border', 2);
    });
    it("should test createToolbar", function () {
        calcMgrObj.createToolbar();
        expect(document.createElement).toHaveBeenCalledWith("td");
        expect(createElmObj.innerHTML).toBe('<button class="minimize" aria-label="minimize">&minus;</button><button class="close-calculator" aria-label="close">x</button>');
        expect(createElmObj.style.textAlign).toBe('right');
        expect(createElmObj.style.backgroundColor).toBe('#1A2533');
        expect(createElmObj.setAttribute).toHaveBeenCalledWith('colspan', '5');
    });
    it("should test minimize", function () {
        calcMgrObj.minimize();
        expect(getElemObj.style.display).toBe("block");
        expect(getElemObj.focus).toHaveBeenCalled();
    });
    it("should test closeCalculator", function () {
        var clearDataObj = jasmine.createSpy("clearData");
        calcMgrObj.calcobj = {
            clearData:clearDataObj
        };
        calcMgrObj.closeCalculator();
        expect(document.getElementById).toHaveBeenCalled();
        expect(getElemObj.style.display).toBe('none');
        expect(getElemObj.style.top).toBe(0);
        expect(getElemObj.style.left).toBe(0);
    });
    describe("should test createCalculatorButton", function () {
        it("should test when !isNaN(elemValue) || elemValue === '.' is true", function () {
            calcMgrObj.createCalculatorButton(2, 2);
            expect(createElmObj.innerHTML).toBe('<button class="btn opeationButton"  operation="setValue"  value="6">6</button><span class="sr-only">&nbsp;</span>');
        });
        describe("test suite for !isNaN(elemValue) || elemValue === '.' is false ", function () {
            beforeEach(function () {
                spyOn(window, "isNaN").and.returnValue(true);
            });
            afterEach(function () {
                window.isNaN.and.callThrough();
            });
            it("should test when !isNaN(elemValue) || elemValue === '.' is false ", function () {
                calcMgrObj.createCalculatorButton(2, 3);
                expect(createElmObj.innerHTML).toBe('<button class="btn opeationButton" aria-label="Minus"  operation="setSign" value="-">-</button>');
            });
            it("should test when !isNaN(elemValue) || elemValue === '.' is false ", function () {
                calcMgrObj.createCalculatorButton(1, 3);
                expect(createElmObj.innerHTML).toBe('<button class="btn opeationButton" aria-label="Plus"  operation="setSign" value="+">+</button>');
            });
            it("should test when !isNaN(elemValue) || elemValue === '.' is false ", function () {
                calcMgrObj.createCalculatorButton(3, 3);
                expect(createElmObj.innerHTML).toBe('<button class="btn opeationButton" aria-label="Multiplication"  operation="setSign" value="*">x</button>');
            });
            it("should test when !isNaN(elemValue) || elemValue === '.' is false ", function () {
                calcMgrObj.createCalculatorButton(3, 4);
                expect(createElmObj.innerHTML).toBe('<button class="btn opeationButton" aria-label="Percent"  operation="calculatePercentage"  value="%">%</button>');
            });
            it("should test when !isNaN(elemValue) || elemValue === '.' is false ", function () {
                calcMgrObj.createCalculatorButton(4, 4);
                expect(createElmObj.innerHTML).toBe('<button class="btn opeationButton" aria-label="Equals"  operation="getResult" value="=" >=</button>');
            });
        });
        it("test suite for memory_operations.indexOf(elemValue) !== -1 and Memory Clear", function () {
            calcMgrObj.createCalculatorButton(0, 0);
            expect(createElmObj.innerHTML).toBe('<button class="btn opeationButton" aria-label="Memory Clear"  operation="memoryOperations" value="mc">MC</button>');
        });
        it("test suite for memory_operations.indexOf(elemValue) !== -1 and clear entry", function () {
            calcMgrObj.createCalculatorButton(1, 4);
            expect(createElmObj.innerHTML).toBe('<button class="btn opeationButton" aria-label="Clear Entry"  operation="clearData" value="ce">CE</button>');
        });

    });
    describe("test suite for attachCalculatorBody and attachCalculatorTool", function () {
        beforeEach(function () {
            spyOn(document.body, "insertBefore");
        });
        function commonExpectations() {
            expect(jq.find).toHaveBeenCalledWith("img");
            expect(jq.css).toHaveBeenCalledWith('display', 'none');
        }

        it("closeButton is true", function () {
            calcMgrObj.attachCalculatorBody();
            calcMgrObj.attachCalculatorTool();
            commonExpectations();
        });
        afterEach(function () {
            document.body.insertBefore.and.callThrough();
        });
    });

    describe("test suite for operateCalculator", function () {
        beforeEach(function () {
            onObj.and.callFake(function (param, param1, param2) {
                param2();
            });
            spyOn(jq, "val").and.returnValue("demoVal");
            spyOn(jq, "attr");
        });
        afterEach(function () {
            jq.val.and.callThrough();
            jq.attr.and.callThrough();
        });
        it("should test when does not match any", function () {
            calcMgrObj.operateCalculator(calObj);
            expect(calObj.clearData).toHaveBeenCalledWith("demoVal");
        });
        it("should test when operation is seValue", function () {
            jq.attr.and.returnValue("setValue");
            calcMgrObj.operateCalculator(calObj);
            expect(calObj.setValue).toHaveBeenCalled();
        });
        it("should test when operation is memoryOperations", function () {
            jq.attr.and.returnValue("memoryOperations");
            calcMgrObj.operateCalculator(calObj);
            expect(calObj.memoryOperations).toHaveBeenCalled();
        });
        it("should test when operation is setSign", function () {
            jq.attr.and.returnValue("setSign");
            calcMgrObj.operateCalculator(calObj);
            expect(calObj.setSign).toHaveBeenCalled();
        });
        it("should test when operation is getResult", function () {
            jq.attr.and.returnValue("getResult");
            calcMgrObj.operateCalculator(calObj);
            expect(calObj.getResult).toHaveBeenCalled();
        });
        it("should test when operation is calculatePercentage", function () {
            jq.attr.and.returnValue("calculatePercentage");
            calcMgrObj.operateCalculator(calObj);
            expect(calObj.calculatePercentage).toHaveBeenCalled();
        });
    });

    describe("test suite for handleWithKeyboard", function () {
        var eventObj = {key: 0, keyCode: 0};

        function callFakeFn() {
            onObj.and.callFake(function (param, param1) {
                param1(eventObj);
            });
        }

        it("should test when !isNaN(event.key)", function () {
            callFakeFn(eventObj);
            calcMgrObj.handleWithKeyboard(calObj);
            expect(calObj.setValue).toHaveBeenCalled();
        });
        it("should test when event.keyCode===110", function () {
            eventObj.keyCode = 110;
            eventObj.key = NaN;
            callFakeFn(eventObj);
            calcMgrObj.handleWithKeyboard(calObj);
            expect(calObj.setValue).toHaveBeenCalledWith('.');
        });
        it("should test when event.keyCode===107", function () {
            eventObj.keyCode = 107;
            eventObj.key = NaN;
            callFakeFn(eventObj);
            calcMgrObj.handleWithKeyboard(calObj);
            expect(calObj.setSign).toHaveBeenCalledWith('+');
        });
        it("should test when event.keyCode===13", function () {
            eventObj.keyCode = 13;
            eventObj.key = NaN;
            callFakeFn(eventObj);
            calcMgrObj.handleWithKeyboard(calObj);
            expect(calObj.getResult).toHaveBeenCalled();
        });
        it("should test when event.keyCode===46", function () {
            eventObj.keyCode = 46;
            eventObj.key = NaN;
            callFakeFn(eventObj);
            calcMgrObj.handleWithKeyboard(calObj);
            expect(calObj.clearData).toHaveBeenCalledWith('c');
        });
    });

    describe("test suite for calculatorShowHide", function () {
        var thObj;
        beforeEach(function () {
            thObj = {
                maximize: jasmine.createSpy("maximize"),
                minimize: jasmine.createSpy("minimize"),
                closeCalculator: jasmine.createSpy("closeCalculator")
            };
        });
        it("should test event listeners", function () {
            calcMgrObj.calculatorShowHide(thObj);
            expect(jq.addClass).toHaveBeenCalled();
            expect(thObj.minimize).toHaveBeenCalled();
            expect(thObj.maximize).toHaveBeenCalled();
            expect(thObj.closeCalculator).toHaveBeenCalled();
        });
    });
    describe("test suite for maximize", function () {
        it("should test when ", function () {
            calcMgrObj.maximize();
            expect(getElemObj.style.display).toBe("block");
            expect(getElemObj.style.left).toBe('NaNpx');
        });
    });
});