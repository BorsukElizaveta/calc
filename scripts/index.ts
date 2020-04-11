import {Calculator} from './Calculator';
import {Controls} from './Controls';
import {Display} from './Display';

function main() : void
{
    const outputElement:HTMLElement | null = document.getElementById( 'display' );
    const display: Display = new Display( outputElement );
    const calculator: Calculator = new Calculator( display );
    const buttons: NodeList = document.querySelectorAll( 'div.buttons>button' );
    new Controls( calculator, buttons );
}

main();
