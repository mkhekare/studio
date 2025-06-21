// src/ai/flows/ml-model-suggestion.ts
'use server';

/**
 * @fileOverview Recommends suitable machine learning models based on dataset characteristics and problem type.
 *
 * - recommendMlModels - A function that handles the ML model recommendation process.
 * - MlModelSuggestionInput - The input type for the recommendMlModels function.
 * - MlModelSuggestionOutput - The return type for the recommendMlModels function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MlModelSuggestionInputSchema = z.object({
  datasetDescription: z
    .string()
    .describe('A detailed description of the dataset, including its size, features, and data types.'),
  problemType: z
    .string()
    .describe('The type of machine learning problem to be solved (e.g., classification, regression, clustering).'),
});
export type MlModelSuggestionInput = z.infer<typeof MlModelSuggestionInputSchema>;

const MlModelSuggestionOutputSchema = z.object({
  recommendedModels: z
    .array(z.string())
    .describe('An array of recommended machine learning model families (e.g., linear models, decision trees, neural networks).'),
  reasoning: z
    .string()
    .describe('The reasoning behind the model recommendations, explaining why each model is suitable for the given dataset and problem type.'),
});
export type MlModelSuggestionOutput = z.infer<typeof MlModelSuggestionOutputSchema>;

export async function recommendMlModels(input: MlModelSuggestionInput): Promise<MlModelSuggestionOutput> {
  return recommendMlModelsFlow(input);
}

const modelFamilies = [
    'Linear Models',
    'Decision Trees',
    'Support Vector Machines',
    'Neural Networks',
    'Bayesian Models',
    'Clustering Algorithms',
    'Dimensionality Reduction Techniques',
];

const selectModelFamilies = async (input: MlModelSuggestionInput) => {
    // This is a placeholder; replace with actual logic to select model families.
    // For now, return a default selection.
    if (input.problemType.toLowerCase().includes('classification')) {
      return ['Linear Models', 'Decision Trees', 'Support Vector Machines'];
    } else if (input.problemType.toLowerCase().includes('regression')) {
      return ['Linear Models', 'Decision Trees', 'Neural Networks'];
    } else {
      return ['Clustering Algorithms'];
    }
  };

const MlModelPromptInputSchema = MlModelSuggestionInputSchema.extend({
  recommendedModels: z
    .array(z.string())
    .describe('A list of recommended model families.'),
});

const prompt = ai.definePrompt({
  name: 'mlModelSuggestionPrompt',
  input: {schema: MlModelPromptInputSchema},
  output: {schema: MlModelSuggestionOutputSchema},
  prompt: `You are an expert in machine learning model selection.

  Based on the dataset description, problem type, and a pre-selected list of model families, you will provide reasoning for the model suggestions.

  Dataset Description: {{{datasetDescription}}}
  Problem Type: {{{problemType}}}
  Recommended Model Families: {{#each recommendedModels}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Your task is to take the provided Recommended Model Families and generate a 'reasoning' for why these models are suitable for the given dataset and problem type. You must also return the same list of recommended models in your output.
`,
});

const recommendMlModelsFlow = ai.defineFlow(
  {
    name: 'recommendMlModelsFlow',
    inputSchema: MlModelSuggestionInputSchema,
    outputSchema: MlModelSuggestionOutputSchema,
  },
  async input => {
    const recommendedModels = await selectModelFamilies(input);
    const {output} = await prompt({...input, recommendedModels});
    return output!;
  }
);
