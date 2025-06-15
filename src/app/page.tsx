'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import MealSelector from '@/components/MealSelector';
import ResultCard from '@/components/ResultCard';
import RecipeModal from '@/components/RecipeModal';
import Spinner from '@/components/shared/Spinner';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { generateDumplingName } from '@/ai/flows/generate-dumpling-name';
import { generateDumplingRecipe } from '@/ai/flows/generate-dumpling-recipe';
import { getMealOptions, getGeneratedCombination, saveGeneratedCombination, generateCombinationDocId } from '@/services/firestoreService';
import type { MealType, MealOptions, GeneratedCombinationData } from '@/types/dumpling';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast');
  const [mealOptions, setMealOptions] = useState<MealOptions | null>(null);
  const [isLoadingMealOptions, setIsLoadingMealOptions] = useState<boolean>(true);
  
  const [generatedCombination, setGeneratedCombination] = useState<GeneratedCombinationData | null>(null);
  const [isLoadingCombination, setIsLoadingCombination] = useState<boolean>(false);
  
  const [recipe, setRecipe] = useState<string | null>(null);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState<boolean>(false);
  const [showRecipeModal, setShowRecipeModal] = useState<boolean>(false);

  const { toast } = useToast();

  const fetchMealOptionsData = useCallback(async (meal: MealType) => {
    setIsLoadingMealOptions(true);
    setGeneratedCombination(null); // Clear previous results when meal changes
    try {
      const options = await getMealOptions(meal);
      setMealOptions(options);
      if (!options || options.types.length === 0 || options.fillings.length === 0) {
        toast({ title: "Uh oh!", description: `No dumpling options found for ${meal}.`, variant: "destructive" });
      }
    } catch (error) {
      console.error("Error fetching meal options:", error);
      toast({ title: "Error", description: "Could not fetch meal options. Please try again later.", variant: "destructive" });
    } finally {
      setIsLoadingMealOptions(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMealOptionsData(selectedMeal);
  }, [selectedMeal, fetchMealOptionsData]);

  const handleMealSelect = (meal: MealType) => {
    setSelectedMeal(meal);
  };

  const handleFindFusion = async () => {
    if (!mealOptions || mealOptions.types.length === 0 || mealOptions.fillings.length === 0) {
      toast({ title: "Missing Options", description: "Cannot generate fusion, meal options are not loaded or empty.", variant: "destructive" });
      return;
    }
    setIsLoadingCombination(true);
    setGeneratedCombination(null);

    try {
      const randomType = mealOptions.types[Math.floor(Math.random() * mealOptions.types.length)];
      const randomFilling = mealOptions.fillings[Math.floor(Math.random() * mealOptions.fillings.length)];
      const docId = generateCombinationDocId(selectedMeal, randomType, randomFilling);

      let comboData = await getGeneratedCombination(docId);

      if (!comboData) {
        const aiNameResult = await generateDumplingName({ dumplingType: randomType, filling: randomFilling });
        const name = aiNameResult.name;
        const imageUrl = `https://placehold.co/600x400/FFB347/4A2E2A?text=${encodeURIComponent(name)}`;
        
        comboData = { id: docId, name, imageUrl, type: randomType, filling: randomFilling, meal: selectedMeal };
        await saveGeneratedCombination(comboData);
      }
      
      setGeneratedCombination(comboData);

    } catch (error) {
      console.error("Error generating fusion:", error);
      toast({ title: "Fusion Failed", description: "Could not generate a dumpling fusion. Please try again.", variant: "destructive" });
    } finally {
      setIsLoadingCombination(false);
    }
  };

  const handleGenerateRecipe = async () => {
    if (!generatedCombination) return;
    setIsGeneratingRecipe(true);
    setRecipe(null);
    try {
      const aiRecipeResult = await generateDumplingRecipe({ 
        name: generatedCombination.name, 
        type: generatedCombination.type, 
        filling: generatedCombination.filling 
      });
      setRecipe(aiRecipeResult.recipe);
      setShowRecipeModal(true);
    } catch (error) {
      console.error("Error generating recipe:", error);
      toast({ title: "Recipe Error", description: "Could not generate the recipe. Please try again.", variant: "destructive" });
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  const handleCloseRecipeModal = () => {
    setShowRecipeModal(false);
    // setRecipe(null); // Keep recipe data if user reopens modal for same combo
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-background text-foreground p-4 sm:p-6 md:p-8">
      <Header />
      <main className="w-full max-w-3xl flex flex-col items-center">
        <MealSelector selectedMeal={selectedMeal} onSelectMeal={handleMealSelect} isLoading={isLoadingMealOptions} />

        {isLoadingMealOptions ? (
          <div className="my-12">
            <Spinner size={48} />
            <p className="mt-4 text-muted-foreground">Loading options...</p>
          </div>
        ) : (
          <Button
            onClick={handleFindFusion}
            disabled={isLoadingCombination || isLoadingMealOptions || !mealOptions}
            className="my-8 px-8 py-6 text-lg md:text-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg
                       transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95
                       focus:ring-4 focus:ring-primary/50"
            aria-label="Find my fusion button"
          >
            {isLoadingCombination ? (
              <Spinner size={24} className="mr-3 text-primary-foreground" />
            ) : (
              <Sparkles className="mr-3 h-6 w-6" />
            )}
            {isLoadingCombination ? 'Fusing Flavors...' : 'Find My Fusion!'}
          </Button>
        )}

        {generatedCombination && !isLoadingCombination && (
          <div className="w-full mt-8">
            <ResultCard
              combination={generatedCombination}
              onGenerateRecipe={handleGenerateRecipe}
              isGeneratingRecipe={isGeneratingRecipe}
            />
          </div>
        )}
        
        {showRecipeModal && generatedCombination && (
          <RecipeModal
            isOpen={showRecipeModal}
            onClose={handleCloseRecipeModal}
            recipe={recipe}
            combinationName={generatedCombination.name}
          />
        )}
      </main>
       <footer className="text-center py-8 mt-auto">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Dumpling Dynamo. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
