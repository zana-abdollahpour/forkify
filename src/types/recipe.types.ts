/* Response */
export type RecipeResponse = FailResponse | SuccessResponse;

export interface FailResponse {
  status: "fail";
  message: string;
}

export interface SuccessResponse {
  status: "success";
  data: RecipeData;
}

/* Recipe */
export interface RecipeData {
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
  quantity: null | number;
  unit: string;
  description: string;
}
