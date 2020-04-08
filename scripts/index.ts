//import {Calculator} from './Calculator';
//import {Controls} from './Controls';
//import {Display} from './Display';

class Display
{
    /**
     * Экран для отображения результата.
     */
    output: HTMLElement | null;

    constructor(output: HTMLElement | null)
    {
        this.output = output;
        //console.log("Display");
    }

    /**
     * Устанавливает значение.
     *
     */
    setValue( value: string ): void
    {
        // @ts-ignore
        this.output.textContent = value;
    }

    /**
     * Подготавливает число к отображения на экране.
     *
     */
    prepare( number: number ): string
    {
        return number.toPrecision( 11 )
            .replace( /(?:\.0*|(\.\d+?)0*)$/, '$1' );
    }
}


/**
 * Возможные значения текущей операции.
 */

enum Operation {NONE = 0, ADDITION = 1, SUBTRACTION = 2, MULTIPLICATION = 3, DIVISION = 4}

/**
 * Калькулятор.
 */
class Calculator
{
    display: Display;
    operation: number;
    numberA: number;
    numberB: number;
    value: string;

    constructor ( display: Display )
    {
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
    clear(): void
    {
        this.operation = Operation.NONE;
        this.numberA = 0;
        this.numberB = NaN;
        this.value = '';

        this.display.setValue( '0' );
    }

    /**
     * Удаляет последний символ.
     */
    backspace(): void
    {
        this.value = this.value.slice( 0, -1 );

        if ( this.value.length === 0 )
        {
            this.display.setValue( '0' );
        }
        else
        {
            this.display.setValue( this.value );
        }
    }

    /**
     * Обновляет отображаемое значение.
     */
    updateDisplay(): void
    {
        let numberToDisplay: number;

        if ( isNaN( this.numberA ) )
        {
            numberToDisplay = 0;
        }
        else if ( isNaN( this.numberB ) )
        {
            numberToDisplay = this.numberA;
        }
        else
        {
            numberToDisplay = this.numberB;
        }

        this.display.setValue(
            this.display.prepare( numberToDisplay )
        );
    }

    /**
     * Выполняет вычисление текущего значения, если необходимо.
     */
    calculate(): void
    {
        let numberA: number = this.numberA;
        const numberB: number = this.numberB;

        if (
            isNaN( numberA )
            || isNaN( numberB )
        )
        {
            this.value = '';

            return;
        }

        switch ( this.operation )
        {
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
                throw new Error( 'Unknown operation' );
        }

        this.numberA = numberA;
        this.numberB = NaN;
        this.operation = Operation.NONE;
        this.value = '';

        this.updateDisplay();
    }

    addDigit( value: string ): void
    {
        if ( !/^\d$/.test( value ) )
        {
            throw new Error( `Incorrect number value "${value}".` );
        }

        if (
            !this.value
            && ( this.operation === Operation.NONE )
        )
        {
            this.clear();
        }

        if ( Number( this.value ) === 0 )
        {
            this.value = ( ( this.value[0] === '-' ) ? '-' : '' ) + value;
        }
        else
        {
            this.value += value;
        }

        this.display.setValue( this.value );

        if ( this.operation === Operation.NONE )
        {
            this.numberA = Number( this.value );
        }
        else
        {
            this.numberB = Number( this.value );
        }
    }

    /**
     * Ставит десятичный разделитель.
     */
    period(): void
    {
        if ( this.value.indexOf( '.' ) === -1 )
        {
            this.value += (
                ( this.value.length === 0 )
                    ? '0.'
                    : '.'
            );
            this.display.setValue( this.value );
        }
    }

    /**
     * Изменяет знак числа.
     */
    changeSign(): void
    {
        if (
            !this.value
            && this.numberA
        )
        {
            this.value = this.numberA.toString();
        }

        if ( this.value[0] === '-' )
        {
            this.value = this.value.substr( 1 );
        }
        else
        {
            this.value = '-' + this.value;
        }

        this.display.setValue( this.value );

        if ( this.value === '-' )
        {
            return;
        }

        if ( this.operation === Operation.NONE )
        {
            this.numberA = Number( this.value );
        }
        else
        {
            this.numberB = Number( this.value );
        }
    }

    /**
     * Вычисляет квадратный корень.
     */
    squareRoot(): void
    {
        this.calculate();
        this.numberA = Math.sqrt( this.numberA );
        this.updateDisplay();
        //console.log("sqard");
    }

    /**
     * Выполняет сложение.
     */
    addition(): void
    {
        this.calculate();
        this.operation = Operation.ADDITION;
        //console.log("add");
    }

    /**
     * Выполняет вычитание.
     */
    subtraction(): void
    {
        this.calculate();
        this.operation = Operation.SUBTRACTION;
    }

    /**
     * Выполняет умножение.
     */
    multiplication(): void
    {
        this.calculate();
        this.operation = Operation.MULTIPLICATION;
    }

    /**
     * Выполняет деление.
     */
    division(): void
    {
        this.calculate();
        this.operation = Operation.DIVISION;
    }
}

class Controls
{
    private calculator: Calculator;

    /**
     * Элементы управления калькулятором.
     */
    constructor(calculator: Calculator, buttons: NodeList) {
        /** @type {Calculator} */
        this.calculator = calculator;
        //console.log('click Controls');
        const onButtonClick = ( event: { target: any; } ) =>
        {
            const target: HTMLButtonElement = ( event.target );
            const action = target.dataset.action;
            const value = target.dataset.value;
            //console.log('click');
            this.doAction( action, value );
        };

        // @ts-ignore
        for ( const button of buttons )
        {
            button.addEventListener( 'click', onButtonClick );
        }
    }

    doAction( action: string | undefined, value: string | undefined ): void
    {
        switch ( action )
        {
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
                if ( !value )
                {
                    throw new Error( 'Digit action should be with value' );
                }
                this.calculator.addDigit( value );
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
                throw new Error( 'Unknown action' );
        }
    }
}

function main() : void
{
    const outputElement:HTMLElement | null = document.getElementById( 'display' );
    const display: Display = new Display( outputElement );
    const calculator: Calculator = new Calculator( display );
    const buttons: NodeList = document.querySelectorAll( 'div.buttons>button' );
    new Controls( calculator, buttons );
};

//console.log(212);
main();
