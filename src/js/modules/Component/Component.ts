export default class Component {
  private el: HTMLElement;

  state: {
    [key: string]: any;
  } = {};

  events: {
    [key: string]: (ev: Event) => void;
  } = {};

  constructor(el: HTMLElement, initialState = {}) {
    this.state = { ...this.state, ...initialState };

    el.innerHTML = this.render();
    this.el = el;

    this.onMount();

    Promise.resolve().then(() => this.subscribeToEvents());
  }

  onMount(): void {
    /**/
  }

  render(): string {
    return ``;
  }

  setState(patch: { [key: string]: any }): void {
    this.state = { ...this.state, ...patch };
    this.el.innerHTML = this.render();
    this.subscribeToEvents();
  }

  subscribeToEvents(): void {
    Object.entries(this.events).forEach(([key, handler]) => {
      const [eventName, selector] = key.split("@");

      this.el.querySelectorAll(selector).forEach((element) => {
        element.addEventListener(eventName, handler);
      });
    });
  }
}
