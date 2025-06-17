'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { GeneratedCombinationData } from '@/types/dumpling';
import Spinner from '@/components/shared/Spinner';
import { ChefHat } from 'lucide-react';

interface ResultCardProps {
  combination: GeneratedCombinationData;
  onGenerateRecipe: () => void;
  isGeneratingRecipe: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ combination, onGenerateRecipe, isGeneratingRecipe }) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-xl overflow-hidden animate-fade-in-up bg-card">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-[3/2]">
          <Image
            src={combination.imageUrl}
            alt={combination.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={`${combination.type} ${combination.filling}`}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="text-2xl md:text-3xl font-headline text-primary text-center mb-4">
          {combination.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground text-center italic">
          A delightful fusion of {combination.type.toLowerCase()} and {combination.filling.toLowerCase()}.
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          onClick={onGenerateRecipe}
          disabled={isGeneratingRecipe}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-base py-3 transition-transform duration-200 hover:scale-105"
          aria-label={`Generate recipe for ${combination.name}`}
        >
          {isGeneratingRecipe ? (
            <Spinner size={20} className="mr-2 text-accent-foreground" />
          ) : (
            <ChefHat className="mr-2 h-5 w-5" />
          )}
          {isGeneratingRecipe ? 'Whipping up magic...' : 'Generate Recipe'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResultCard;
