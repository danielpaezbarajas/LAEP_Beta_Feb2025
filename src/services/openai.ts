import OpenAI from 'openai';
import { AssessmentCriteria } from '../types';
import i18n from 'i18next';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeDocument(
  document: string,
  criteria: AssessmentCriteria
): Promise<{ score: number; analysis: string }> {
  const prompt = `
    You are an expert document assessor. Analyze the following document content based on this criterion.
    Provide the analysis in ${i18n.language} language.
    
    Criterion: ${criteria.title}
    Description: ${criteria.description}
    Maximum Score: ${criteria.maxScore}
    
    Document content:
    ${document}
    
    Provide a detailed analysis and a score out of ${criteria.maxScore}. Format your response as JSON with two fields:
    - score: number between 0 and ${criteria.maxScore}
    - analysis: detailed explanation of the assessment in ${i18n.language} language
  `;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-turbo-preview",
    response_format: { type: "json_object" }
  });

  const response = JSON.parse(completion.choices[0].message.content || "{}");
  return {
    score: response.score,
    analysis: response.analysis
  };
}