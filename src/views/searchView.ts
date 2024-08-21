class SearchView {
  #parentEl = document.querySelector(".search") as HTMLFormElement;
  #searchInputEl = this.#parentEl.querySelector(
    ".search__field"
  ) as HTMLInputElement;

  getQuery() {
    const query = this.#searchInputEl.value;
    this.#clearInput();
    return query;
  }

  #clearInput() {
    this.#searchInputEl.value = "";
  }

  addHandlerSearch(handler: () => void) {
    this.#parentEl.addEventListener("submit", (e) => {
      e.preventDefault();
      handler();
    });
  }
}

export const searchView = new SearchView();
