import View from "@/views/View";
import type { State } from "@/types/state.types";

class AddRecipeView extends View<State["search"]> {
  parentEl = document.querySelector<HTMLFormElement>(".upload")!;
  errorMessage = "something went wrong with this recipe. Try again!";
  successMessage = "Recipe was successfully uploaded :)";

  #windowEl = document.querySelector<HTMLDivElement>(".add-recipe-window")!;
  #overlayEl = document.querySelector<HTMLDivElement>(".overlay")!;
  #btnClose = document.querySelector<HTMLButtonElement>(".btn--close-modal")!;
  #btnOpen = document.querySelector<HTMLButtonElement>(
    ".nav__btn--add-recipe"
  )!;

  constructor() {
    super();
    this.#addHandlerShowWindow();
    this.#addHandlerHideWindow();
  }

  toggleWindow() {
    this.#overlayEl.classList.toggle("hidden");
    this.#windowEl.classList.toggle("hidden");
  }

  #addHandlerShowWindow() {
    this.#btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  #addHandlerHideWindow() {
    this.#btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this.#overlayEl.addEventListener("click", this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler: (newRecipeData: FormData) => void) {
    this.parentEl.addEventListener("submit", (e) => {
      e.preventDefault();
      handler(new FormData(e.currentTarget as HTMLFormElement));
    });
  }

  generateMarkup(): string {
    return "TODO: add markup";
  }
}

export const addRecipeView = new AddRecipeView();
