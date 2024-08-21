export default abstract class View<T> {
  protected abstract parentEl: HTMLElement;
  protected abstract errorMessage: string;
  protected abstract successMessage: string;
  protected abstract generateMarkup(): string;

  protected data: Partial<T> = {};

  render(data: T) {
    this.data = data;
    const markup = this.generateMarkup();
    this.parentEl.innerHTML = markup;
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
