
import { GoogleGenAI, Type } from "@google/genai";
import type { WalkthroughStep } from '../types';
import { MOCK_WALKTHROUGH_STEPS } from '../constants';

// This is a mocked version for the web preview.
// In a real application, this would make a network request to the Gemini API.
export const generateReviewWalkthrough = async (diff: string): Promise<WalkthroughStep[]> => {
  console.log("Simulating Gemini API call with diff:", diff);

  // In a real implementation, you would use the Gemini API like this:
  /*
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Analyze the following git diff for a GitHub Pull Request. 
    Generate a high-level walkthrough of the changes. 
    Focus on summarizing the main purpose of the changes, such as new components, hooks, or significant logic updates.
    Provide the response as a JSON array of objects, where each object represents a step in the walkthrough.

    Each object must have the following properties:
    - id: a unique number for the step.
    - title: a short, descriptive title (e.g., "New Hook: useUserData").
    - description: a one-sentence explanation of the change.
    - file: the full path of the most relevant file for this step.
    - line: the most relevant line number in that file to scroll to.

    Here is the diff:
    ---
    ${diff}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              file: { type: Type.STRING },
              line: { type: Type.NUMBER },
            },
            required: ["id", "title", "description", "file", "line"],
          },
        },
      },
    });

    const resultText = response.text.trim();
    const steps = JSON.parse(resultText);
    return steps;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate review from Gemini API.");
  }
  */

  // Mocked response for web preview
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_WALKTHROUGH_STEPS);
    }, 1500);
  });
};