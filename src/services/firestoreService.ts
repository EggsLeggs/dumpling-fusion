import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { MealType, MealOptions, GeneratedCombinationData, FirestoreMealOptionsDoc, FirestoreGeneratedCombinationDoc } from '@/types/dumpling';

const OPTIONS_COLLECTION = 'options';
const GENERATED_COMBINATIONS_COLLECTION = 'generated_combinations';

export const getMealOptions = async (meal: MealType): Promise<MealOptions | null> => {
  try {
    const docRef = doc(db, OPTIONS_COLLECTION, meal);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as FirestoreMealOptionsDoc;
      return { types: data.types || [], fillings: data.fillings || [] };
    }
    console.warn(`No options found for meal: ${meal}`);
    return null;
  } catch (error) {
    console.error("Error fetching meal options:", error);
    throw new Error("Failed to fetch meal options.");
  }
};

export const getGeneratedCombination = async (id: string): Promise<GeneratedCombinationData | null> => {
  try {
    const docRef = doc(db, GENERATED_COMBINATIONS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as FirestoreGeneratedCombinationDoc;
      return { ...data, id };
    }
    return null;
  } catch (error) {
    console.error("Error fetching generated combination:", error);
    throw new Error("Failed to fetch generated combination.");
  }
};

export const saveGeneratedCombination = async (data: GeneratedCombinationData): Promise<void> => {
  try {
    const { id, ...restData } = data;
    const docRef = doc(db, GENERATED_COMBINATIONS_COLLECTION, id);
    await setDoc(docRef, restData);
  } catch (error) {
    console.error("Error saving generated combination:", error);
    throw new Error("Failed to save generated combination.");
  }
};

// Helper to generate Firestore document ID
export const generateCombinationDocId = (meal: MealType, type: string, filling: string): string => {
  const sanitize = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
  return `${meal}_${sanitize(type)}_${sanitize(filling)}`;
};

// Function to seed initial data - call this manually or via a script if needed
export const seedInitialData = async () => {
  const initialOptions: Record<MealType, FirestoreMealOptionsDoc> = {
    breakfast: {
      types: ["Pancake Puff", "Waffle Pocket", "Crepe Roll", "Omelette Parcel"],
      fillings: [
        "Scrambled Egg & Chorizo", "Blueberry & Cream Cheese", "Bacon & Cheddar",
        "Spinach & Feta", "Sausage & Maple Syrup", "Apple & Cinnamon"
      ],
    },
    lunch: {
      types: ["Samosa", "Gyoza", "Bao Bun", "Empanada"],
      fillings: [
        "Chicken Tikka", "Spicy Pork & Kimchi", "BBQ Pulled Jackfruit",
        "Beef & Onion", "Mushroom & Truffle", "Caprese (Tomato, Mozzarella, Basil)"
      ],
    },
    dinner: {
      types: ["Pierogi", "Ravioli", "Momo", "Potsticker"],
      fillings: [
        "Potato & Cheese", "Ricotta & Spinach", "Lamb & Mint",
        "Shrimp & Garlic", "Vegetable Medley", "Duck Confit & Fig"
      ],
    },
  };

  try {
    for (const mealKey in initialOptions) {
      const meal = mealKey as MealType;
      const optionsData = initialOptions[meal];
      await setDoc(doc(db, OPTIONS_COLLECTION, meal), optionsData);
      console.log(`Seeded data for ${meal}`);
    }
    console.log("Initial data seeding complete.");
  } catch (error) {
    console.error("Error seeding initial data:", error);
  }
};