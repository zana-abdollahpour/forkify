export default abstract class View<T> {
  protected abstract parentEl: HTMLElement;
  protected abstract errorMessage: string;
  protected abstract successMessage: string;
  protected abstract generateMarkup(): string;

  protected data: Partial<T> = {};

  render(data: T) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this.data = data;
    const markup = this.generateMarkup();
    this.parentEl.innerHTML = markup;
  }

  update(data: T) {
    this.data = data;
    const newMarkup = this.generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this.parentEl.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // update changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue?.trim() !== ""
      )
        curEl.textContent = newEl.textContent;

      // update changed attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="icons.svg#icon-loader"></use>
        </svg>
      </div>
    `;
    this.parentEl.innerHTML = markup;
  }

  renderError(msg: string = this.errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="icons.svg#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${msg}</p>
      </div>
    `;
    this.parentEl.innerHTML = markup;
  }

  renderMessage(msg: string = this.successMessage) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="icons.svg#icon-smile"></use>
          </svg>
        </div>
        <p>${msg}</p>
      </div>
    `;
    this.parentEl.innerHTML = markup;
  }
}
