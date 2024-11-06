/* Response */
export type RecipeResponse = RecipeFailResponse | RecipeSuccessResponse;

export interface RecipeFailResponse {
  status: "fail";
  message: string;
}

export interface RecipeSuccessResponse {
  status: "success";
  data: RecipeData;
}

export interface RawSearchRecipeResponse {
  status: "success";
  results: number;
  data: {
    recipes: Pick<RawRecipe, "id" | "image_url" | "publisher" | "title">[];
  };
}

export interface SearchRecipeResponse {
  id: string;
  title: string;
  publisher: string;
  image: string;
}

export /* Recipe */
interface RecipeData {
  recipe: RawRecipe;
}

export interface RawRecipe {
  id: string;
  title: string;
  publisher: string;
  source_url: string;
  image_url: string;
  servings: number;
  cooking_time: number;
  ingredients: Ingredient[];
}

export interface Recipe {
  id: string;
  title: string;
  publisher: string;
  sourceUrl: string;
  image: string;
  servings: number;
  cookingTime: number;
  ingredients: Ingredient[];
}

export interface Ingredient {
  quantity: number;
  unit: string;
  description: string;
}
