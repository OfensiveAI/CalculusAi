import { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Solution } from './components/Solution';
import { Calculator } from './components/Calculator';
import { AIService } from './services/aiService';
import { AIResponse } from './types';
import { Tab } from '@headlessui/react';
import { CalculatorIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const aiService = new AIService();

function App() {
  const [problem, setProblem] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [solution, setSolution] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState('0');
  const [aiQuestion, setAiQuestion] = useState('');

  const handleSolve = async (text: string = problem) => {
    if (!text && !image) return;
    
    setLoading(true);
    try {
      const result = await aiService.solveWithGemini(text, image || undefined);
      setSolution(result);
    } catch (error) {
      console.error('Error solving problem:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">AI Calculator</h1>
        
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-white/10 p-1 mb-6">
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white
              ${selected 
                ? 'bg-white/[0.12] shadow'
                : 'hover:bg-white/[0.12]'} 
              flex items-center justify-center space-x-2`
            }>
              <CalculatorIcon className="h-5 w-5" />
              <span>Calculator</span>
            </Tab>
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white
              ${selected 
                ? 'bg-white/[0.12] shadow'
                : 'hover:bg-white/[0.12]'}
              flex items-center justify-center space-x-2`
            }>
              <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
              <span>Ask AI</span>
            </Tab>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Calculator 
                    display={display} 
                    setDisplay={setDisplay}
                    setProblem={setProblem}
                  />

                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
                    <ImageUploader onImageUpload={setImage} />

                    <button
                      onClick={() => handleSolve()}
                      disabled={loading || (!problem && !image)}
                      className={`w-full mt-4 py-3 px-4 rounded-lg font-medium text-white transition-all transform hover:scale-105 ${
                        loading || (!problem && !image)
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg'
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : 'Solve Problem'}
                    </button>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl min-h-[600px]">
                  <Solution solution={solution} />
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
                    <div className="mb-4">
                      <label htmlFor="question" className="block text-sm font-medium text-white mb-2">
                        Ask anything about math, science, or history
                      </label>
                      <textarea
                        id="question"
                        rows={4}
                        className="w-full rounded-lg bg-white/5 border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Who discovered calculus? What is the theory of relativity?"
                        value={aiQuestion}
                        onChange={(e) => setAiQuestion(e.target.value)}
                      />
                    </div>

                    <button
                      onClick={() => handleSolve(aiQuestion)}
                      disabled={loading || !aiQuestion}
                      className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all transform hover:scale-105 ${
                        loading || !aiQuestion
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg'
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : 'Ask AI'}
                    </button>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl min-h-[600px]">
                  <Solution solution={solution} />
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}

export default App;