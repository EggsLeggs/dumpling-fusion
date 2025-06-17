// src/ai/flows/generate-dumpling-recipe.ts
'use server';
/**
 * @fileOverview AI agent that generates a recipe for a given dumpling fusion.
 *
 * - generateDumplingRecipe - A function that generates a recipe for a given dumpling fusion.
 * - GenerateDumplingRecipeInput - The input type for the generateDumplingRecipe function.
 * - GenerateDumplingRecipeOutput - The return type for the generateDumplingRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDumplingRecipeInputSchema = z.object({
  name: z.string().describe('The name of the dumpling fusion.'),
  type: z.string().describe('The type of dumpling.'),
  filling: z.string().describe('The filling of the dumpling.'),
});
export type GenerateDumplingRecipeInput = z.infer<typeof GenerateDumplingRecipeInputSchema>;

const GenerateDumplingRecipeOutputSchema = z.object({
  recipe: z.string().describe('The generated recipe for the dumpling fusion, including ingredients and instructions.'),
});
export type GenerateDumplingRecipeOutput = z.infer<typeof GenerateDumplingRecipeOutputSchema>;

export async function generateDumplingRecipe(input: GenerateDumplingRecipeInput): Promise<GenerateDumplingRecipeOutput> {
  return generateDumplingRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDumplingRecipePrompt',
  input: {schema: GenerateDumplingRecipeInputSchema},
  output: {schema: GenerateDumplingRecipeOutputSchema},
  prompt: `You are a world-class chef specializing in fusion cuisine. Generate a recipe for the following dumpling fusion:

Dumpling Type: {{{type}}}
Filling: {{{filling}}}
Fusion Name: {{{name}}}

Include a list of ingredients and step-by-step instructions. Be creative and make the recipe sound delicious!`,
});

const generateDumplingRecipeFlow = ai.defineFlow(
  {
    name: 'generateDumplingRecipeFlow',
    inputSchema: GenerateDumplingRecipeInputSchema,
    outputSchema: GenerateDumplingRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
