'use server';

/**
 * @fileOverview Data diagnosis AI agent.
 *
 * - dataDiagnosis - A function that handles the data diagnosis process.
 * - DataDiagnosisInput - The input type for the dataDiagnosis function.
 * - DataDiagnosisOutput - The return type for the dataDiagnosis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DataDiagnosisInputSchema = z.object({
  datasetDescription: z
    .string()
    .describe('A description of the dataset, including its purpose and structure.'),
  dataSample: z.string().describe('A representative sample of the data in CSV format.'),
});
export type DataDiagnosisInput = z.infer<typeof DataDiagnosisInputSchema>;

const DataDiagnosisOutputSchema = z.object({
  completeness: z.object({
    missingValues: z.boolean().describe('Whether the dataset has missing values.'),
    missingValuesDetails: z
      .string()
      .describe('Details about the missing values in the dataset.'),
    suggestedSolutions: z
      .array(z.string())
      .describe('Suggested solutions for handling missing values.'),
  }),
  quality: z.object({
    outliers: z.boolean().describe('Whether the dataset has outliers.'),
    outliersDetails: z.string().describe('Details about the outliers in the dataset.'),
    suggestedSolutions: z.array(z.string()).describe('Suggested solutions for handling outliers.'),
  }),
  bias: z.object({
    potentialBias: z
      .boolean()
      .describe('Whether the dataset has potential biases based on protected characteristics.'),
    biasDetails: z.string().describe('Details about the potential biases in the dataset.'),
    suggestedSolutions: z.array(z.string()).describe('Suggested solutions for mitigating biases.'),
  }),
  distribution: z.object({
    distributionIssues: z
      .boolean()
      .describe('Whether the dataset has distribution issues (e.g., skewed data).'),
    distributionDetails: z.string().describe('Details about the distribution issues.'),
    suggestedSolutions: z
      .array(z.string())
      .describe('Suggested solutions for addressing distribution issues.'),
  }),
});
export type DataDiagnosisOutput = z.infer<typeof DataDiagnosisOutputSchema>;

export async function dataDiagnosis(input: DataDiagnosisInput): Promise<DataDiagnosisOutput> {
  return dataDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dataDiagnosisPrompt',
  input: {schema: DataDiagnosisInputSchema},
  output: {schema: DataDiagnosisOutputSchema},
  prompt: `You are an AI data analyst tasked with diagnosing potential issues in a dataset and suggesting solutions to improve data quality.

  Dataset Description: {{{datasetDescription}}}

  Data Sample (CSV):\n{{{dataSample}}}

  Analyze the provided dataset description and data sample, and provide a diagnosis report that includes:

  - Completeness: Identify if there are any missing values, provide details, and suggest solutions.
  - Quality: Identify if there are any outliers, provide details, and suggest solutions.
  - Bias: Identify potential biases, provide details, and suggest solutions.
  - Distribution: Identify distribution issues, provide details, and suggest solutions.

  Ensure that the output is valid JSON conforming to the DataDiagnosisOutputSchema. Each 'suggestedSolutions' array should contain actionable steps.
  `,
});

const dataDiagnosisFlow = ai.defineFlow(
  {
    name: 'dataDiagnosisFlow',
    inputSchema: DataDiagnosisInputSchema,
    outputSchema: DataDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
