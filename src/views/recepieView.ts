import Fraction from "fraction.js";

import View from "@/views/View";
import type { Ingredient, Recipe } from "@/types/recipe.types";

class RecipeView extends View<Recipe> {
  parentEl = document.querySelector(".recipe") as HTMLDivElement;
  errorMessage = "We could not find that recipe. please try another one!";
  successMessage = "TODO: add success message";

  addHandlerRender(handler: () => void) {
    ["hashchange", "load"].forEach((ev) =>
      window.addEventListener(ev, handler)
    );
  }

  addHandlerUpdateServings(handler: (newServings: number) => void) {
    this.parentEl.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest<HTMLButtonElement>(".btn--update-servings");
      if (!btn) return;

      const updateTo = +btn.dataset.updateTo!;
      if (updateTo > 0) handler(updateTo);
    });
  }

  addHandlerAddBookmark(handler: () => void) {
    this.parentEl.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest<HTMLButtonElement>(".btn--bookmark");
      if (!btn) return;

      handler();
    });
  }

  generateMarkup() {
    return `
      <figure class="recipe__fig">
          <img 
            src="${this.data.image}"
            alt="${this.data.title}"
            class="recipe__img"
          />
          <h1 class="recipe__title">
            <span>${this.data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="icons.svg#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this.data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="icons.svg#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this.data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this.data.servings! - 1
              }">
                <svg>
                  <use href="icons.svg#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this.data.servings! + 1
              }">
                <svg>
                  <use href="icons.svg#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this.data.key ? "" : "hidden"}">
            <svg>
              <use href="icons.svg#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="icons.svg#icon-bookmark${
                this.data.isBookmarked ? "-fill" : ""
              }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${this.data.ingredients!.map(this.generateIngredient).join("")}
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this.data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this.data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="icons.svg#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    `;
  }

  private generateIngredient(ing: Ingredient) {
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ing.quantity ? new Fraction(ing.quantity).toFraction(true) : ""
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>
      </li>
    `;
  }
}

export const recipeView = new RecipeView();
