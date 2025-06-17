export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface MealOptions {
  types: string[];
  fillings: string[];
}

export interface GeneratedCombinationData {
  id: string; // Document ID, e.g., breakfast_samosa_bacon-&-cheddar
  name: string; // AI-generated creative name
  imageUrl: string;
  type: string; // e.g., "Samosa"
  filling: string; // e.g., "Bacon & Cheddar"
  meal: MealType;
}

export interface Recipe {
  ingredients: string[];
  instructions: string[];
}

// Firestore document structure for /options/{meal}
export interface FirestoreMealOptionsDoc {
  types: string[];
  fillings: string[];
}

// Firestore document structure for /generated_combinations/{id}
export interface FirestoreGeneratedCombinationDoc {
  name: string;
  imageUrl: string;
  type: string;
  filling: string;
  meal: MealType;
}
