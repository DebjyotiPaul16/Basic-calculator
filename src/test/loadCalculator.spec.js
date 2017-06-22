import DependencyInjector from "../js/loadCalculator.js"
describe("test suite for load calculator", function () {
    var loadCalcObj, headTagObj;
    beforeEach(function () {
        loadCalcObj = new DependencyInjector();
        headTagObj = {appendChild: jasmine.createSpy("appendChild")};
        spyOn(document, "getElementsByTagName").and.returnValue({0:headTagObj})
    });
    it("should test constructor definition", function () {
        expect(loadCalcObj.arrCount).toBe(0);
        expect(loadCalcObj.depArr).toEqual([{'jQuery': 'https://code.jquery.com/jquery-1.12.4.min.js'}, {'jQuery-ui': 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js'}, {'jQuery-support-touch': 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js'}]);
    });
    it("should test when this.arrCount<this.depArr.length for loadDependency", function () {
        loadCalcObj.arrCount = 5;
        spyOn(loadCalcObj,"loadCalculator");
        loadCalcObj.loadDependency();
        expect(loadCalcObj.loadCalculator).toHaveBeenCalled();
    });
});