import React from 'react';
import { AIResponse } from '../types';

interface SolutionProps {
  solution: AIResponse | null;
}

export const Solution: React.FC<SolutionProps> = ({ solution }) => {
  if (!solution) {
    return (
      <div className="h-full flex items-center justify-center text-white/70 text-center">
        <div>
          <h3 className="text-xl font-medium mb-2">Ready to Solve</h3>
          <p>Enter your problem or upload an image to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Solution</h3>
        <span className="text-sm text-white/70">Solved by {solution.model}</span>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white/20 p-4 rounded-lg backdrop-blur">
          <h4 className="font-medium mb-2 text-white/90">Final Answer:</h4>
          <p className="text-lg">{solution.solution}</p>
        </div>

        {solution.steps.length > 0 && (
          <div className="bg-white/20 p-4 rounded-lg backdrop-blur">
            <h4 className="font-medium mb-3 text-white/90">Solution Steps:</h4>
            <ol className="list-decimal list-inside space-y-2">
              {solution.steps.map((step, index) => (
                <li key={index} className="text-white/90">{step}</li>
              ))}
            </ol>
          </div>
        )}

        {solution.explanation && (
          <div className="bg-white/20 p-4 rounded-lg backdrop-blur">
            <h4 className="font-medium mb-2 text-white/90">Explanation:</h4>
            <p className="text-white/90">{solution.explanation}</p>
          </div>
        )}

        <div className="flex items-center justify-end space-x-2 text-sm text-white/70">
          <span>Confidence Score:</span>
          <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${solution.confidence * 100}%` }}
            />
          </div>
          <span>{(solution.confidence * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}