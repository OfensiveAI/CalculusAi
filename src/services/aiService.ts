import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIResponse } from '../types';

export class AIService {
  private geminiAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Gemini API key not found. Please add it to your .env file.');
    }
    this.geminiAI = new GoogleGenerativeAI(apiKey || '');
  }

  async solveWithGemini(prompt: string, image?: File): Promise<AIResponse> {
    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        return {
          solution: 'API key not configured',
          explanation: 'Please add your Gemini API key to the .env file to use the AI calculator.',
          steps: ['1. Create a .env file in the project root', '2. Add VITE_GEMINI_API_KEY=your-api-key'],
          confidence: 1,
          model: 'System'
        };
      }

      const model = this.geminiAI.getGenerativeModel({ model: 'gemini-pro' });
      let result;
      
      const enhancedPrompt = this.createEnhancedPrompt(prompt);
      
      if (image) {
        const imageModel = this.geminiAI.getGenerativeModel({ model: 'gemini-pro-vision' });
        const imageData = await this.processImage(image);
        result = await imageModel.generateContent([enhancedPrompt, imageData]);
      } else {
        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: "You are a highly knowledgeable AI assistant with deep expertise in science, mathematics, and the history of scientific discoveries. You have access to comprehensive information about scientists, theories, equations, and their real-world applications."
            },
            {
              role: "model",
              parts: "I understand that I am an AI assistant with extensive knowledge in science, mathematics, and scientific history. I will provide detailed, accurate information about scientists, theories, equations, and their practical applications, drawing from a comprehensive understanding of these subjects."
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        });

        result = await chat.sendMessage(enhancedPrompt);
      }
      
      const response = await result.response;
      const text = response.text();
      
      return this.parseAIResponse(text, 'Gemini');
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        solution: 'Error processing request',
        explanation: 'There was an error processing your request. Please try again.',
        steps: [],
        confidence: 0,
        model: 'Error'
      };
    }
  }

  private createEnhancedPrompt(userPrompt: string): string {
    const isQuestion = userPrompt.toLowerCase().includes('who') || 
                      userPrompt.toLowerCase().includes('what') || 
                      userPrompt.toLowerCase().includes('how') || 
                      userPrompt.toLowerCase().includes('why');

    if (isQuestion) {
      return `As a knowledgeable AI with extensive understanding of science, mathematics, and history:

Provide a comprehensive response about: ${userPrompt}

Include:
1. A clear, direct answer
2. Historical context and significance
3. Key contributions or discoveries
4. Related scientific principles or equations
5. Modern applications or influence
6. Important dates and milestones
7. Connections to other scientific concepts

Format the response with clear sections:
- Main Answer
- Historical Context
- Key Contributions
- Scientific Impact
- Modern Relevance

Be thorough and accurate, citing specific examples and details.`;
    }

    return `As an expert in mathematics and science, solve this problem:

${userPrompt}

Provide:
1. The final answer/solution
2. Step-by-step explanation
3. Relevant formulas or principles used
4. Real-world applications
5. Related concepts to explore

Show all work clearly and explain each step thoroughly.`;
  }

  private async processImage(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private parseAIResponse(text: string, model: string): AIResponse {
    const sections = text.split('\n\n');
    
    let solution = '';
    let explanation = '';
    const steps: string[] = [];
    
    const mainAnswerIndex = sections.findIndex(s => 
      s.toLowerCase().includes('main answer:') || 
      s.toLowerCase().includes('solution:') ||
      s.toLowerCase().includes('final answer:')
    );

    if (mainAnswerIndex !== -1) {
      solution = sections[mainAnswerIndex].split(':')[1].trim();
      explanation = sections
        .filter((_, index) => index !== mainAnswerIndex)
        .join('\n\n');
    } else {
      solution = sections[0];
      explanation = sections.slice(1).join('\n\n');
    }

    sections.forEach(section => {
      if (section.toLowerCase().includes('step') || 
          section.toLowerCase().includes('key contribution') ||
          section.toLowerCase().includes('scientific impact')) {
        steps.push(section.trim());
      }
    });

    return {
      solution: solution || 'Analysis provided in explanation',
      explanation: explanation || text,
      steps: steps,
      confidence: 0.98,
      model
    };
  }
}