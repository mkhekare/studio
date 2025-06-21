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

const getAvailableModelFamilies = ai.defineTool(
    {
      name: 'getAvailableModelFamilies',
      description: 'Returns a list of available machine learning model families to choose from.',
      inputSchema: z.object({}),
      outputSchema: z.array(z.string()),
    },
    async () => [
      'Linear Models',
      'Decision Trees',
      'Support Vector Machines',
      'Neural Networks',
      'Bayesian Models',
      'Clustering Algorithms',
      'Dimensionality Reduction Techniques',
      'Ensemble Methods (e.g., Random Forest, XGBoost)',
    ]
);

const prompt = ai.definePrompt({
  name: 'mlModelSuggestionPrompt',
  input: {schema: MlModelSuggestionInputSchema},
  output: {schema: MlModelSuggestionOutputSchema},
  tools: [getAvailableModelFamilies],
  prompt: `You are an expert in machine learning model selection. Your task is to recommend suitable model families for a given dataset and problem type.

  1. Use the 'getAvailableModelFamilies' tool to see the list of model families you can recommend.
  2. Analyze the provided dataset description and problem type.
  3. Select the most appropriate model families from the available list.
  4. Provide a detailed 'reasoning' for your selection, explaining why each recommended model is a good fit. Justify your choices based on data size, feature types, linearity, robustness to issues like outliers, and interpretability needs.

  Dataset Description: {{{datasetDescription}}}
  Problem Type: {{{problemType}}}

  Your output must be a JSON object conforming to the output schema, containing the 'recommendedModels' array and the 'reasoning' string.
`,
});

const recommendMlModelsFlow = ai.defineFlow(
  {
    name: 'recommendMlModelsFlow',
    inputSchema: MlModelSuggestionInputSchema,
    outputSchema: MlModelSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
