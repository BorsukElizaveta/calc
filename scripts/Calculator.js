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
    };
    /**
     * Выполняет сложение.
     */
    Calculator.prototype.addition = function () {
        this.calculate();
        this.operation = Operation.ADDITION;
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
export { Calculator };
//# sourceMappingURL=Calculator.js.map