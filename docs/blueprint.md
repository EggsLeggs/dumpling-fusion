# **App Name**: Dumpling Dynamo

## Core Features:

- Meal Selection: Meal selection with buttons for Breakfast, Lunch, and Dinner, visually highlighted based on the selected meal. Defaults to 'Breakfast'.
- Combination Generator Button: Large, central 'Find My Fusion!' button to trigger dumpling combination generation.
- Results Display: Display a result card with the generated dumpling combination's image, name, and a 'Generate Recipe' button. Appears with a smooth animation.
- AI Name Generator: Generates a fun, catchy name for the dumpling combination. This feature combines the type and filling into a creative name.
- Recipe Generation: Generate a recipe using an AI tool when the 'Generate Recipe' button is clicked.  Displays in a modal with ingredients and instructions.
- Loading Indicators: Show loading spinners when data is being fetched from Firestore or a recipe is being generated.
- Firestore Integration: Fetch dumpling types and fillings from Firebase Firestore based on the selected meal (Breakfast, Lunch, Dinner). Persist combinations in Firestore.

## Style Guidelines:

- Primary color: Warm Apricot (#FFB347) for a comforting and appetizing feel.
- Background color: Pale Peach (#FFE9CA) for a soft and inviting backdrop.
- Accent color: Muted Mustard (#D4A373) to provide visual interest and contrast for calls to action.
- Headline font: 'Playfair' (serif) for elegant and readable headings; Body font: 'PT Sans' (sans-serif) for clean and accessible text.
- Use food-related icons for meal types and loading states.
- Ensure a responsive layout using Tailwind CSS for seamless viewing on mobile and desktop devices.
- Incorporate subtle animations for button hover states and when displaying generated combinations and recipes.