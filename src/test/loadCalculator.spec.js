import LoadCalculator from "../js/loadCalculator.js"
import CalculatorManger from "../js/calculatorManager.js";

describe("test suite for load calculator", function () {
    var loadCalcObj, headTagObj, findObj, getObj,jqObj,onObj,offsetObj = {
        left:10,
        top:10
    };
    beforeEach(function () {
        onObj = jasmine.createSpyObj("onObj",["on"]);
        onObj.on.and.callFake(function (selector,param) {
            param({target:""});
        });
        jqObj = jasmine.createSpyObj("jqObj",["width","height","offset","css","off"]);
        spyOn(LoadCalculator.prototype, '_loadDependencyAndCreate').and.callThrough();
        headTagObj = {appendChild: jasmine.createSpy("appendChild")};
        spyOn(document, "getElementsByTagName").and.returnValue({0: headTagObj});
        findObj = jasmine.createSpyObj("findObj", ["attr", "get", "css", "focus"]);
        getObj = {
            innerText: "",
            removeAttribute: jasmine.createSpy("removeAttribute"),
            setAttribute: jasmine.createSpy("setAttribute"),
            id:"abc"
        };
        loadCalcObj = new LoadCalculator();
        loadCalcObj._calcManager = {
            calcElem: {
                css: jasmine.createSpy("css"),
                find: jasmine.createSpy("find"),
                focus: jasmine.createSpy("focus"),
                offset: jasmine.createSpy("offset"),
                get:jasmine.createSpy("get")
            },
            calcobj: {
                clearData: jasmine.createSpy("clearData")
            },
            closeCalculator: jasmine.createSpy("closeCalculator"),
            handleWithKeyboard: jasmine.createSpy("handleWithKeyboard"),
            _calcInitialOpen:false
        };
        findObj.get.and.returnValue(getObj);
        loadCalcObj._calcManager.calcElem.get.and.returnValue(getObj);
        loadCalcObj._calcManager.calcElem.find.and.returnValue(findObj);
        jqObj.offset.and.returnValue(offsetObj);
        jqObj.off.and.returnValue(onObj);
        spyOn(window,"$").and.returnValue(jqObj);
    });
    it("should test constructor definition with _loadDependencyAndCreate when this._arrCount < this._depArr.length", function () {
        loadCalcObj = new LoadCalculator();
        expect(loadCalcObj._arrCount).toBe(3);
        expect(loadCalcObj._loadDependencyAndCreate).toHaveBeenCalled();
    });
    it("should test constructor definition with _loadDependencyAndCreate when this._arrCount < this._depArr.length false", function () {
        loadCalcObj._arrCount = 10;
        spyOn(loadCalcObj, "_createCalculator");
        spyOn(loadCalcObj, "_moveCalculator");
        spyOn(loadCalcObj, "validateLocation");
        loadCalcObj._loadDependencyAndCreate();
        expect(loadCalcObj._createCalculator).toHaveBeenCalled();
        expect(loadCalcObj._moveCalculator).toHaveBeenCalled();
        expect(loadCalcObj.validateLocation).toHaveBeenCalled();
        expect(loadCalcObj._calcManager.calcElem.css).toHaveBeenCalled();
    });
    it("should test _createCalculator", function () {
        spyOn(CalculatorManger.prototype, "createCalculator");
        loadCalcObj._createCalculator();
        expect(loadCalcObj._calcManager.createCalculator).toHaveBeenCalled();
    });

    it("should test clearCalculator", function () {
        loadCalcObj.clearCalculator();
        expect(loadCalcObj._calcManager.calcobj.clearData).toHaveBeenCalled();
    });

    describe("test suite for getDisplayState",function () {

        it("should test getDisplayState when display this._isCreated", function () {
            loadCalcObj._calcManager.calcElem.css.and.returnValue("none");
            expect(loadCalcObj.getDisplayState()).toBe(false);
        });
        it("should test getDisplayState when display this._isCreated and display block", function () {
            loadCalcObj._calcManager.calcElem.css.and.returnValue("block");
            expect(loadCalcObj.getDisplayState()).toBe(true);
        });

    });


    it("should test clearCalculator", function () {
        loadCalcObj.clearCalculator();
        expect(loadCalcObj._calcManager.calcobj.clearData).toHaveBeenCalled();
    });

    it("should test setSize", function () {
        loadCalcObj.setSize();
        expect(loadCalcObj._calcManager.calcElem.find).toHaveBeenCalled();
    });

    it("should test hideCalculator", function () {
        loadCalcObj.hideCalculator();
        expect(loadCalcObj._calcManager.closeCalculator).toHaveBeenCalled();
    });
    describe("showCalculator test suite", function () {
        let calcElem;
        beforeEach(function () {
            spyOn(window,"setTimeout").and.callFake(function (param) {
                param();
            });
        });
        afterEach(function () {
            window.setTimeout.and.callThrough();
        });
        it("should test when this._calcManager is defined and self._firstTimeOpen is open and this._top && this._left",function () {
            loadCalcObj._top = 0;
            loadCalcObj._left = 0;
            loadCalcObj.showCalculator();
            expect(loadCalcObj._calcManager._calcInitialOpen).toBe(true);
            expect(loadCalcObj._calcManager.handleWithKeyboard).toHaveBeenCalledWith(loadCalcObj._calcManager.calcobj);
            expect(loadCalcObj._calcManager.calcElem.css).toHaveBeenCalled();
            expect(getObj.removeAttribute).toHaveBeenCalled();
            expect(getObj.setAttribute).toHaveBeenCalled();
            expect(getObj.innerText).toBe("Calculator Maximized ");
        });
        it("should test when this._calcManager is defined and self._firstTimeOpen is false",function () {
            loadCalcObj._top = 1;
            loadCalcObj._left = 1;
            spyOn(loadCalcObj,"validateLocation");
            loadCalcObj._firstTimeOpen = false;
            loadCalcObj.showCalculator();
            expect(loadCalcObj.validateLocation).toHaveBeenCalled();
            expect(findObj.attr).toHaveBeenCalled();
            expect(findObj.focus).toHaveBeenCalled();
        });
    });
    it("should test getPosition",function () {
        loadCalcObj._calcManager.calcElem.offset.and.returnValue({top:0,left:0});
        expect(loadCalcObj.getPosition()).toEqual({top:0,left:0});
    });
    describe("test suite for validateLocation",function () {
        it("should validateLocation when left + calcWidth < windowWidth is false",function () {
            loadCalcObj.validateLocation(0,0);
            expect(loadCalcObj._top).toBe(null);
            expect(loadCalcObj._left).toBe(null);
        });
        it("should validateLocation when left + calcWidth < windowWidth && top + calcHeight < windowHeight is true",function () {
            jqObj.width.and.returnValue(100);
            jqObj.height.and.returnValue(100);
            loadCalcObj.validateLocation(0,0);
            expect(loadCalcObj._top).toBe(0);
            expect(loadCalcObj._left).toBe(0);
            expect(jqObj.css).toHaveBeenCalledWith({
                "top":"0px",
                "left":"0px"
            });
        });
    });
    describe("",function () {
        let targetObj = {};
        it("should test _hasValidParent when target is null",function () {
            targetObj = null;
            expect(loadCalcObj._hasValidParent(targetObj)).toBe(false);
        });
        it("should test _hasValidParent when target is defined",function () {
            targetObj = {
                id:"abc",
                parentElement:"demoElem"
            };
            expect(loadCalcObj._hasValidParent(targetObj)).toBe(true);
        });
    });
    describe("test suite for _getMovementDirection",function () {
        let event = {
            which:"",
            ctrlKey:""
        };
        it("should test when e.which === keyMap.left",function () {
            event.which = 37;
            expect(loadCalcObj._getMovementDirection(event)).toBe("left");
        });
        it("should test when e.which === keyMap.left e.ctrlKey && e.which === 188",function () {
            event.which = 188;
            event.ctrlKey = true;
            expect(loadCalcObj._getMovementDirection(event)).toBe("left");
        });
        it("should test when e.which === keyMap.up",function () {
            event.which = 38;
            expect(loadCalcObj._getMovementDirection(event)).toBe("up");
        });
        it("should test when e.which === keyMap.up || e.ctrlKey && e.which === 77",function () {
            event.which = 77;
            event.ctrlKey = true;
            expect(loadCalcObj._getMovementDirection(event)).toBe("up");
        });
        it("should test when e.which === keyMap.right",function () {
            event.which = 39;
            expect(loadCalcObj._getMovementDirection(event)).toBe("right");
        });
        it("e.which === keyMap.right || e.ctrlKey && e.which === 190",function () {
            event.which = 190;
            event.ctrlKey = true;
            expect(loadCalcObj._getMovementDirection(event)).toBe("right");
        });
        it("should test when e.which === keyMap.down",function () {
            event.which = 40;
            expect(loadCalcObj._getMovementDirection(event)).toBe("down");
        });
        it("should test when e.which === keyMap.down || e.ctrlKey && e.which === 191",function () {
            event.which = 191;
            event.ctrlKey = true;
            expect(loadCalcObj._getMovementDirection(event)).toBe("down");
        });
        it("should test when no keys matched",function () {
            event.which = 0;
            expect(loadCalcObj._getMovementDirection(event)).toBe(undefined);
        });
    });
    describe("test suite for _moveCalculator",function () {
        beforeEach(function () {
            spyOn(loadCalcObj,"_hasValidParent");
            spyOn(loadCalcObj,"_getMovementDirection");
        });
        it("shoudl test when calcPosX - 20 > -calcWidth / 2 and direction is left",function () {
            loadCalcObj._getMovementDirection.and.returnValue("left");
            loadCalcObj._moveCalculator();

        });
        it("shoudl test when calcPosX - 20 > -calcWidth / 2 and direction is left",function () {
            loadCalcObj._getMovementDirection.and.returnValue("up");
            loadCalcObj._moveCalculator();

        });
        it("shoudl test when calcPosX - 20 > -calcWidth / 2 and direction is left",function () {
            loadCalcObj._getMovementDirection.and.returnValue("down");
            loadCalcObj._moveCalculator();

        });
        it("shoudl test when calcPosX - 20 > -calcWidth / 2 and direction is left",function () {
            loadCalcObj._getMovementDirection.and.returnValue("right");
            loadCalcObj._moveCalculator();

        });
        
    });
});