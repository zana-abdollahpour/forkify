import View from "@/views/View";
import type { SearchRecipeResponse } from "@/types/recipe.types";

class BookmarksView extends View<SearchRecipeResponse[]> {
  parentEl = document.querySelector(".bookmarks__list") as HTMLUListElement;
  errorMessage = "No bookmarks yet.";
  successMessage = "TODO: add success message";

  generateMarkup(): string {
    const id = window.location.hash.slice(1);

    return this.data
      .map(
        (rec) => `
          <li class="preview">
            <a class="preview__link ${
              rec?.id === id ? "preview__link--active" : ""
            }" href="#${rec?.id}">
              <figure class="preview__fig">
                <img src="${rec?.image}" alt="${rec?.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${rec?.title}</h4>
                <p class="preview__publisher">${rec?.publisher}</p>
                  <!--  <div class="preview__user-generated">
                      <svg>
                        <use href="icons.svg#icon-user"></use>
                      </svg>
                    </div> -->
              </div>
            </a>
          </li>
        `
      )
      .join("");
  }
}

export const bookmarksView = new BookmarksView();
