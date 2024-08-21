import * as model from "@/models";
import { recipeView, searchView } from "@/views";

import type { Recipe } from "@/types/recipe.types";

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe as Recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);
  } catch (error) {}
};

const init = () => {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};
init();
