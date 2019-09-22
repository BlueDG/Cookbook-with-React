import React, { useState, useEffect } from "react";
import RecipeList from "./RecipeList";
import RecipeEdit from "./RecipeEdit";
import "../css/app.css";
import uuidv4 from "uuid/v4";

export const RecipeContext = React.createContext();
const LOCAL_STORAGE_KEY = "cookingWithReact.recipes";

export default function App() {
  const [recipes, setRecipes] = useState(sampleRecipes);
  const [selectedRecipeId, setSelectedRecipeId] = useState();
  const selectedRecipe = recipes.find(recipe => recipe.id === selectedRecipeId);

  useEffect(() => {
    const recipeJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (recipeJSON != null) setRecipes(JSON.parse(recipeJSON));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recipes));
  }, [recipes]);

  const recipeContextValue = {
    handleRecipeAdd: handleRecipeAdd,
    handleRecipeDelete: handleRecipeDelete,
    handleRecipeSelect: handleRecipeSelect,
    handleRecipeChange: handleRecipeChange
  };

  function handleRecipeSelect(id) {
    setSelectedRecipeId(id);
  }

  function handleRecipeAdd() {
    const newRecipe = {
      id: uuidv4(),
      name: "",
      servings: 1,
      cookTime: "",
      instructions: "",
      ingredients: [{ id: uuidv4(), name: "", amount: "" }]
    };
    setSelectedRecipeId(newRecipe.id);
    setRecipes([...recipes, newRecipe]);
  }

  function handleRecipeDelete(id) {
    if (selectedRecipeId != null && selectedRecipeId === id) {
      setSelectedRecipeId(undefined);
    }
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  }

  function handleRecipeChange(id, recipe) {
    const newRecipe = [...recipes];
    const index = newRecipe.findIndex(r => r.id === id);
    newRecipe[index] = recipe;
    setRecipes(newRecipe);
  }

  return (
    <RecipeContext.Provider value={recipeContextValue}>
      <RecipeList recipes={recipes} />
      {selectedRecipe && <RecipeEdit recipe={selectedRecipe} />}
    </RecipeContext.Provider>
  );
}

const sampleRecipes = [
  {
    id: 1,
    name: "2 AM Chili",
    servings: 3,
    cookTime: "1:45",
    instructions: "1. Buy some meat\n2. Change your mind\n3. Order some sushis",
    ingredients: [
      {
        id: 1,
        name: "Sushis",
        amount: "As much as you need"
      },
      {
        id: 2,
        name: "Chili meat",
        amount: "About 7 oz"
      }
    ]
  },
  {
    id: 2,
    name: "Crêpe au sucre",
    servings: 1,
    cookTime: "2 minutes",
    instructions:
      "Vous avez de la pâte, vous avez du suc, alors avec la pâte vous faites une crêpe puis vous mettez du sucre dessus.",
    ingredients: [
      {
        id: 1,
        name: "Sucre",
        amount: "Petite dose"
      },
      {
        id: 2,
        name: "Pâte",
        amount: "Une bonne louchée"
      }
    ]
  }
];
