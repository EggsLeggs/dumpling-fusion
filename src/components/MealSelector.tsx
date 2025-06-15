'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MealType } from '@/types/dumpling';
import { Coffee, Sandwich, UtensilsCrossed } from 'lucide-react';
import Spinner from '@/components/shared/Spinner';

interface MealSelectorProps {
  selectedMeal: MealType;
  onSelectMeal: (meal: MealType) => void;
  isLoading: boolean;
}

const mealOptionsConfig: { meal: MealType; label: string; icon: React.ElementType }[] = [
  { meal: 'breakfast', label: 'Breakfast', icon: Coffee },
  { meal: 'lunch', label: 'Lunch', icon: Sandwich },
  { meal: 'dinner', label: 'Dinner', icon: UtensilsCrossed },
];

const MealSelector: React.FC<MealSelectorProps> = ({ selectedMeal, onSelectMeal, isLoading }) => {
  return (
    <div className="flex justify-center space-x-2 sm:space-x-4 my-6 md:my-8">
      {mealOptionsConfig.map(({ meal, label, icon: Icon }) => (
        <Button
          key={meal}
          variant={selectedMeal === meal ? 'default' : 'outline'}
          className={cn(
            "px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105",
            "focus:ring-2 focus:ring-primary focus:ring-offset-2",
            selectedMeal === meal ? "bg-primary text-primary-foreground shadow-lg" : "bg-card hover:bg-accent hover:text-accent-foreground"
          )}
          onClick={() => onSelectMeal(meal)}
          disabled={isLoading}
          aria-pressed={selectedMeal === meal}
        >
          <Icon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          {label}
        </Button>
      ))}
    </div>
  );
};

export default MealSelector;
