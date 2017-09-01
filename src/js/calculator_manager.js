import Calculator from "./calculator.js";
import {
    calculator_data
} from './calculator_config.js';
export default class CalculatorManger {
    createCalculator() {
        let calculatordiv =
            `<div id="calculator-680e55ef-24d9-4b9c-9390-ad2c6a09af6f" tabindex="0">
                <div id="drag">                
                    <table id="calc" cellpadding="0" cellspacing="0">
                        <tr>
                            <td colspan="4">
								<span id="calc_state" class="sr-only" aria-hidden="true"></span>
                                <button type="button" role="button" class="close-calculator" aria-label="Hide">Hide</button>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                    <div class="disp-holder">
                                      <div id="calcForm" class="disp-eqn-outer" aria-labelledby="hidden-text-equation">
                                            <span id="hidden-text-equation" class="sr-only" aria-live="assertive" aria-atomic="true"></span>
                                            <input type="text" class="disp_btn" id="disp_eqn" tabindex="0">
                					    	<input type="submit" style="display:none;"/>
               					      </div>
               						  <div class="disp_btn_outer">
               						      <span id="hidden-text-result" class="sr-only" aria-live="polite" aria-atomic="true"></span>
                                          <span class="disp_btn" id="disp" tabindex="0" role="textbox" aria-label="result"></span>
                                      </div>
                                    </div>
                            </td>
                        </tr>                       
                        ${calculator_data.map((rowData) => {
                return `<tr>
                          ${rowData.map((columnData) => {
                    return `<td>${this._createCalculatorButton(columnData)}</td>`;
                }).join("")}
                        </tr>`;
            }).join("")}
                    </table>
                </div>
            </div>`;

        this.calcElem = this._attachCalculatorBody(calculatordiv);
        let _displayResult = this.calcElem.find("#disp").get(0),
            _displayEqn = this.calcElem.find("#disp_eqn").get(0);
        this.calcobj = new Calculator(_displayResult, _displayEqn);
        this._operateCalculator(this.calcobj);
        this._makeDraggable(this.calcElem);
        this.handleWithKeyboard(this.calcobj);
        this._calculatorShowHide();
        this._handleCalculatorFocus();
        this.calcElem.focus();
        this._calcInitialOpen = false;
    }

    _attachCalculatorBody(calculatorStr) {
        let calculatorElm = $(calculatorStr);
        calculatorElm.find('table').css('display', 'block');
        $('body').prepend(calculatorElm);
        return calculatorElm;
    }

    _createCalculatorButton(columnData) {
        let elemValue = columnData.value,
            label = (columnData.label) ? 'aria-label="' + columnData.label + '"' : '',
            operation = columnData.operation,
            id = "btn" + columnData.operation,
            tabOrder = columnData.tabindex;
        // return '<button type="button" role="button" class="btn opeationButton" ' + label + ' operation="' + operation + '"  value="' + elemValue + '"  id="' + id + '"tabindex="' + tabOrder + '">' + columnData.name + '</button><span class="sr-only">&nbsp;</span>';
        return '<button type="button" role="button" class="btn opeationButton" ' + label + ' operation="' + operation + '"  value="' + elemValue + '"  id="' + id + '">' + columnData.name + '</button>';
    }

    _operateCalculator(calcobj) {
        this._getElement(".opeationButton", true).off('click').on('click', (e) => {
            let $this = $(e.currentTarget),
                operation = $this.attr('operation');
            if (operation === "setValue") {
                calcobj.setValue($this.val(), e);
            } else if (operation === "setSign") {
                calcobj.setSign($this.val());
            } else if (operation === "getResult") {
                calcobj.getResult();
            } else if (operation === "negate") {
                calcobj.negateValue();
            } else {
                calcobj.clearData($this.val());
            }
            
        });
    }

