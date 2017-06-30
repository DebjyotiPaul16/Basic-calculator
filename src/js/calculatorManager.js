import Calculator from "./calculator.js";
import {
    calculator_data,
    operator,
    memory_operations,
    clear_operation
} from './calculatorConfig.js';
export default class CalculatorManger {
    createCalculator() {
        let calculatordiv =
            `<div id="calculator" role="application" aria-hidden="true" tabindex="0">
                <div id="drag">
                    <div id="minimizeCalc" style="cursor: pointer;display: inline-block">
                        <button id="calc_icon"></button>
                    </div>
                    <table id="calc" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="text-align: right;background-color: #1A2533" colspan="4">
																<label tabindex="-1" id="calc_state" style="position:fixed; left:-99%; display:none" ></label>
                                <button  class="close-calculator" aria-label="minimize">-</button>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <div class="calcDiv">
                                <span class="disp_btn" id="disp_eqn" name="display" type="text" style="line-height:40px; display:block">
								</span>
								 <button class="seek seekLeft"></button>
								 <button class="seek seekRight"></button>
								</div>									
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <span class="disp_btn" id="disp" name="display" type="text" style="line-height:40px; display:block"></span>
                            </td>
                        </tr>
                        ${calculator_data.map((rowData) =>{
                        return `<tr>
                          ${rowData.map((columnData) =>{
                                return `<td>${this.createCalculatorButton(columnData)}</td>`;
                            }).join("")}
                        </tr>`;
                        }).join("")}
                    </table>
                </div>
            </div>`;

        this.calcElem = this.attachCalculatorBody(calculatordiv);
        let displayResult = this.calcElem.find("#disp").get(0);
        let displayEqn = this.calcElem.find("#disp_eqn").get(0);
        this.calcobj = new Calculator(displayResult, displayEqn);
        this.operateCalculator(this.calcobj);
        this.makeDraggable(this.calcElem);
        this.handleWithKeyboard(this.calcobj);
        this.calculatorShowHide();
        this.handleCalculatorFocus();
        this.seekEquation();
        this.calcElem.focus();
    }

    attachCalculatorBody(calculatorStr) {
        let calculatorElm = $(calculatorStr);
        calculatorElm.find('table').css('display', 'block');
        $('body').prepend(calculatorElm);
        return calculatorElm;
    }

    createCalculatorButton(columnData) {
        var elemValue = columnData.value;
        var label = (columnData.label) ? 'aria-label="' + columnData.label + '"' : '';

        if (!isNaN(elemValue) || elemValue === ".") {
            return '<button role="button" class="btn opeationButton" ' + label + ' operation="setValue"  value="' + elemValue + '">' + columnData.name + '</button><span class="sr-only">&nbsp;</span>';
        }
        if (operator.indexOf(elemValue) !== -1) {
            if (elemValue === '%') {
                return '<button role="button" class="btn opeationButton" ' + label + '  operation="calculatePercentage"  value="' + elemValue + '">' + columnData.name + '</button>';
            }
            if (elemValue === '=') {
                return '<button role="button"  class="btn opeationButton" ' + label + '  operation="getResult" value="' + elemValue + '" >' + columnData.name + '</button>';
            }
            if (elemValue === 'negate') {
                return '<button  role="button" class="btn opeationButton" ' + label + '  operation="negate" value="' + elemValue + '">' + columnData.name + '</button>'
            }
            return '<button  role="button" class="btn opeationButton" ' + label + '  operation="setSign" value="' + elemValue + '">' + columnData.name + '</button>';
        }
        if (memory_operations.indexOf(elemValue) !== -1) {
            return '<button role="button" class="btn opeationButton" ' + label + '  operation="memoryOperations" value="' + elemValue + '">' + columnData.name + '</button>';
        }
        if (clear_operation.indexOf(elemValue) !== -1) {
            return '<button role="button" class="btn opeationButton" ' + label + '  operation="clearData" value="' + elemValue + '">' + columnData.name + '</button>';
        }
    }

