/**
 * Экран для отображения результата.
 */
export class Display {
    constructor(output) {
        this.output = output;
    }
    /**
     * Устанавливает значение.
     *
     */
    setValue(value) {
        // @ts-ignore
        this.output.textContent = value;
    }
    /**
     * Подготавливает число к отображения на экране.
     *
     */
    prepare(number) {
        return number.toPrecision(11)
            .replace(/(?:\.0*|(\.\d+?)0*)$/, '$1');
    }
}
//# sourceMappingURL=Display.js.map