import { API_URL, API_KEY, RESULTS_PER_PAGE, BOOKMARKS_KEY } from "@/config";
import { getJSON, sendJSON } from "@/lib";
import type {
  Recipe,
  RawRecipe,
  RecipeResponse,
  RecipeSuccessResponse,
  RawSearchRecipeResponse,
} from "@/types/recipe.types";
import type { State } from "@/types/state.types";

export const state: State = {
  recipe: {} as Recipe,
  search: {
    query: "",
    results: [],
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = (data: RecipeSuccessResponse): Recipe => {
  const rawRecipe = data.data.recipe;
  const recipe = {
    id: rawRecipe.id,
    title: rawRecipe.title,
    publisher: rawRecipe.publisher,
    sourceUrl: rawRecipe.source_url,
    image: rawRecipe.image_url,
    servings: rawRecipe.servings,
    cookingTime: rawRecipe.cooking_time,
    ingredients: rawRecipe.ingredients,
    ...(rawRecipe.key && { key: rawRecipe.key }),
  };
  return recipe;
};

export const loadRecipe = async (id: Recipe["id"]) => {
  try {
    const data = await getJSON<RecipeResponse>(
      `${API_URL}/${id}?key=${API_KEY}`
    );
    if (data.status === "fail") throw new Error(data.message);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.isBookmarked = true;
    else state.recipe.isBookmarked = false;
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async (query: string) => {
  try {
    state.search.query = query;

    const data = await getJSON<RawSearchRecipeResponse>(
      `${API_URL}?search=${query}&key=${API_KEY}`
    );

    state.search.results = data.data.recipes.map((rec) => ({
      id: rec.id,
      title: rec.title,
      publisher: rec.publisher,
      image: rec.image_url,
      ...(rec.key && { key: rec.key }),
    }));

    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = (page: number = state.search.page) => {
  state.search.page = page;

  const start = (page - 1) * RESULTS_PER_PAGE;
  const end = page * RESULTS_PER_PAGE;

  return state.search.results.slice(start, end);
};

export const updateServings = (newServings: number) => {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = () => {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(state.bookmarks));
};

const loadPersistedBookmarks = () => {
  const bookmarks = localStorage.getItem(BOOKMARKS_KEY);
  if (bookmarks) state.bookmarks = JSON.parse(bookmarks);
};

export const addBookmark = (recipe: Recipe) => {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.isBookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = (id: Recipe["id"]) => {
  const idx = state.bookmarks.findIndex((bookmark) => bookmark.id === id);
  state.bookmarks.splice(idx, 1);

  if (id === state.recipe.id) state.recipe.isBookmarked = false;

  persistBookmarks();
};

export const uploadRecipe = async (newRecipe: FormData) => {
  try {
    const title = String(newRecipe.get("title")!);
    const source_url = String(newRecipe.get("sourceUrl")!);
    const image_url = String(newRecipe.get("image")!);
    const publisher = String(newRecipe.get("publisher")!);
    const cooking_time = Number(newRecipe.get("cookingTime")!);
    const servings = Number(newRecipe.get("servings")!);

    const recipeData = Object.fromEntries(newRecipe);
    const ingredients = Object.entries(recipeData)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArray = String(ing[1])
          .split(",")
          .map((ing) => ing.trim());
        if (ingArray.length !== 3) throw new Error("Wrong ingredient format");

        const [quantity, unit, description] = ingArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe: Omit<RawRecipe, "id" | "ingredients"> & {
      ingredients: {
        quantity: number | null;
        unit: string;
        description: string;
      }[];
    } = {
      title,
      source_url,
      image_url,
      publisher,
      cooking_time,
      servings,
      ingredients,
    };

    const data = await sendJSON<RecipeSuccessResponse>(
      `${API_URL}?key=${API_KEY}`,
      recipe
    );
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = () => {
  loadPersistedBookmarks();
};
init();
