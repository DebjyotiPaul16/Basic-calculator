import Calculator from "./calculator.js";
import {
    closeButton,
    minimizeButton,
    calculator_data,
    operator,
    memory_operations,
    clear_operation
} from './calculatorConfig.js';
export default class CalculatorManger {
    createCalculator() {
        var calculatordiv, mainDiv, div, table, toolbar, toolbarTd, tr0, td01;
        calculatordiv = document.createElement('div');
        calculatordiv.setAttribute('id', 'calculator');
        mainDiv = document.createElement('div');
        mainDiv.setAttribute('id', 'drag');
        div = this.createDiv();
        table = this.createTable();
        toolbar = document.createElement('tr'); //create the toolbar
        toolbarTd = this.createToolbar();
        toolbar.appendChild(toolbarTd);
        tr0 = document.createElement('Tr'); //calculator screen to display output
        td01 = document.createElement('Td');
        td01.setAttribute('colspan', 5);
        td01.innerHTML = '<span id="disp_sign" style="height:40px; display:block"></span><span class="disp_btn" id="disp" name="display" type="text" style="line-height:40px; display:block"></span>';
        tr0.appendChild(td01);
        table.appendChild(toolbar);
        table.appendChild(tr0);

        for (var row = 0; row < calculator_data.length; row++) {
            var tr = document.createElement('Tr');
            for (var col = 0; col < calculator_data[row].length; col++) {
                var td = this.createCalculatorButton(row, col);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        mainDiv.appendChild(div);
        mainDiv.appendChild(table);
        calculatordiv.appendChild(mainDiv);
        if ($("#simple-calculator").length) {
            this.attachCalculatorTool(div, table, calculatordiv);
        } else {
            this.attachCalculatorBody(div, table, calculatordiv);
        }
        var display = document.getElementById('disp');
        this.calcobj = new Calculator(display);
        this.operateCalculator(this.calcobj);
        this.draggable();
        this.handleWithKeyboard(this.calcobj);
        this.calculatorShowHide(this);
    }

    createDiv() {
        var div = document.createElement('div');
        div.innerHTML = '<button id="calc_icon"></button>';
        div.setAttribute('id', 'minimizeCalc');
        div.style.cursor = 'pointer';
        div.style.display = 'inline-block';
        return div;
    }

    createTable() {
        var table = document.createElement("Table");
        table.setAttribute('id', 'calc');
        table.setAttribute('cellpadding', 0);
        table.setAttribute('cellspacing', 0);
        table.setAttribute('border', 2);
        table.style.display = 'block';
        return table;
    }

    createToolbar() {
        var toolbarTd = document.createElement('td');
        toolbarTd.innerHTML = '<button class="minimize" aria-label="minimize">&minus;</button><button class="close-calculator" aria-label="close">x</button>';
        toolbarTd.style.textAlign = 'right';
        toolbarTd.style.backgroundColor = '#1A2533';
        toolbarTd.setAttribute('colspan', '5');
        return toolbarTd;
    }

    attachCalculatorTool(div, table, calculatordiv) {
        document.getElementById("simple-calculator").innerHTML = '<button id="calc-icon-tool" class="maximize" aria-label="calculator tool"></button>';
        $(div).find('img').css('display', 'none');
        $(table).css('display', 'none');
        $("#simple-calculator").prepend(calculatordiv);
        if (!closeButton) {
            $(".close-calculator").css("display", "none");
        }
        if (!minimizeButton) {
            $(".minimize").css("display", "none");
        }
    }

    attachCalculatorBody(div, table, calculatordiv) {
        $(div).find('img').css('display', 'none');
        $(table).css('display', 'block');
        $('body').prepend(calculatordiv);
        if (!closeButton) {
            $(".close-calculator").css("display", "none");
        }
        if (!minimizeButton) {
            $(".minimize").css("display", "none");
        }
    }

    createCalculatorButton(row, col) {
        var td = document.createElement('td');
        var elemValue = calculator_data[row][col].value;
        var label = (calculator_data[row][col].label) ? 'aria-label="' + calculator_data[row][col].label + '"' : '';
        if (!isNaN(elemValue) || elemValue === ".") {
            td.innerHTML = '<button class="btn opeationButton" ' + label + ' operation="setValue"  value="' + elemValue + '">' + calculator_data[row][col].name + '</button><span class="sr-only">&nbsp;</span>';
        } else {
            if (operator.indexOf(elemValue) !== -1) {
                if (elemValue === '%') {
                    td.innerHTML = '<button role="button" class="btn opeationButton" ' + label + '  operation="calculatePercentage"  value="' + elemValue + '">' + calculator_data[row][col].name + '</button>';
                } else if (elemValue === '=') {
                    td.innerHTML = '<button role="button"  class="btn opeationButton" ' + label + '  operation="getResult" value="' + elemValue + '" >' + calculator_data[row][col].name + '</button>';
                } else {
                    td.innerHTML = '<button  role="button" class="btn opeationButton" ' + label + '  operation="setSign" value="' + elemValue + '">' + calculator_data[row][col].name + '</button>';
                }

            } else if (memory_operations.indexOf(elemValue) !== -1) {
                td.innerHTML = '<button role="button" class="btn opeationButton" ' + label + '  operation="memoryOperations" value="' + elemValue + '">' + calculator_data[row][col].name + '</button>';
            } else if (clear_operation.indexOf(elemValue) !== -1) {
                td.innerHTML = '<button role="button" class="btn opeationButton" ' + label + '  operation="clearData" value="' + elemValue + '">' + calculator_data[row][col].name + '</button>';
            }

        }
        return td;
    }

    operateCalculator(calcobj) {
        $(document).off().on('click', '.opeationButton', function () {
            var operation = $(this).attr('operation');
            if (operation === "setValue") {
                calcobj.setValue($(this).val());
            } else if (operation === "memoryOperations") {
                calcobj.memoryOperations($(this).val());
            } else if (operation === "setSign") {
                calcobj.setSign($(this).val());
            } else if (operation === "getResult") {
                calcobj.getResult();
            } else if (operation === "calculatePercentage") {
                calcobj.calculatePercentage();
            } else {
                calcobj.clearData($(this).val());
            }
        })
    }

    draggable() {
        $("#calculator").css({ zIndex: 999999 });
        $("#drag").draggable({
            containment: 'body',
            scroll: true,
            scrollSpeed: 100,
            cursor: 'move',
            cancel: false,
            start: function (event, ui) {
                $('#calc_icon').removeClass('maximize');
            },
            stop: function (event, ui) {
                setTimeout(function () {
                    $('#calc_icon').addClass('maximize');
                }, 200);
            }
        });

    }

    handleWithKeyboard(calcobj) {
        $(document).off('keyup').on('keyup', function (event) {
            var operator = { 107: '+', 109: '-', 106: '*', 111: '/' };
            if (!isNaN(event.key) && event.keyCode !== 32) {
                calcobj.setValue(event.key);
            } else if (event.keyCode === 110) {
                calcobj.setValue('.');
            } else if (event.keyCode === 107 || event.keyCode === 109 || event.keyCode === 106 || event.keyCode === 111) {
                calcobj.setSign(operator[event.keyCode]);
            } else if (event.keyCode == 13) {
                calcobj.getResult();
            } else if (event.keyCode == 46) {
                calcobj.clearData('c');
            }
        });
    }

    calculatorShowHide(th) {
        var self = this;
        $(document).on('click', '.minimize', function () {
            $('#calc_icon').addClass('maximize').attr('aria-label', 'Maximize calculator');
            th.minimize();
            $(document).off("keyup");
        });
        $(document).on('click', '.maximize', function () {
            self.handleWithKeyboard(self.calcobj);
            th.maximize();
        });
        $(document).on('click', '.close-calculator', function () {
            th.closeCalculator();
            $(document).off("keyup");
        });
    }

    maximize() {
        $(".meta_tool_wrapper").css('visibility', 'hidden');
        document.getElementById("calc_icon").style.display = "none";
        document.getElementById("calc").style.display = "block";

        if (document.getElementById("drag").getBoundingClientRect().left < 0) {
            document.getElementById("drag").style.left = (document.getElementById("drag").offsetLeft - document.getElementById("drag").getBoundingClientRect().left) + 'px';
        }
        if ($("#simple-calculator").length) {
            if ($(document).height() < Math.abs($("#drag").position().top + $("#drag").height() + $("#simple-calculator").offset().top + 15)) {
                document.getElementById("drag").style.top = (Math.abs($(document).height() - ($("#drag").height() + $("#simple-calculator").offset().top + 15))) + 'px';
            }
        } else {
            if ($(document).height() < Math.abs($("#drag").position().top + $("#drag").height() + 15)) {
                document.getElementById("drag").style.top = (Math.abs($(document).height() - ($("#drag").height() + 15))) + 'px';
            }
        }
        setTimeout(function () {
            $("#calc").attr('tabindex', '0').focus();
            console.log($("#calc"));
        }, 1000);
        $("#calc").focusout(function () {
            $("#calc").removeAttr('tabindex');
        });
    }

    minimize() {
        document.getElementById("calc").style.display = "none";
        document.getElementById("calc_icon").style.display = "block";
        document.getElementById("calc_icon").focus();
    }

    closeCalculator() {
        var display = document.getElementById('disp');
        // var calcobj = new Calculator(display);
        this.calcobj.clearData('c');
        document.getElementById("calc").style.display = "none";
        document.getElementById("drag").style.top = 0;
        document.getElementById("drag").style.left = 0;
        document.getElementById("calc-icon-tool").focus();
    }

}