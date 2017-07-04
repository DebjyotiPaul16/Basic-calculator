import LoadCalculator from "../js/loadCalculator.js"
import CalculatorManger from "../js/calculatorManager.js";

describe("test suite for load calculator", function () {
    var loadCalcObj, headTagObj, mgrObj;
    beforeEach(function () {
        spyOn(LoadCalculator.prototype, '_loadDependencyAndCreate').and.callThrough();
        headTagObj = {appendChild: jasmine.createSpy("appendChild")};
        spyOn(document, "getElementsByTagName").and.returnValue({0: headTagObj});
        loadCalcObj = new LoadCalculator();
    });
    it("should test constructor definition with _loadDependencyAndCreate when this._arrCount < this._depArr.length", function () {
        loadCalcObj = new LoadCalculator();
        expect(loadCalcObj._arrCount).toBe(2);
        expect(loadCalcObj._loadDependencyAndCreate).toHaveBeenCalled();
    });
    it("should test constructor definition with _loadDependencyAndCreate when this._arrCount < this._depArr.length false", function () {
        loadCalcObj._arrCount = 10;
        spyOn(loadCalcObj, "_createCalculator");
        spyOn(loadCalcObj, "_moveCalculator");
        spyOn(loadCalcObj, "validateLocation");
        loadCalcObj._calcManager = {
            calcElem: {
                css: jasmine.createSpy("css")
            }
        };
        loadCalcObj._loadDependencyAndCreate();
        expect(loadCalcObj._createCalculator).toHaveBeenCalled();
        expect(loadCalcObj._moveCalculator).toHaveBeenCalled();
        expect(loadCalcObj.validateLocation).toHaveBeenCalled();
        expect(loadCalcObj._calcManager.calcElem.css).toHaveBeenCalled();
    });
    it("should test _createCalculator",function () {
        spyOn(CalculatorManger.prototype,"createCalculator");
        loadCalcObj._createCalculator();
        expect(loadCalcObj._calcManager.createCalculator).toHaveBeenCalled();
    });
    
    it("should test clearCalculator",function () {
        loadCalcObj._calcManager = {
            calcobj:{
                clearData:jasmine.createSpy("clearData")
            }
        };
        loadCalcObj.clearCalculator();
        expect(loadCalcObj._calcManager.calcobj.clearData).toHaveBeenCalled();
    });

});