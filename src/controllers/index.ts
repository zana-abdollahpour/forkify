import * as model from "@/models";
import { recipeView } from "@/views";

import type { Recipe } from "@/types/recipe.types";

const showRecipe = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe as Recipe);
  } catch (error) {
    alert(error);
  }
};

["hashchange", "load"].forEach((ev) => window.addEventListener(ev, showRecipe));
