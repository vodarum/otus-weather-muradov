import * as testData from "../../__test__/test-data.json";
import Markup from "./markup";

describe("Markup", () => {
  // 1) Функция addStaticMapOnScreen
  describe("addStaticMapOnScreen", () => {
    // 1.1) Проверяем, является ли Markup.addStaticMapOnScreen экземпляром класса Function
    test("is a function", () => {
      expect(Markup.addStaticMapOnScreen).toBeInstanceOf(Function);
    });

    // 1.2) Проверяем наличие карты на странице после выполнения функции
    test("adds map", () => {
      Markup.createInitialMarkup();
      Markup.addStaticMapOnScreen(testData.weatherInfoArray[0].coord);

      const weatherInfoMap = document.getElementById("weather-map");
      expect(weatherInfoMap).toBeTruthy();
      expect(weatherInfoMap.childElementCount).toBe(1);

      const mapImg = weatherInfoMap.children[0];
      expect(mapImg.tagName.toLowerCase()).toBe("img");
      expect(mapImg.getAttribute("src")).toBeTruthy();

      Markup.removeMarkup();
    });
  });

  // 2) Функция addWeatherHistoryOnScreen
  describe("addWeatherHistoryOnScreen", () => {
    // 2.1) Проверяем, является ли Markup.addWeatherHistoryOnScreen экземпляром класса Function
    test("is a function", () => {
      expect(Markup.addWeatherHistoryOnScreen).toBeInstanceOf(Function);
    });

    describe("adds weather info", () => {
      let weatherHistory;

      beforeEach(() => {
        Markup.createInitialMarkup();
        weatherHistory = document.getElementById("weather-history");
      });

      afterEach(() => {
        Markup.removeMarkup();
        localStorage.clear();
      });

      // 2.2) Проверяем корректность наполнения раздела "История", если данные для него существуют
      test("if weather history exists", () => {
        localStorage.setItem(
          "weatherHistory",
          JSON.stringify(testData.weatherInfoArray)
        );

        Markup.addWeatherHistoryOnScreen();

        expect(weatherHistory).toBeTruthy();
        expect(weatherHistory.childElementCount).toBe(
          testData.weatherInfoArray.length
        );

        [...weatherHistory.children].forEach((weatherHistoryItem, index) => {
          expect(weatherHistoryItem.tagName.toLowerCase()).toBe("span");
          expect(weatherHistoryItem.classList).toContain(
            "weather-history__item"
          );
          expect(weatherHistoryItem.dataset.whItemId).toBe(`${index}`);
        });
      });

      // 2.3) Проверяем корректность работы функции, если данные для раздела "История" отсутствуют
      test("if weather history doesn't exists", () => {
        Markup.addWeatherHistoryOnScreen();

        expect(weatherHistory).toBeTruthy();
        expect(weatherHistory.childElementCount).toBe(0);
      });
    });
  });

  // 3) Функция addWeatherMainOnScreen
  describe("addWeatherMainOnScreen", () => {
    // 3.1) Проверяем, является ли Markup.addWeatherMainOnScreen экземпляром класса Function
    test("is a function", () => {
      expect(Markup.addWeatherMainOnScreen).toBeInstanceOf(Function);
    });

    // 3.2) Проверяем коррекность добавления на страницу информации о погоде в выбранном населенном пункте
    test("adds weather info", () => {
      Markup.createInitialMarkup();
      Markup.addWeatherMainOnScreen(testData.weatherInfoArray[0]);

      const weatherMain = document.getElementById("weather-main");
      const weatherMainContainedElements = [
        { tagName: "img", class: "weather-main__img" },
        { tagName: "div", class: "weather-main__text" },
      ];

      expect(weatherMain).toBeTruthy();
      expect(weatherMain.childElementCount).toBe(
        weatherMainContainedElements.length
      );

      weatherMainContainedElements.forEach((weatherMainChild, index) => {
        expect(weatherMain.children[index].tagName.toLocaleLowerCase()).toBe(
          weatherMainChild.tagName
        );
        expect(weatherMain.children[index].classList).toContain(
          weatherMainChild.class
        );

        if (weatherMainChild.class === "weather-main__text") {
          expect(weatherMain.children[index].querySelectorAll("p").length).toBe(
            2
          );
        }
      });

      Markup.removeMarkup();
    });
  });

  // 4) Функция createInitialMarkup
  describe("createInitialMarkup", () => {
    // 4.1) Проверяем, является ли Markup.createInitialMarkup экземпляром класса Function
    test("is a function", () => {
      expect(Markup.createInitialMarkup).toBeInstanceOf(Function);
    });

    // 4.2) Проверяем корректность базовой разметки
    test("creates initial markup", () => {
      Markup.createInitialMarkup();

      const main = document.querySelector("main");
      expect(main).toBeTruthy();

      const section = document.querySelector("section");
      expect(section).toBeTruthy();

      const title = document.querySelector("h1");
      expect(title).toBeTruthy();
      expect(title.innerHTML).toBe("Weather App");

      const form = document.getElementById("form");
      expect(form).toBeTruthy();

      const input = document.getElementById("input");
      expect(input).toBeTruthy();
      expect(input.value).toBe("");

      const btn = document.getElementById("btn");
      expect(btn).toBeTruthy();
      expect(btn.innerHTML).toBe("Enter");

      const divs = document.querySelectorAll("div");
      expect(divs.length).toBe(4);

      expect(main.contains(section)).toBeTruthy();
      expect(section.contains(title)).toBeTruthy();
      expect(section.contains(form)).toBeTruthy();
      expect(form.contains(input)).toBeTruthy();
      expect(form.contains(btn)).toBeTruthy();

      Markup.removeMarkup();
    });
  });

  // 5) Функция createMarkupElement
  describe("createMarkupElement", () => {
    // 5.1) Проверяем, является ли Markup.createMarkupElement экземпляром класса Function
    test("is a function", () => {
      expect(Markup.createMarkupElement).toBeInstanceOf(Function);
    });

    // 5.2) Проверяем корректность создания элементов разметки с заданными атрибутами и их значениями
    describe.each([
      { tagName: "div", attributes: { class: "wrapper" } },
      { tagName: "a", attributes: { class: "link", href: "https://otus.ru/" } },
      { tagName: "button", attributes: { type: "submit", id: "btn" } },
    ])("", ({ tagName, attributes }) => {
      test("creates markup element with attributes", () => {
        const newMarkupElement = Markup.createMarkupElement(
          tagName,
          attributes
        );

        expect(newMarkupElement).toBeInstanceOf(HTMLElement);
        expect(newMarkupElement.tagName.toLowerCase()).toBe(tagName);

        Object.entries(attributes).forEach(
          ([attributeName, attributeValue]) => {
            expect(newMarkupElement.getAttribute(attributeName)).toBe(
              attributeValue
            );
          }
        );
      });
    });
  });

  // 6) Функция removeMarkup
  describe("removeMarkup", () => {
    // 6.1) Проверяем, является ли Markup.removeMarkup экземпляром класса Function
    test("is a function", () => {
      expect(Markup.removeMarkup).toBeInstanceOf(Function);
    });

    // 6.2) Проверяем корректность удаления разметки
    test("removes markup", () => {
      Markup.createInitialMarkup();
      expect(document.body.innerHTML).not.toBe("");

      Markup.removeMarkup();
      expect(document.body.innerHTML).toBe("");
    });
  });
});
