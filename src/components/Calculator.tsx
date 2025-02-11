import React from 'react';
import { BackspaceIcon } from '@heroicons/react/24/outline';

interface CalculatorProps {
  display: string;
  setDisplay: React.Dispatch<React.SetStateAction<string>>;
  setProblem: (value: string) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ display, setDisplay, setProblem }) => {
  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op: string) => {
    setDisplay(prev => prev + ' ' + op + ' ');
  };

  const handleBackspace = () => {
    setDisplay(prev => {
      if (prev.length <= 1) return '0';
      // Remove trailing space if deleting an operator
      if (prev.endsWith(' ')) {
        return prev.slice(0, -3);
      }
      return prev.slice(0, -1);
    });
  };

  const calculateResult = (expression: string): number => {
    // Replace × with * and ÷ with / for JavaScript evaluation
    const sanitizedExpression = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/');
    
    try {
      // Use Function instead of eval for better security
      return new Function('return ' + sanitizedExpression)();
    } catch (error) {
      console.error('Calculation error:', error);
      return NaN;
    }
  };

  const handleEquals = () => {
    try {
      // Calculate the result immediately
      const result = calculateResult(display);
      
      if (!isNaN(result)) {
        // Update display with the result
        setDisplay(result.toString());
        
        // Send to AI for explanation
        const problemDescription = `Calculate and explain step by step: ${display} = ${result}`;
        setProblem(problemDescription);
      } else {
        setDisplay('0');
      }
    } catch (error) {
      setDisplay('0');
    }
  };

  const handleSpecialFunction = (func: string) => {
    switch (func) {
      case 'sqrt': {
        const num = parseFloat(display);
        const result = Math.sqrt(num);
        setDisplay(result.toString());
        setProblem(`Calculate the square root of ${num} = ${result}`);
        break;
      }
      case 'square': {
        const num = parseFloat(display);
        const result = num * num;
        setDisplay(result.toString());
        setProblem(`Calculate ${num} squared = ${result}`);
        break;
      }
      case 'sin': {
        const num = parseFloat(display);
        const result = Math.sin(num * Math.PI / 180);
        setDisplay(result.toFixed(6));
        setProblem(`Calculate sin(${num}°) = ${result}`);
        break;
      }
      case 'cos': {
        const num = parseFloat(display);
        const result = Math.cos(num * Math.PI / 180);
        setDisplay(result.toFixed(6));
        setProblem(`Calculate cos(${num}°) = ${result}`);
        break;
      }
      case 'tan': {
        const num = parseFloat(display);
        const result = Math.tan(num * Math.PI / 180);
        setDisplay(result.toFixed(6));
        setProblem(`Calculate tan(${num}°) = ${result}`);
        break;
      }
      case 'clear': {
        setDisplay('0');
        setProblem('');
        break;
      }
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl">
      <div className="bg-gray-700 p-4 rounded-lg mb-4 overflow-x-auto relative">
        <div className="text-right text-white text-3xl font-mono whitespace-nowrap">
          {display}
        </div>
        <button
          onClick={handleBackspace}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white/90 transition-colors"
          aria-label="Backspace"
        >
          <BackspaceIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: '√', func: 'sqrt' },
          { label: 'x²', func: 'square' },
          { label: 'sin', func: 'sin' },
          { label: 'cos', func: 'cos' },
          { label: 'tan', func: 'tan' },
          { label: 'C', func: 'clear' }
        ].map((btn) => (
          <button
            key={btn.func}
            onClick={() => handleSpecialFunction(btn.func)}
            className="bg-indigo-600 text-white p-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-lg"
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          ['7', '8', '9', '÷'],
          ['4', '5', '6', '×'],
          ['1', '2', '3', '-'],
          ['0', '.', '=', '+']
        ].map((row, i) => (
          <React.Fragment key={i}>
            {row.map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  if (['+', '-', '×', '÷'].includes(btn)) handleOperator(btn);
                  else if (btn === '=') handleEquals();
                  else handleNumber(btn);
                }}
                className={
                  btn === '=' ? 'bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-xl font-semibold transition-all duration-200 shadow-lg hover:scale-105 active:scale-95' :
                  ['÷', '×', '-', '+'].includes(btn) ? 'bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg text-xl font-semibold transition-all duration-200 shadow-lg hover:scale-105 active:scale-95' :
                  'bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-lg text-xl font-semibold transition-all duration-200 shadow-lg hover:scale-105 active:scale-95'
                }
              >
                {btn}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};