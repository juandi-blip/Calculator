const display = document.getElementById('display');
const items = document.querySelectorAll('.item');

let currentInput = '';
let previousInput = '';
let operator = '';

items.forEach(item => {
    item.addEventListener('click', () => {
        const type = item.dataset.type;
        const value = item.textContent;

        if (type === 'clear') {
            if (value === 'C') {
                
                currentInput = '';
                previousInput = '';
                operator = '';
                display.value = '';
            } else if (value === 'del') {
                if (currentInput !== '') {
                    currentInput = currentInput.slice(0, -1);
                }
                else if (operator !== '') {
                    operator = '';
                    currentInput = previousInput;
                    previousInput = '';
                }
                else if (previousInput !== '') {
                    previousInput = previousInput.slice(0, -1);
                }
                display.value = previousInput + operator + currentInput;
            }
        } else if (type === 'operator') {
            // Si no hay número nuevo, solo reemplazar el operador
            if (currentInput === '' && operator !== '') {
                operator = value;
                display.value = previousInput + operator;
                return;
            }

            // Acumular expresión si ya hay operador y número
            if (currentInput !== '' && operator !== '') {
                previousInput = previousInput + operator + currentInput;
            } else {
                previousInput = currentInput;
            }
            operator = value;
            currentInput = '';
            display.value = previousInput + operator;
       
        } else if (type === 'equals') {
            if (previousInput === '' || currentInput === '' || operator === '') return;
            calculate();
            operator = '';
            previousInput = '';
        } else {
            // Es un número o punto decimal
            if (value === '.' && currentInput.includes('.')) return;
            currentInput += value;
            display.value = previousInput + operator + currentInput;

        }
    });
});

function calculate() {
    try {
        let expression = previousInput + operator + currentInput;
        expression = expression.replace(/x/g, '*');
        
        let result = Function('"use strict"; return (' + expression + ')')();
        
        if (!isFinite(result)) {
            throw new Error('Invalid calculation');
        }

        result = parseFloat(result.toFixed(10));
        
        display.value = result;
        currentInput = result.toString();
        previousInput = '';
        operator = '';
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        previousInput = '';
        operator = '';
    }
}