    operateCalculator(calcobj) {
        $(document).off('click', '.opeationButton').on('click', '.opeationButton', function() {
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
            } else if (operation === "negate") {
                calcobj.negateValue();
            } else {
                calcobj.clearData($(this).val());
            }
        })
    }

    makeDraggable(calcElem) {
        calcElem.css({
            zIndex: 999999
        });
        calcElem.draggable({
            // containment: 'body',
            scroll: true,
            scrollSpeed: 100,
            cursor: 'move',
            cancel: false,
            start: function(event, ui) {
                calcElem.find('#calc_icon').removeClass('maximize');
            },
            drag: function(event, ui) {

                //get mouse axis
                var xMouse = event.pageX;
                var yMouse = event.pageY;

                //get mouse axis inside the div
                xMouse = xMouse - ui.position.left;
                yMouse = yMouse - ui.position.top;

                //get offsets
                var contMinWidth = $('body').offset().left,
                    contMaxWidth = $('body').width() + contMinWidth,
                    contMinHeight = $('body').offset().top,
                    contMaxHeight = $('body').height() + contMinHeight,
                    calcWidth = this.offsetWidth,
                    calcHeight = this.offsetHeight;

                // mouse cursor restrictions

                //if the cursor tries to get outside from the bottom
                if (ui.position.top + yMouse > contMaxHeight) {
                    //stop it there
                    ui.position.top = contMaxHeight - yMouse;
                }
                //if the cursor tries to get outside from the top
                else if (ui.position.top + yMouse < contMinHeight) {
                    //stop it there
                    ui.position.top = contMinHeight - yMouse;
                }
                //if the cursor tries to get outside from the right
                if (ui.position.left + xMouse > contMaxWidth) {
                    //stop it there
                    ui.position.left = contMaxWidth - xMouse;
                }
                //if the cursor tries to get outside from the left
                else if (ui.position.left + xMouse < contMinWidth) {
                    //stop it there
                    ui.position.left = contMinWidth - xMouse;
                }

                // draggable outside of body restrictions

                //if the draggable tries to get outside from the bottom
                if (ui.position.top > contMaxHeight - calcHeight / 2) {
                    //allow only half of it outside
                    ui.position.top = contMaxHeight - calcHeight / 2;
                }
                //if the draggable tries to get outside from the top
                else if (ui.position.top < -calcHeight / 2) {
                    //allow only half of it outside
                    ui.position.top = -calcHeight / 2;
                }
                //if the draggable tries to get outside from the right
                if (ui.position.left > contMaxWidth - calcWidth / 2) {
                    //allow only half of it outside
                    ui.position.left = contMaxWidth - calcWidth / 2;
                }
                //if the draggable tries to get outside from the left
                else if (ui.position.left < -calcWidth / 2) {
                    //allow only half of it outside
                    ui.position.left = -calcWidth / 2;
                }
            },
            stop: function(event, ui) {
                setTimeout(function() {
                    calcElem.find('#calc_icon').addClass('maximize');
                }, 200);
            }
        });

    }

    handleWithKeyboard(calcobj) {
        $(document).off('keyup').on('keyup', function(event) {
            var operator = {
                107: '+',
                109: '-',
                106: '*',
                111: '/'
            };
            if (!isNaN(event.key) && event.keyCode !== 32) {
                calcobj.setValue(event.key);
            } else if (event.keyCode === 110) {
                calcobj.setValue('.');
            } else if (event.keyCode === 107 || event.keyCode === 109 || event.keyCode === 106 || event.keyCode === 111) {
                calcobj.setSign(operator[event.keyCode]);
            } else if (event.keyCode == 13) {
                calcobj.getResult();
            } else if (event.keyCode == 27) {
                calcobj.clearData('c');
            } else if (event.keyCode == 46) {
                calcobj.clearData('ce');
            } else if (event.keyCode == 8) {
                calcobj.clearData('bs');
            }
        });
    }

    calculatorShowHide() {
        var self = this;
        $(document).off('click', '.minimize').on('click', '.minimize', function() {
            $('#calc_icon').addClass('maximize').attr('aria-label', 'Maximize calculator');
            self.minimize();
            $(document).off("keyup");
        });
        $(document).off('click', '.maximize').on('click', '.maximize', function() {
            self.handleWithKeyboard(self.calcobj);
            self.maximize();
        });
        $(document).off('click', '.close-calculator').on('click', '.close-calculator', function() {
            self.closeCalculator();
            $(document).off("keyup");
        });
    }


    handleCalculatorFocus() {
        //focus handling
        // var self = this;
        this.calcElem.find(".close-calculator").off("keydown").on("keydown", function(event) {
            if (event.shiftKey && event.keyCode === 9) {
                $("[value='=']").focus();
                event.preventDefault();
            }
        });

        this.calcElem.find("[value='=']").off("keydown").on("keydown", function(event) {
            if (!event.shiftKey && event.keyCode === 9) {
                $(".close-calculator").focus();
                event.preventDefault();
            }
        });

    }

    seekEquation() {
        var self = this;
        $(".seekLeft").off("click").on("click", function() {
            $("#disp_eqn").css({
                "right": parseFloat($("#disp_eqn").css("right")) - 40 + "px"
            });
            self.checkSeekStatus();
        });
        $(".seekRight").off("click").on("click", function() {
            $("#disp_eqn").css({
                "right": parseFloat($("#disp_eqn").css("right")) + 40 + "px"
            });
            self.checkSeekStatus();
        });
    }

    checkSeekStatus() {
        if (parseFloat(this.calcobj._displayEqnDiv.style.right) < 0) {
            $(".seekRight").css("display", "inline-block");
        } else {
            $(".seekRight").css("display", "none");
        }

        if (parseFloat(this.calcobj._displayEqnDiv.style.right) >=
            -(this.calcobj._displayEqnDiv.innerText.length * 7 - this.calcobj._displayEqnDiv.parentElement.offsetWidth / 1.5)) {
            $(".seekLeft").css("display", "inline-block");
        } else {
            $(".seekLeft").css("display", "none");
        }
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
        setTimeout(function() {
            $("#calc").attr('tabindex', '0').focus();
            console.log($("#calc"));
        }, 1000);
        $("#calc").focusout(function() {
            $("#calc").removeAttr('tabindex');
        });
    }

    minimize() {
        document.getElementById("calc").style.display = "none";
        document.getElementById("calc_icon").style.display = "block";
        document.getElementById("calc_icon").focus();
    }

    closeCalculator() {
        // var display = document.getElementById('disp');
				// document.getElementById("calc_state").innerText = "calculator minimized";
        // document.getElementById("calc_state").style.display = "inline-block";
        // document.getElementById("calc_state").focus();
				document.getElementById("calculator").style.display = "none";
				document.getElementById("calculator").setAttribute("aria-hidden","true");
				document.getElementById("sr-text").innerHTML = "Calculator Minimized ";
				document.getElementById("sr-text").setAttribute("tab-index", "0");
				document.getElementById("sr-text").focus();
        setTimeout(function() {
            // document.getElementById("calc_state").style.display = "none";
						document.getElementById("sr-text").setAttribute("tab-index", "0");
            document.getElementById("show-calc").focus();
        }, 1500);

        // document.getElementById("drag").style.top = 0;
        // document.getElementById("drag").style.left = 0;
    }

}
