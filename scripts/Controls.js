/**
 * Элементы управления калькулятором.
 */
var Controls = /** @class */ (function () {
    /**
     * Элементы управления калькулятором.
     */
    function Controls(calculator, buttons) {
        var _this = this;
        /** @type {Calculator} */
        this.calculator = calculator;
        var onButtonClick = function (event) {
            var target = (event.target);
            var action = target.dataset.action;
            var value = target.dataset.value;
            console.log('click');
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
                console.log("add");
                break;
            case 'subtraction':
                this.calculator.subtraction();
                console.log("sub");
                break;
            case 'multiplication':
                this.calculator.multiplication();
                console.log("mull");
                break;
            case 'division':
                this.calculator.division();
                console.log("div");
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
export { Controls };
//# sourceMappingURL=Controls.js.map