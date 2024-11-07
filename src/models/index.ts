import { API_URL, RESULTS_PER_PAGE, BOOKMARKS_KEY } from "@/config";
import { getJSON } from "@/lib";
import type {
  Recipe,
  RecipeResponse,
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

export const loadRecipe = async (id: Recipe["id"]) => {
  try {
    const data = await getJSON<RecipeResponse>(`${API_URL}/${id}`);
    if (data.status === "fail") throw new Error(data.message);

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
      `${API_URL}?search=${query}`
    );

    state.search.results = data.data.recipes.map((rec) => ({
      id: rec.id,
      title: rec.title,
      publisher: rec.publisher,
      image: rec.image_url,
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

const init = () => {
  loadPersistedBookmarks();
};
init();
