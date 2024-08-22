import View from "@/views/View";
import { RESULTS_PER_PAGE } from "@/config";
import type { State } from "@/types/state.types";

class PaginationView extends View<State["search"]> {
  parentEl = document.querySelector(".pagination") as HTMLDivElement;
  errorMessage = "something went wrong with this recipe. Try again!";
  successMessage = "TODO: add success message";

  addHandlerClick(handler: (page: number) => void) {
    this.parentEl.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest(".btn--inline") as HTMLButtonElement;
      if (!btn) return;

      const goToPage = Number(btn.dataset.goto!);
      handler(goToPage);
    });
  }

  generateMarkup(): string {
    const navBtn = (numPage: number, type: "next" | "prev") => `
      <button class="btn--inline pagination__btn--${type}" data-goto=${numPage}>
        ${type === "next" ? `<span>Page ${numPage}</span>` : ""}
        <svg class="search__icon">
          <use href="icons.svg#icon-arrow-${
            type === "next" ? "right" : "left"
          }"></use>
        </svg>
        ${type === "prev" ? `<span>Page ${numPage}</span>` : ""}
      </button>
    `;

    const curPage = this.data.page!;
    const numPages = Math.ceil(this.data.results?.length! / RESULTS_PER_PAGE);

    if (curPage === 1 && numPages > 1) return navBtn(curPage + 1, "next");

    if (curPage === numPages && numPages > 1)
      return navBtn(curPage - 1, "prev");

    if (curPage < numPages)
      return `${navBtn(curPage - 1, "prev")}${navBtn(curPage + 1, "next")}`;

    return "";
  }
}

export const paginationView = new PaginationView();
