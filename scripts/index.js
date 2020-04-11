import { Calculator } from './Calculator';
import { Controls } from './Controls';
import { Display } from './Display';
function main() {
    const outputElement = document.getElementById('display');
    const display = new Display(outputElement);
    const calculator = new Calculator(display);
    const buttons = document.querySelectorAll('div.buttons>button');
    new Controls(calculator, buttons);
}
;
//console.log(212);
main();
//# sourceMappingURL=index.js.map