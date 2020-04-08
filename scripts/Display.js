/**
 * Экран для отображения результата.
 */
var Display = /** @class */ (function () {
    function Display(output) {
        this.output = output;
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
export { Display };
//# sourceMappingURL=Display.js.map