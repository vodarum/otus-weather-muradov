import Component from "./Component";

const sleep = (x: number) => new Promise((resolve) => setTimeout(resolve, x));

class TestComponent extends Component {
  handleFocusInput: (e: Event) => void;

  handleClickButton: (e: Event) => void;

  constructor(...args: ConstructorParameters<typeof Component>) {
    super(...args);
    this.handleFocusInput = jest.fn();
    this.handleClickButton = jest.fn();

    this.events = {
      "focus@input": this.handleFocusInput,
      "click@button": this.handleClickButton,
    };
  }

  render() {
    return `<input type="text" name="input" value="${this.state.name}"><button name="button">Send</button>`;
  }
}

describe("Component", () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement("div");
  });

  it("updates HTML on .setState call", () => {
    let name;

    const cmp = new TestComponent(el);
    expect(el.innerHTML).toBe(
      `<input type="text" name="input" value="${name}"><button name="button">Send</button>`
    );

    name = "Sam";

    cmp.setState({ name });
    expect(el.innerHTML).toBe(
      `<input type="text" name="input" value="${name}"><button name="button">Send</button>`
    );
  });

  it("can instantiate component with initial state", () => {
    let name = "Sam";

    const cmp = new TestComponent(el, { name });
    expect(el.innerHTML).toBe(
      `<input type="text" name="input" value="${name}"><button name="button">Send</button>`
    );

    name = "Bob";

    cmp.setState({ name });
    expect(el.innerHTML).toBe(
      `<input type="text" name="input" value="${name}"><button name="button">Send</button>`
    );
  });

  it("handles events based on the mapping", async () => {
    const cmp = new TestComponent(el, { name: "Bob" });
    const input = el.querySelector("input");
    const btn = el.querySelector("button");

    await sleep(10);

    const focus = new Event("focus");
    input?.dispatchEvent(focus);
    expect(cmp.handleFocusInput).toHaveBeenCalledTimes(1);
    expect(cmp.handleClickButton).not.toHaveBeenCalled();

    btn?.click();
    expect(cmp.handleFocusInput).toHaveBeenCalledTimes(1);
    expect(cmp.handleClickButton).toHaveBeenCalledTimes(1);
  });

  it("handles events based on the mapping after rerender", async () => {
    let name = "Bob";

    const cmp = new TestComponent(el, { name });

    await sleep(10);

    expect(el.querySelector("input")?.value).toBe(name);

    el.querySelector("button")?.click();
    expect(cmp.handleClickButton).toHaveBeenCalledTimes(1);

    name = "John";

    cmp.setState({ name });

    expect(el.querySelector("input")?.value).toBe(name);

    el.querySelector("button")?.click();
    expect(cmp.handleClickButton).toHaveBeenCalledTimes(2);
  });

  it("calls .onMount on first rendering only", () => {
    const spyOnMount = jest.spyOn(TestComponent.prototype, "onMount");

    let name = "Bob";

    const cmp = new TestComponent(el, { name });

    expect(el.innerHTML).toBe(
      `<input type="text" name="input" value="${name}"><button name="button">Send</button>`
    );
    expect(spyOnMount).toHaveBeenCalledTimes(1);

    name = "Sam";

    cmp.setState({ name });
    expect(el.innerHTML).toBe(
      `<input type="text" name="input" value="${name}"><button name="button">Send</button>`
    );
    expect(spyOnMount).toHaveBeenCalledTimes(1);
  });
});