    _makeDraggable(calcElem) {
        calcElem.css({
            zIndex: 999999
        });
        calcElem.draggable({
            scroll: true,
            scrollSpeed: 100,
            cursor: 'move',
            cancel: false,
            start: () => {
                calcElem.find('#calc_icon').removeClass('maximize');
            },
            drag: (event, ui) => {

                //get mouse axis
                let xMouse = event.pageX,
                    yMouse = event.pageY,
                    $this = event.target,
                //get offsets
                    bodySelector = $('body'),
                    contMinWidth = bodySelector.offset().left,
                    contMaxWidth = bodySelector.width() + contMinWidth,
                    contMinHeight = bodySelector.offset().top,
                    contMaxHeight = bodySelector.height() + contMinHeight,
                    calcWidth = $this.offsetWidth,
                    calcHeight = $this.offsetHeight;

                //get mouse axis inside the div
                xMouse = xMouse - ui.position.left;
                yMouse = yMouse - ui.position.top;


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
            stop: () => {
                setTimeout(function () {
                    calcElem.find('#calc_icon').addClass('maximize');
                }, 200);
            }
        });

    }

    handleWithKeyboard(calcobj) {
        $(document).off('keyup').on('keyup', (event) => {
            let operator = {
                107: '+',
                109: '-',
                106: '*',
                111: '/'
            };
            if (!isNaN(event.key) && event.keyCode !== 32) {
                this._getElement("#disp_eqn", true).focus();
                calcobj.setValue(event.key, event);
            } else if (event.keyCode === 110) {
                calcobj.setValue('.', event);
                this._getElement("#disp_eqn", true).focus();
            } else if (event.keyCode === 107 || event.keyCode === 109 || event.keyCode === 106 || event.keyCode === 111) {
                calcobj.setSign(operator[event.keyCode]);
                this._getElement("#disp_eqn", true).focus();
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

    _calculatorShowHide() {
        let self = this;
        this._getElement(".close-calculator", true).off('click').on('click', () => {
            self.closeCalculator();
            $(document).off("keyup");
        });
    }


    _handleCalculatorFocus() {
        let self = this;
        this._getElement(".close-calculator").off("keydown").on("keydown", (event) => {
            if (event.shiftKey && event.keyCode === 9) {
                $("[value='=']").focus();
                event.preventDefault();
            }
        });

        this._getElement(".close-calculator").off("focusout").on("focusout", (event)=> {
            self._getElement("#disp_eqn", true)[0].focus();
        });

        this._getElement("[value='=']").off("keydown").on("keydown", (event) => {
            if (!event.shiftKey && event.keyCode === 9) {
                this._getElement(".close-calculator", true).focus();
                event.preventDefault();
            }
        });

        this.calcElem.off("click").on("click", (event) => {
            if (event.target.tagName === "BUTTON") {
                event.target.focus();
            }
            if (this._calcInitialOpen) {
                // this.changeLabel();
                this._calcInitialOpen = false;
            }
        });

        this._getElement(".btn", true).keypress(function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                e.stopPropagation();
                self._getElement("#btngetResult").focus();
            }
            if (this._calcInitialOpen) {
                // this.changeLabel();
                this._calcInitialOpen = false;
            }
        });

        this.calcElem.children().on("focusin", (event) => {
            this._setActive(event.target);
        });

        this.calcElem.children().on("mouseover", (event) => {
            this._setActive(event.target);
        });


       this._getElement("#calcForm input", true).keydown(function (e) {
           if (e.keyCode !== 9) {
                e.preventDefault();
                return false;
            }
       });
        // this._getElement("#calcForm", true).submit(function (e) {
        //     e.preventDefault();
        //     setTimeout(function () {
        //         self._getElement("#disp_eqn", true).focus();
        //         self.calcobj._evalResult();
        //     },10);
        // });
        // this._getElement("#calcForm", true).keyup(function (e) {
        //     if (e.keyCode === 13) {
        //         console.log("keyUp");
        //         $("#disp_eqn").focus();
        //     }
        // });

        // this._getElement("#disp_eqn", true).keypress(function (e) {
        //     console.log("ting");
        //     e = e || window.event;
        //     var charCode = e.which || e.keyCode;
        //     if (charCode == 13) {
        //         self._setEndOfContenteditable(window, 4);
        //         return false;
        //     }
        // });
    }

    _setEndOfContenteditable(contentEditableElement) {
        var range, selection;
        if (document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
        {
            range = document.createRange();//Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection();//get the selection object (allows you to change selection)
            selection.removeAllRanges();//remove any selections already made
            selection.addRange(range);//make the range you have just created the visible selection
        }
        else if (document.selection)//IE 8 and lower
        {
            range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
            range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            range.select();//Select the range (make it the visible selection
        }
    }

    _setActive(elem) {
        let containsActive = this._getElement(".active");
        for (let i = 0; i < containsActive.length; i++) {
            containsActive[i].classList.remove("active");
        }
        if (elem.tagName == "BUTTON") {
            elem.classList.add("active");
        }
    }

    _getElement(selector, shouldWrap) {
        return !!shouldWrap ? $(this.calcElem.find(selector)) : this.calcElem.find(selector);
    }

    // _seekEquation() {
    //     let self = this,
    //         eqnDiv = $(self.calcobj._displayEqnDiv);
    //     this._getElement(".seekLeft", true).off("click").on("click", () => {
    //         eqnDiv.css({
    //             "right": parseFloat(eqnDiv.css("right")) - 80 + "px"
    //         });
    //         self._checkSeekStatus();
    //     });
    //     this._getElement(".seekRight", true).off("click").on("click", () => {
    //         eqnDiv.css({
    //             "right": parseFloat(eqnDiv.css("right")) + 80 + "px"
    //         });
    //         self._checkSeekStatus();
    //     });
    // }
    //
    // _checkSeekStatus() {
    //     if (parseFloat(this.calcobj._displayEqnDiv.style.right) < 0) {
    //         this._getElement(".seekRight", true).css("display", "inline-block");
    //         this._getElement(".seekRight", true).attr("aria-label", "right");
    //     } else {
    //         this._getElement(".seekRight", true).css("display", "none");
    //     }
    //
    //     if (parseFloat(this.calcobj._displayEqnDiv.style.right) >= -(this.calcobj._displayEqnDiv.innerText.length * 8 - this.calcobj._displayEqnDiv.parentElement.offsetWidth)) {
    //         this._getElement(".seekLeft", true).css("display", "inline-block");
    //     } else {
    //         this._getElement(".seekLeft", true).css("display", "none");
    //     }
    // }
    //
    // changeLabel() {
    //     let buttons = this._getElement("button[aria-label]"),
    //         label;
    //     for (let i = 0; i < buttons.length - 1; i++) {
    //         if (buttons[i].getAttribute("aria-label").indexOf("button") < 0) {
    //             label = buttons[i].getAttribute("aria-label").split("button")[0].trim() + " button";
    //             buttons[i].setAttribute("aria-label", label);
    //         } else {
    //             label = buttons[i].getAttribute("aria-label").split("button")[0].trim();
    //             buttons[i].setAttribute("aria-label", label);
    //         }
    //     }
    // }

    closeCalculator() {
        let self = this;
        // self.changeLabel();
        self._getElement("#calc_state")[0].removeAttribute("aria-hidden");
        self._getElement("#calc_state").css("display", "inline-block");
        self._getElement("#calc_state")[0].setAttribute("tabindex", "0");
        self._getElement("#calc_state")[0].innerText = "Calculator Hidden";
        self._getElement("#calc_state")[0].focus();
        setTimeout(function () {
            self._getElement("#calc_state")[0].setAttribute("aria-hidden", "true");
            self._getElement("#calc_state")[0].removeAttribute("tabindex");
            self.calcElem.get(0).style.display = "none";
            document.getElementById("show-calc") && document.getElementById("show-calc").focus();
        }, 800);
    }
}
