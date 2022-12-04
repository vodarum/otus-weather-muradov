import { WeatherInfoModel } from "../../models/weather-info";
import LocationInfo from "../location-info/location-info";
import Markup from "../markup/markup";
import WeatherInfo from "../weather-info/weather-info";
import Util from "../../util/util";

class Main {
  constructor() {
    this.mainWeatherInfo = new WeatherInfoModel();
  }

  /**
   * Инициализировать главный экран
   */
  init() {
    // 1) Создаём базовую разметку
    Markup.createInitialMarkup();

    // 2) Вешаем обработчики на элементы страницы
    // 2.1) на форму отправки запроса информации о погоде
    const form = document.getElementById("form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.search();
    });

    // 2.2) на блок "История"
    const weatherHistoryBlock = document.getElementById("weather-history");
    weatherHistoryBlock.addEventListener("click", (event) => {
      const weatherHistoryItem = event.target.closest(".weather-history__item");

      if (weatherHistoryItem) {
        this.selectItemFromWeatherHistory(weatherHistoryItem.dataset.whItemId);
      }
    });

    // 3) Добавляем данные на главный экран
    // 3.1) получаем геоданные пользователя
    // 3.2) получаем информацию о погоде по местоположению пользователя
    // 3.3) обновляем главный экран
    LocationInfo.getCurrentLocationInfo()
      .then((currentLocationInfo) =>
        WeatherInfo.getWeatherInfoByLocationCoord(
          currentLocationInfo.latitude,
          currentLocationInfo.longitude
        )
      )
      .then((weather) => this.refresh(weather))
      .catch((error) => console.error(error));
  }

  /**
   * Сохранить предыдущее состояние
   * @param {WeatherInfoModel} weatherInfo
   */
  async savePrevStateAndRefresh(weatherInfo) {
    if (WeatherInfo.validateWeatherInfo(weatherInfo)) {
      WeatherInfo.saveWeatherInfo(this.mainWeatherInfo);

      this.refresh(weatherInfo);
    }
  }

  /**
   * Выбрать элемент Истории
   * @param {string} id ID записи Истории
   */
  async selectItemFromWeatherHistory(id) {
    if (!Util.isDefined(id)) {
      return;
    }

    const weatherHistory = JSON.parse(
      localStorage.getItem("weatherHistory") ?? "[]"
    );
    const weatherInfoByLocationCoord =
      await WeatherInfo.getWeatherInfoByLocationCoord(
        weatherHistory[+id].coord.latitude,
        weatherHistory[+id].coord.longitude
      );

    await this.savePrevStateAndRefresh(weatherInfoByLocationCoord);
  }

  /**
   * Обновить главный экран
   * @param {WeatherInfoModel} weatherInfo Информация о погоде
   */
  refresh(weatherInfo) {
    this.mainWeatherInfo = weatherInfo;

    Markup.addWeatherMainOnScreen(this.mainWeatherInfo);
    Markup.addStaticMapOnScreen(this.mainWeatherInfo.coord);
    Markup.addWeatherHistoryOnScreen();
  }

  /**
   * Найти информацию о погоде в выбранном населенном пункте
   */
  async search() {
    const input = document.getElementById("input");

    try {
      const weatherInfoByLocationName =
        await WeatherInfo.getWeatherInfoByLocationName(input.value);

      await this.savePrevStateAndRefresh(weatherInfoByLocationName);
    } catch (error) {
      console.error(`Error in Main.search: ${error}`);
    } finally {
      input.value = "";
    }
  }
}

export default new Main();
