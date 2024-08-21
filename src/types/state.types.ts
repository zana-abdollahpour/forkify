import type { Recipe, SearchRecipeResponse } from "@/types/recipe.types";

export interface State {
  recipe: Recipe | {};
  search: {
    query: string;
    results: SearchRecipeResponse[];
  };
}
