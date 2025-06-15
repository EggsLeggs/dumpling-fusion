'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: string | null; // The recipe is a single string with ingredients and instructions
  combinationName: string;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ isOpen, onClose, recipe, combinationName }) => {
  if (!recipe) return null;

  // Simple parsing if recipe is structured. Assuming it might have "Ingredients:" and "Instructions:"
  // For better display, split into sections if possible.
  // This is a basic example; more robust parsing might be needed depending on AI output format.
  const sections = recipe.split(/(?=Ingredients:|Instructions:)/gi);
  
  const formatSection = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.trim().startsWith('-') || /^\d+\./.test(line.trim())) {
        return <li key={index} className="ml-4 list-disc list-inside text-sm leading-relaxed">{line.replace(/^-|\d+\./, '').trim()}</li>;
      }
      if(line.trim() === 'Ingredients:' || line.trim() === 'Instructions:') {
        return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-primary">{line.trim()}</h3>;
      }
      return <p key={index} className="text-sm leading-relaxed my-1">{line}</p>;
    });
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg md:max-w-xl max-h-[80vh] flex flex-col bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-primary">Recipe for {combinationName}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Here&apos;s how to make your delicious dumpling fusion!
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow my-4 pr-4">
          <div className="prose prose-sm max-w-none text-foreground">
             {sections.map((section, idx) => (
              <div key={idx}>{formatSection(section)}</div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeModal;
