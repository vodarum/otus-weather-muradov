class Markup {
  /**
   * Добавить изображение карты по координатам
   * @param {CoordModel} coord Координаты
   */
  addStaticMapOnScreen(coord) {
    const weatherInfoBlock = document.getElementById("weather-map");
    const map = this.createMarkupElement("img", {
      src: `https://static-maps.yandex.ru/1.x/?ll=${coord.longitude},${coord.latitude}&size=650,350&z=12&l=map`,
    });

    weatherInfoBlock.innerHTML = "";
    weatherInfoBlock.append(map);
  }

  /**
   * Добавить на страницу Историю запросов погоды
   */
  addWeatherHistoryOnScreen() {
    const weatherInfoBlock = document.getElementById("weather-history");
    weatherInfoBlock.innerHTML = "";

    const weatherHistory = JSON.parse(
      localStorage.getItem("weatherHistory") ?? "[]"
    );

    for (let i = 0, count = weatherHistory.length; i < count; i++) {
      const wrapper = this.createMarkupElement("span", {
        class: "weather-history__item",
        "data-wh-item-id": i,
      });
      wrapper.innerHTML = weatherHistory[i].city;

      weatherInfoBlock.append(wrapper);
    }
  }

  /**
   * Добавить на страницу информацию о погоде в выбранном населённом пункте
   * @param {WeatherInfoModel} weatherInfo Информация о погоде
   */
  addWeatherMainOnScreen(weatherInfo) {
    const weatherMain = document.getElementById("weather-main");
    const weatherMainImg = this.createMarkupElement("img", {
      src: `http://openweathermap.org/img/w/${weatherInfo.icon}.png`,
      class: "weather-main__img",
    });
    const weatherMainText = this.createMarkupElement("div", {
      class: "weather-main__text",
    });

    const paragraphCity = document.createElement("p");
    paragraphCity.innerHTML = `Город: ${weatherInfo.city}`;

    const paragraphTemp = document.createElement("p");
    paragraphTemp.innerHTML = `Температура: ${weatherInfo.temp}&#176;С`;

    weatherMain.innerHTML = "";
    weatherMainText.append(paragraphCity, paragraphTemp);
    weatherMain.append(weatherMainImg, weatherMainText);
  }

  /**
   * Создать базовую разметку страницы
   */
  createInitialMarkup() {
    const main = this.createMarkupElement("main", { class: "main" });
    const section = this.createMarkupElement("section", { class: "section" });
    const title = this.createMarkupElement("h1", { class: "title" });
    title.innerHTML = "Weather App";

    const form = this.createMarkupElement("form", {
      class: "form",
      id: "form",
    });
    const input = this.createMarkupElement("input", {
      type: "text",
      placeholder: "Enter an address or city name",
      class: "input",
      id: "input",
    });
    const button = this.createMarkupElement("button", {
      type: "submit",
      class: "btn",
      id: "btn",
    });
    button.innerHTML = "Enter";

    const weatherInfo = this.createMarkupElement("div", {
      class: "weather-info",
      id: "weather-info",
    });
    const weatherMain = this.createMarkupElement("div", {
      class: "weather-info__item weather-main",
      id: "weather-main",
    });
    const weatherMap = this.createMarkupElement("div", {
      class: "weather-info__item weather-map",
      id: "weather-map",
    });
    const weatherHistory = this.createMarkupElement("div", {
      class: "weather-info__item weather-history",
      id: "weather-history",
    });

    weatherInfo.append(weatherMain, weatherMap, weatherHistory);
    form.append(input, button);
    section.append(title, form, weatherInfo);
    main.append(section);

    document.body.append(main);
  }

  /**
   * Создать элемент разметки с атрибутами
   * @param {string} tagName Название тега
   * @param {*} attributes Список атрибутов и их значения для элемента разметки
   */
  createMarkupElement(tagName, attributes) {
    const newMarkupElement = document.createElement(tagName);

    Object.entries(attributes).forEach(([attributeName, attributeValue]) => {
      newMarkupElement.setAttribute(attributeName, attributeValue);
    });

    return newMarkupElement;
  }

  /**
   * Удалить разметку
   */
  removeMarkup() {
    document.body.innerHTML = "";
  }
}

export default new Markup();
