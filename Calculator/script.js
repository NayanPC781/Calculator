class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previousOperand = `${this.currentOperand} ${operation}`;
        this.shouldResetScreen = true;
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.previousOperand = '';
                    this.operation = undefined;
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = (prev * current) / 100;
                break;
            default:
                return;
        }
        
        this.currentOperand = this.roundResult(computation);
        this.operation = undefined;
        this.previousOperand = '';
    }
    
    roundResult(number) {
        // Handle potential floating point issues by limiting decimal places
        return Math.round(number * 1000000) / 1000000;
    }

    getDisplayNumber(number) {
        if (number === 'Error') return 'Error';
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.textContent = this.previousOperand;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
    
    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9') this.appendNumber(e.key);
        if (e.key === '.') this.appendNumber(e.key);
        
        if (e.key === '+') this.chooseOperation('+');
        if (e.key === '-') this.chooseOperation('-');
        if (e.key === '*') this.chooseOperation('×');
        if (e.key === '/') this.chooseOperation('÷');
        if (e.key === '%') this.chooseOperation('%');

        if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            this.calculate();
            this.updateDisplay();
        }
        
        if (e.key === 'Backspace') {
            this.delete();
            this.updateDisplay();
        }
        
        if (e.key === 'Escape') {
            this.clear();
            this.updateDisplay();
        }
    }
}

// Initialize calculator when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.querySelector('.previous-operand');
    const currentOperandElement = document.querySelector('.current-operand');
    const calculator = new Calculator(previousOperandElement, currentOperandElement);

    // Set up number and decimal buttons
    document.querySelectorAll('.number, .decimal').forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.textContent);
            calculator.updateDisplay();
        });
    });

    // Set up operator buttons
    document.querySelectorAll('.operator').forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.textContent);
            calculator.updateDisplay();
        });
    });

    // Set up equals button
    document.querySelector('.equals').addEventListener('click', () => {
        calculator.calculate();
        calculator.updateDisplay();
    });

    // Set up clear button
    document.querySelector('.clear').addEventListener('click', () => {
        calculator.clear();
        calculator.updateDisplay();
    });

    // Set up delete button
    document.querySelector('.delete').addEventListener('click', () => {
        calculator.delete();
        calculator.updateDisplay();
    });
    
    // Set up keyboard support
    document.addEventListener('keydown', e => {
        calculator.handleKeyboard(e);
        calculator.updateDisplay();
    });
});