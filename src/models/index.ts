import type { Recipe, RecipeResponse } from "@/types/recipe.types";
import type { State } from "@/types/state.types";

export const state: State = {
  recipe: {},
};

export const loadRecipe = async (id: Recipe["id"]) => {
  try {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    const data: RecipeResponse = await res.json();

    if (data.status === "fail")
      throw new Error(`${data.message} (${res.status})`);

    const rawRecipe = data.data.recipe;
    const recipe: Recipe = {
      id: rawRecipe.id,
      title: rawRecipe.title,
      publisher: rawRecipe.publisher,
      sourceUrl: rawRecipe.source_url,
      image: rawRecipe.image_url,
      servings: rawRecipe.servings,
      cookingTime: rawRecipe.cooking_time,
      ingredients: rawRecipe.ingredients,
    };

    state.recipe = recipe;
  } catch (error) {
    alert;
  }
};
