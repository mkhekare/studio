'use server';

/**
 * @fileOverview Generates a set of visualizations tailored to the dataset, along with AI-generated descriptions explaining the key insights revealed by each visualization.
 *
 * - generateVisualizations - A function that handles the visualization generation process.
 * - GenerateVisualizationsInput - The input type for the generateVisualizations function.
 * - GenerateVisualizationsOutput - The return type for the generateVisualizations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVisualizationsInputSchema = z.object({
  datasetDescription: z
    .string()
    .describe('A detailed description of the dataset, including its columns and purpose.'),
  datasetSample: z
    .string()
    .describe('A sample of the dataset in CSV format.'),
});
export type GenerateVisualizationsInput = z.infer<typeof GenerateVisualizationsInputSchema>;

const ChartDataSchema = z.array(z.record(z.union([z.string(), z.number()])));

const VisualizationSchema = z.object({
    chartType: z.enum(['bar', 'line', 'scatter', 'pie', 'area']).describe("The type of chart to render. Choose the most appropriate type for the data."),
    title: z.string().describe('A descriptive title for the chart.'),
    description: z.string().describe('A textual description of the visualization and its key insights.'),
    data: ChartDataSchema.describe("The data for the chart, as an array of objects. This data should be derived or aggregated from the source dataset to be suitable for the chart type."),
    dataKeys: z.array(z.string()).describe('The keys within the data objects to be plotted (e.g., for the y-axis).'),
    indexKey: z.string().describe('The key within the data objects to be used as the independent axis (e.g., for x-axis labels).'),
});


const GenerateVisualizationsOutputSchema = z.array(VisualizationSchema);
export type GenerateVisualizationsOutput = z.infer<typeof GenerateVisualizationsOutputSchema>;

export async function generateVisualizations(input: GenerateVisualizationsInput): Promise<GenerateVisualizationsOutput> {
  return generateVisualizationsFlow(input);
}

const visualizationPrompt = ai.definePrompt({
  name: 'visualizationPrompt',
  input: {schema: GenerateVisualizationsInputSchema},
  output: {schema: GenerateVisualizationsOutputSchema},
  prompt: `You are an expert data analyst. Your task is to analyze the provided dataset and generate a list of suitable visualizations.

Dataset Description: {{{datasetDescription}}}

Dataset Sample (CSV):
{{{datasetSample}}}

Based on the data, generate a JSON array of 2 to 4 visualization objects. Each object must conform to the output schema.
For each visualization:
- Choose the most appropriate 'chartType' from 'bar', 'line', 'scatter', 'pie', or 'area'.
- Write a clear 'title' and an insightful 'description' explaining what the chart shows.
- Process and aggregate the raw CSV 'datasetSample' to create the 'data' array for plotting. For example, for a bar chart, group by a categorical column and count occurrences. For a pie chart, calculate proportions of a category. For a line chart, show a trend over a numeric or date-like variable.
- IMPORTANT: The 'data' array must contain objects with numeric values for plotting. Ensure that values for axes and data points are numbers, not strings.
- Specify the 'dataKeys' (dependent variables/Y-axis) and the 'indexKey' (independent variable/X-axis).

Your goal is to produce insightful, ready-to-plot charts with meaningful aggregations, not just the raw data. The final output MUST be a valid JSON array of visualization objects, conforming strictly to the schema.`,
});

const generateVisualizationsFlow = ai.defineFlow(
  {
    name: 'generateVisualizationsFlow',
    inputSchema: GenerateVisualizationsInputSchema,
    outputSchema: GenerateVisualizationsOutputSchema,
  },
  async input => {
    const {output} = await visualizationPrompt(input);
    return output || [];
  }
);
