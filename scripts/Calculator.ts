import { Display } from './Display';


/**
 * Возможные значения текущей операции.
 */

enum Operation {NONE = 0, ADDITION = 1, SUBTRACTION = 2, MULTIPLICATION = 3, DIVISION = 4}

/**
 * Калькулятор.
 */
export class Calculator
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
    }

    /**
     * Выполняет сложение.
     */
    addition(): void
    {
        this.calculate();
        this.operation = Operation.ADDITION;
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