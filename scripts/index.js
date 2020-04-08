"use strict";
//import {Calculator} from './Calculator';
//import {Controls} from './Controls';
//import {Display} from './Display';
var Display = /** @class */ (function () {
    function Display(output) {
        this.output = output;
        //console.log("Display");
    }
    /**
     * Устанавливает значение.
     *
     */
    Display.prototype.setValue = function (value) {
        // @ts-ignore
        this.output.textContent = value;
    };
    /**
     * Подготавливает число к отображения на экране.
     *
     */
    Display.prototype.prepare = function (number) {
        return number.toPrecision(11)
            .replace(/(?:\.0*|(\.\d+?)0*)$/, '$1');
    };
    return Display;
}());
/**
 * Возможные значения текущей операции.
 */
var Operation;
(function (Operation) {
    Operation[Operation["NONE"] = 0] = "NONE";
    Operation[Operation["ADDITION"] = 1] = "ADDITION";
    Operation[Operation["SUBTRACTION"] = 2] = "SUBTRACTION";
    Operation[Operation["MULTIPLICATION"] = 3] = "MULTIPLICATION";
    Operation[Operation["DIVISION"] = 4] = "DIVISION";
})(Operation || (Operation = {}));
/**
 * Калькулятор.
 */
var Calculator = /** @class */ (function () {
    function Calculator(display) {
        this.display = display;
        this.numberA = 0;
        this.numberB = 0;
        this.value = '';
        this.operation = 0;
        this.clear();
    }
    /**
     * Сбрасывает состояние калькулятора.
     */
    Calculator.prototype.clear = function () {
        this.operation = Operation.NONE;
        this.numberA = 0;
        this.numberB = NaN;
        this.value = '';
        this.display.setValue('0');
    };
    /**
     * Удаляет последний символ.
     */
    Calculator.prototype.backspace = function () {
        this.value = this.value.slice(0, -1);
        if (this.value.length === 0) {
            this.display.setValue('0');
        }
        else {
            this.display.setValue(this.value);
        }
    };
    /**
     * Обновляет отображаемое значение.
     */
    Calculator.prototype.updateDisplay = function () {
        var numberToDisplay;
        if (isNaN(this.numberA)) {
            numberToDisplay = 0;
        }
        else if (isNaN(this.numberB)) {
            numberToDisplay = this.numberA;
        }
        else {
            numberToDisplay = this.numberB;
        }
        this.display.setValue(this.display.prepare(numberToDisplay));
    };
    /**
     * Выполняет вычисление текущего значения, если необходимо.
     */
    Calculator.prototype.calculate = function () {
        var numberA = this.numberA;
        var numberB = this.numberB;
        if (isNaN(numberA)
            || isNaN(numberB)) {
            this.value = '';
            return;
        }
        switch (this.operation) {
            case Operation.ADDITION:
                numberA += numberB;
                break;
            case Operation.SUBTRACTION:
                numberA -= numberB;
                break;
            case Operation.MULTIPLICATION:
                numberA *= numberB;
                break;
            case Operation.DIVISION:
                numberA /= numberB;
                break;
            case Operation.NONE:
                break;
            default:
                throw new Error('Unknown operation');
        }
        this.numberA = numberA;
        this.numberB = NaN;
        this.operation = Operation.NONE;
        this.value = '';
        this.updateDisplay();
    };
    Calculator.prototype.addDigit = function (value) {
        if (!/^\d$/.test(value)) {
            throw new Error("Incorrect number value \"" + value + "\".");
        }
        if (!this.value
            && (this.operation === Operation.NONE)) {
            this.clear();
        }
        if (Number(this.value) === 0) {
            this.value = ((this.value[0] === '-') ? '-' : '') + value;
        }
        else {
            this.value += value;
        }
        this.display.setValue(this.value);
        if (this.operation === Operation.NONE) {
            this.numberA = Number(this.value);
        }
        else {
            this.numberB = Number(this.value);
        }
    };
    /**
     * Ставит десятичный разделитель.
     */
    Calculator.prototype.period = function () {
        if (this.value.indexOf('.') === -1) {
            this.value += ((this.value.length === 0)
                ? '0.'
                : '.');
            this.display.setValue(this.value);
        }
    };
    /**
     * Изменяет знак числа.
     */
    Calculator.prototype.changeSign = function () {
        if (!this.value
            && this.numberA) {
            this.value = this.numberA.toString();
        }
        if (this.value[0] === '-') {
            this.value = this.value.substr(1);
        }
        else {
            this.value = '-' + this.value;
        }
        this.display.setValue(this.value);
        if (this.value === '-') {
            return;
        }
        if (this.operation === Operation.NONE) {
            this.numberA = Number(this.value);
        }
        else {
            this.numberB = Number(this.value);
        }
    };
    /**
     * Вычисляет квадратный корень.
     */
    Calculator.prototype.squareRoot = function () {
        this.calculate();
        this.numberA = Math.sqrt(this.numberA);
        this.updateDisplay();
        //console.log("sqard");
    };
    /**
     * Выполняет сложение.
     */
    Calculator.prototype.addition = function () {
        this.calculate();
        this.operation = Operation.ADDITION;
        //console.log("add");
    };
    /**
     * Выполняет вычитание.
     */
    Calculator.prototype.subtraction = function () {
        this.calculate();
        this.operation = Operation.SUBTRACTION;
    };
    /**
     * Выполняет умножение.
     */
    Calculator.prototype.multiplication = function () {
        this.calculate();
        this.operation = Operation.MULTIPLICATION;
    };
    /**
     * Выполняет деление.
     */
    Calculator.prototype.division = function () {
        this.calculate();
        this.operation = Operation.DIVISION;
    };
    return Calculator;
}());
var Controls = /** @class */ (function () {
    /**
     * Элементы управления калькулятором.
     */
    function Controls(calculator, buttons) {
        var _this = this;
        /** @type {Calculator} */
        this.calculator = calculator;
        //console.log('click Controls');
        var onButtonClick = function (event) {
            var target = (event.target);
            var action = target.dataset.action;
            var value = target.dataset.value;
            //console.log('click');
            _this.doAction(action, value);
        };
        // @ts-ignore
        for (var _i = 0, buttons_1 = buttons; _i < buttons_1.length; _i++) {
            var button = buttons_1[_i];
            button.addEventListener('click', onButtonClick);
        }
    }
    Controls.prototype.doAction = function (action, value) {
        switch (action) {
            case 'addition':
                this.calculator.addition();
                //console.log("add");
                break;
            case 'subtraction':
                this.calculator.subtraction();
                //console.log("sub");
                break;
            case 'multiplication':
                this.calculator.multiplication();
                //console.log("mull");
                break;
            case 'division':
                this.calculator.division();
                //console.log("div");
                break;
            case 'square-root':
                this.calculator.squareRoot();
                break;
            case 'digit':
                if (!value) {
                    throw new Error('Digit action should be with value');
                }
                this.calculator.addDigit(value);
                break;
            case 'period':
                this.calculator.period();
                break;
            case 'change-sign':
                this.calculator.changeSign();
                break;
            case 'calculate':
                this.calculator.calculate();
                break;
            case 'backspace':
                this.calculator.backspace();
                break;
            case 'clear':
                this.calculator.clear();
                break;
            default:
                throw new Error('Unknown action');
        }
    };
    return Controls;
}());
function main() {
    var outputElement = document.getElementById('display');
    var display = new Display(outputElement);
    var calculator = new Calculator(display);
    var buttons = document.querySelectorAll('div.buttons>button');
    new Controls(calculator, buttons);
}
;
//console.log(212);
main();
//# sourceMappingURL=index.js.map